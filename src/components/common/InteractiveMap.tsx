import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface InteractiveMapProps {
  customerLocation?: { lat: number; lng: number; address?: string };
  providerLocation?: { lat: number; lng: number; businessName?: string };
  isSearching?: boolean;
  etaMinutes?: number;
  height?: string;
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  isInteractivePicker?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  customerLocation = { lat: 26.1558, lng: 91.7766, address: 'GS Road, Dispur, Guwahati, Assam' },
  providerLocation,
  isSearching = false,
  etaMinutes,
  height = '320px',
  className = '',
  onLocationSelect,
  isInteractivePicker = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [customerLocation.lat, customerLocation.lng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Standard OpenStreetMap Tile Layer (Free, Open, Zero Watermark / No API Key required)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    if (onLocationSelect) {
      map.off('click');
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    markersGroup.clearLayers();

    // 1. Customer Marker (Pulsing Orange)
    const customerIcon = L.divIcon({
      className: 'custom-customer-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-[#F04416] opacity-30 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-[#F04416] border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const custMarker = L.marker([customerLocation.lat, customerLocation.lng], { icon: customerIcon })
      .bindPopup(`<b>Your Breakdown Spot</b><br/>${customerLocation.address || 'Selected Location'}`);
    markersGroup.addLayer(custMarker);

    // 2. Searching Radar Wave
    if (isSearching) {
      const radarCircle = L.circle([customerLocation.lat, customerLocation.lng], {
        radius: 3500, // 3.5 km search radius
        color: '#F04416',
        weight: 1.5,
        fillColor: '#F04416',
        fillOpacity: 0.12,
        dashArray: '4, 8',
      });
      markersGroup.addLayer(radarCircle);
    }

    // 3. Provider Marker & Route
    if (providerLocation) {
      const providerIcon = L.divIcon({
        className: 'custom-provider-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-[#111111] border-2 border-[#F04416] shadow-xl flex items-center justify-center text-white text-sm">
              🛠️
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const provMarker = L.marker([providerLocation.lat, providerLocation.lng], { icon: providerIcon })
        .bindPopup(`<b>${providerLocation.businessName || 'Assigned Mechanic'}</b><br/>En Route`);
      markersGroup.addLayer(provMarker);

      // Route polyline
      const latlngs: [number, number][] = [
        [customerLocation.lat, customerLocation.lng],
        [(customerLocation.lat + providerLocation.lat) / 2 + 0.003, (customerLocation.lng + providerLocation.lng) / 2 - 0.002],
        [providerLocation.lat, providerLocation.lng],
      ];

      const polyline = L.polyline(latlngs, {
        color: '#F04416',
        weight: 4,
        opacity: 0.85,
        lineCap: 'round',
        dashArray: '1, 10',
      });
      markersGroup.addLayer(polyline);

      // Fit bounds to show both
      const bounds = L.latLngBounds([
        [customerLocation.lat, customerLocation.lng],
        [providerLocation.lat, providerLocation.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView([customerLocation.lat, customerLocation.lng], 14);
    }

    // Handle container resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [customerLocation, providerLocation, isSearching]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${className}`} style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Status Pill */}
      {etaMinutes && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200 shadow-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-gray-800">
            ETA: <span className="text-[#F04416] font-bold">~{etaMinutes} mins</span>
          </span>
        </div>
      )}

      {isSearching && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-orange-200 shadow-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F04416] animate-ping"></span>
          <span className="text-xs font-semibold text-gray-800">
            Live Radar: <span className="text-[#F04416] font-bold">Scanning area</span>
          </span>
        </div>
      )}

      {isInteractivePicker && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#F04416] shadow-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F04416] animate-pulse"></span>
          <span className="text-xs font-bold text-gray-800">
            Tap map to reposition breakdown pin
          </span>
        </div>
      )}

      {/* Location watermark */}
      <div className="absolute bottom-2 left-2 z-[1000] bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
        RapidSeva Live Telematics
      </div>
    </div>
  );
};
