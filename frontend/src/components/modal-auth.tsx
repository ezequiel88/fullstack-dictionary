/* eslint-disable @typescript-eslint/no-explicit-any */
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
                    <DialogTitle>{mode === "signup" ? "Create Account" : "Sign In"}</DialogTitle>
                    <DialogDescription>
                        {mode === "signup"
                            ? "Start your language learning journey today"
                            : "Welcome back! Please sign in to continue"}
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
                            Already have an account?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => onModeChange("signin")}
                            >
                                Sign in
                            </Button>
                        </>
                    ) : (
                        <>
                            Don&apos;t have an account?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-semibold"
                                onClick={() => onModeChange("signup")}
                            >
                                Sign up
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
