"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearHistory } from "@/actions/history";

export function ClearHistoryButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = () => {
        startTransition(async () => {
            try {
                await clearHistory();
                toast.success("Histórico limpo com sucesso");
                router.refresh();
            } catch {
                toast.error("Erro ao limpar histórico");
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
