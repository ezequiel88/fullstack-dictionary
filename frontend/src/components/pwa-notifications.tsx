"use client";

import { useEffect, useState } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WifiOff, Download, X } from 'lucide-react';

export function PwaNotifications() {
  const { isOnline, updateAvailable, updateServiceWorker } = useServiceWorker();
  const [showOfflineNotification, setShowOfflineNotification] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  useEffect(() => {
    setShowOfflineNotification(!isOnline);
  }, [isOnline]);

  useEffect(() => {
    setShowUpdateNotification(updateAvailable);
  }, [updateAvailable]);

  const handleUpdate = () => {
    updateServiceWorker();
    setShowUpdateNotification(false);
  };

  const dismissUpdate = () => {
    setShowUpdateNotification(false);
  };

  const dismissOffline = () => {
    setShowOfflineNotification(false);
  };

  return (
    <>
      {/* Notificação de Offline */}
      {showOfflineNotification && (
        <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 shadow-lg w-[90%] max-w-md p-4 flex flex-row items-center z-50 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
          <WifiOff className="h-5 w-5 text-orange-600 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-orange-800 dark:text-orange-200">
              Você está offline
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-300">
              Alguns recursos podem estar limitados
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissOffline}
            className="ml-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {/* Notificação de Atualização */}
      {showUpdateNotification && (
        <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 shadow-lg w-[90%] max-w-md p-4 flex flex-row items-center z-50 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <Download className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              Atualização disponível
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Nova versão do app está pronta
            </p>
          </div>
          <div className="flex gap-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissUpdate}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Atualizar
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}