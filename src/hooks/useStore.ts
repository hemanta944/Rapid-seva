// Custom React Hook to consume reactive RapidSevaStore
import { useState, useEffect } from 'react';
import { store, subscribeToStore } from '../services/store';

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  return {
    store,
    activeUser: store.getActiveUser(),
    activePortal: store.getActivePortal(),
    categories: store.getCategories(),
    settings: store.getSettings(),
    users: store.getUsers(),
    vehicles: store.getVehicles(store.getActiveUser()?.id),
    allVehicles: store.getVehicles(),
    providers: store.getProviders(),
    approvedProviders: store.getApprovedProviders(),
    pendingProviders: store.getPendingProviders(),
    requests: store.getRequests(),
    payments: store.getPayments(),
    reviews: store.getReviews(),
    complaints: store.getComplaints(),
    notifications: store.getNotifications(store.getActiveUser()?.id),
    allNotifications: store.getNotifications(),
    auditLogs: store.getAuditLogs(),
  };
}
