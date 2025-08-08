"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { clearHistory } from "@/actions";

export function ClearHistoryButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = () => {
        startTransition(async () => {
            try {
                await clearHistory();
                showToast.history.clearSuccess();
                router.refresh();
            } catch {
                showToast.history.clearError();
            }
        });
    };

    return (
        <Button
            onClick={handleClick}
            variant="destructive"
            disabled={isPending}
        >
            {isPending ? "Limpando..." : "Limpar Histórico"}
        </Button>
    );
}
