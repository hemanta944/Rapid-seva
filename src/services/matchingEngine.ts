// RapidSeva Provider Matching Engine
// Matches assistance requests with verified, online, available providers
import { AssistanceRequest, ServiceProvider } from '../types';
import { store } from './store';

export interface MatchCandidate {
  provider: ServiceProvider;
  distanceKm: number;
  estimatedEtaMinutes: number;
  matchScore: number;
}

// Calculate Haversine distance between two GPS coordinates in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

// Find all eligible providers for an assistance request
export function findMatchingProviders(request: AssistanceRequest): MatchCandidate[] {
  const allProviders = store.getProviders();

  // Criteria 1: Provider must be APPROVED (never unapproved or suspended)
  // Criteria 2: Provider must be ONLINE
  // Criteria 3: Provider must be AVAILABLE (not busy with active job)
  // Criteria 4: Provider must support requested service category
  const eligible = allProviders.filter((prov) => {
    if (prov.verificationStatus !== 'approved') return false;
    if (!prov.isOnline) return false;
    if (!prov.isAvailable) return false;
    if (!prov.serviceCategories.includes(request.serviceCategoryId)) return false;
    return true;
  });

  // Calculate distance, ETA, and composite match score for each eligible provider
  const candidates: MatchCandidate[] = eligible.map((prov) => {
    const dist = calculateDistanceKm(
      request.location.lat,
      request.location.lng,
      prov.currentLocation.lat,
      prov.currentLocation.lng
    );

    // Realistic urban breakdown speed estimate (~20 km/h + 5 min dispatch overhead)
    const eta = Math.max(10, Math.round(dist * 3 + 5));

    // Match score: Weight distance heavily, plus rating bonus
    // Lower score is better
    const matchScore = dist * 2 - (prov.rating || 4.5);

    return {
      provider: prov,
      distanceKm: dist,
      estimatedEtaMinutes: eta,
      matchScore,
    };
  });

  // Sort by closest & highest rated
  candidates.sort((a, b) => a.matchScore - b.matchScore);

  return candidates;
}

// Matching Dispatch Controller with Timeout
class MatchingController {
  private activeTimers: Map<string, number> = new Map();

  // Start matching workflow for a new assistance request
  startMatching(requestId: string, onNoProviderFound?: () => void) {
    const request = store.getRequests().find((r) => r.id === requestId);
    if (!request || request.status !== 'REQUEST_RECEIVED') return;

    // Transition status to PROVIDER_NOTIFIED
    store.updateRequestStatus(
      requestId,
      'PROVIDER_NOTIFIED',
      'Matching engine scanning for verified nearby roadside technicians...',
      'system'
    );

    const candidates = findMatchingProviders(request);

    // Filter out providers already dispatched and declined for this request
    const availableCandidates = candidates.filter(
      (c) => !request.dispatchedProviderIds.includes(c.provider.id)
    );

    if (availableCandidates.length === 0) {
      this.handleNoProvider(requestId, onNoProviderFound);
      return;
    }

    // Pick top eligible candidate
    const topMatch = availableCandidates[0];
    this.offerRequestToProvider(requestId, topMatch, onNoProviderFound);
  }

  // Offer request to a specific provider with a countdown timeout
  private offerRequestToProvider(
    requestId: string,
    match: MatchCandidate,
    onNoProviderFound?: () => void
  ) {
    const request = store.getRequests().find((r) => r.id === requestId);
    if (!request || request.status === 'CANCELLED' || request.status === 'PROVIDER_ACCEPTED') {
      return;
    }

    const updatedDispatched = [...request.dispatchedProviderIds, match.provider.id];

    store.updateRequestStatus(
      requestId,
      'PROVIDER_NOTIFIED',
      `Assistance request dispatched to ${match.provider.businessName} (~${match.distanceKm} km away). Awaiting acceptance.`,
      'system',
      {
        dispatchedProviderIds: updatedDispatched,
        currentOfferedProviderId: match.provider.id,
        offeredAt: new Date().toISOString(),
        estimatedArrivalMinutes: match.estimatedEtaMinutes,
      }
    );

    // Notify provider with instant push alert
    store.addNotification({
      recipientId: match.provider.userId,
      recipientRole: 'provider',
      title: '🚨 New Roadside Assistance Request!',
      message: `${request.serviceCategoryName} needed at ${request.location.address} (~${match.distanceKm} km).`,
      type: 'booking',
      referenceId: request.id,
    });

    // Set timeout timer for provider response (45 seconds)
    const timeoutMs = (request.providerResponseTimeoutSeconds || 45) * 1000;
    
    // Clear any previous timer
    if (this.activeTimers.has(requestId)) {
      window.clearTimeout(this.activeTimers.get(requestId));
    }

    const timerId = window.setTimeout(() => {
      this.handleProviderTimeout(requestId, match.provider.id, onNoProviderFound);
    }, timeoutMs);

    this.activeTimers.set(requestId, timerId);
  }

  // Provider accepted the request
  handleProviderAcceptance(
    requestId: string,
    providerId: string,
    confirmedEtaMinutes: number,
    priceQuote?: number
  ) {
    // Clear timeout
    if (this.activeTimers.has(requestId)) {
      window.clearTimeout(this.activeTimers.get(requestId));
      this.activeTimers.delete(requestId);
    }

    const prov = store.getProviders().find((p) => p.id === providerId);
    if (!prov) return;

    // Mark provider as engaged / unavailable for other simultaneous calls
    prov.isAvailable = false;

    const request = store.getRequests().find((r) => r.id === requestId);
    const finalPrice = priceQuote || request?.estimatedPrice || 499;

    store.updateRequestStatus(
      requestId,
      'PROVIDER_ACCEPTED',
      `${prov.businessName} (${prov.fullName}) accepted your request. Confirmed ETA: ~${confirmedEtaMinutes} mins.`,
      'provider',
      {
        assignedProviderId: prov.id,
        providerName: prov.fullName,
        providerPhone: prov.phone,
        providerBusinessName: prov.businessName,
        providerRating: prov.rating,
        providerLocation: prov.currentLocation,
        confirmedEtaMinutes,
        finalPrice,
        estimatedArrivalMinutes: confirmedEtaMinutes,
      }
    );
  }

  // Provider declined the request
  handleProviderDecline(requestId: string, providerId: string, onNoProviderFound?: () => void) {
    if (this.activeTimers.has(requestId)) {
      window.clearTimeout(this.activeTimers.get(requestId));
      this.activeTimers.delete(requestId);
    }

    // Cascade to next available provider
    this.startMatching(requestId, onNoProviderFound);
  }

  // Provider timeout
  private handleProviderTimeout(requestId: string, providerId: string, onNoProviderFound?: () => void) {
    const req = store.getRequests().find((r) => r.id === requestId);
    if (!req || req.status !== 'PROVIDER_NOTIFIED' || req.assignedProviderId) {
      return;
    }

    // Move to next candidate
    this.startMatching(requestId, onNoProviderFound);
  }

  // No provider available in coverage area
  private handleNoProvider(requestId: string, onNoProviderFound?: () => void) {
    const req = store.getRequests().find((r) => r.id === requestId);
    if (!req || req.status === 'PROVIDER_ACCEPTED') return;

    store.updateRequestStatus(
      requestId,
      'CANCELLED',
      'No approved roadside mechanics currently available in your immediate perimeter. We do not make false promises — please consider calling our helpline or trying again shortly.',
      'system',
      {
        cancellationReason: 'NO_NEARBY_PROVIDERS_AVAILABLE',
        cancelledBy: 'admin',
        cancelledAt: new Date().toISOString(),
      }
    );

    if (onNoProviderFound) {
      onNoProviderFound();
    }
  }
}

export const matchingController = new MatchingController();
