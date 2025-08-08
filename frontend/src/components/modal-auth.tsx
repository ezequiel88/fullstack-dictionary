"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "signin" | "signup";
    onModeChange: (mode: "signin" | "signup") => void;
}

export const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === "signup" ? "Criar Conta" : "Entrar"}</DialogTitle>
                    <DialogDescription>
                        {mode === "signup"
                            ? "Comece sua jornada de aprendizado hoje"
                            : "Bem-vindo de volta! Faça login para continuar"}
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4">
                    {mode === "signup" ? (
                        <SignUpForm onSuccess={onClose} />
                    ) : (
                        <SignInForm onSuccess={onClose} />
                    )}
                </div>

                <div className="text-center text-sm">
                    {mode === "signup" ? (
                        <>
                            Já tem uma conta?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => onModeChange("signin")}
                            >
                                Entrar
                            </Button>
                        </>
                    ) : (
                        <>
                            Não tem uma conta?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => onModeChange("signup")}
                            >
                                Criar conta
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
