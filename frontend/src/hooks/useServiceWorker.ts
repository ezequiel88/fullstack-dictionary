"use client";

import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  registration: ServiceWorkerRegistration | null;
  isOnline: boolean;
  updateAvailable: boolean;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    registration: null,
    isOnline: navigator?.onLine ?? true,
    updateAvailable: false,
  });

  useEffect(() => {
    // Verifica se service worker é suportado
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      setState(prev => ({ ...prev, isSupported: true }));
      
      // Registra o service worker
      registerServiceWorker();
      
      // Monitora status online/offline
      const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
      const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setState(prev => ({ 
        ...prev, 
        isRegistered: true, 
        registration 
      }));

      console.log('Service Worker registrado com sucesso:', registration);

      // Verifica por atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, updateAvailable: true }));
              console.log('Nova versão do app disponível!');
            }
          });
        }
      });

      // Escuta mensagens do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Mensagem do Service Worker:', event.data);
      });

    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  };

  const updateServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.update();
        window.location.reload();
      } catch (error) {
        console.error('Erro ao atualizar Service Worker:', error);
      }
    }
  };

  const unregisterServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.unregister();
        setState(prev => ({ 
          ...prev, 
          isRegistered: false, 
          registration: null,
          updateAvailable: false 
        }));
        console.log('Service Worker desregistrado');
      } catch (error) {
        console.error('Erro ao desregistrar Service Worker:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const subscribeToPushNotifications = async () => {
    if (state.registration && 'PushManager' in window) {
      try {
        const subscription = await state.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
        
        console.log('Inscrito em notificações push:', subscription);
        return subscription;
      } catch (error) {
        console.error('Erro ao se inscrever em notificações push:', error);
        return null;
      }
    }
    return null;
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker,
    requestNotificationPermission,
    subscribeToPushNotifications,
  };
};