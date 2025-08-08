"use client";

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const { isSupported, isRegistered } = useServiceWorker();

  useEffect(() => {
    // Log do status PWA para debug
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      console.log('PWA Status:', {
        serviceWorkerSupported: isSupported,
        serviceWorkerRegistered: isRegistered,
        isOnline: navigator.onLine,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent,
      });
    }
  }, [isSupported, isRegistered]);

  return <>{children}</>;
}