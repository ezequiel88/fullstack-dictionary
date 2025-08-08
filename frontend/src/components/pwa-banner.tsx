"use client";

import { usePwaPrompt } from "@/hooks/usePwaPrompt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PwaInstallBanner() {
  const { promptToInstall, canInstall, isInstalled } = usePwaPrompt();

  if (isInstalled || !canInstall) return null;

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 shadow-lg w-[90%] max-w-md p-4 flex flex-row items-center z-50">
      <div className="flex-1">
        <p className="font-bold">Instale o nosso app!</p>
        <p className="text-sm text-muted-foreground">Acesse mais rápido e use offline.</p>
      </div>
      <Button onClick={promptToInstall}>Instalar</Button>
    </Card>
  );
}
