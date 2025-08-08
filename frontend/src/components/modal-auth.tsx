"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/context/authContext";
import clsx from "clsx";

type AuthFormValues = {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

// ------------------- SCHEMAS -------------------
const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
    .object({
        name: z.string().min(2, "Full name is required"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "signin" | "signup";
    onModeChange: (mode: "signin" | "signup") => void;
}

export const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
    const { signIn, signUp, isLoading } = useAuth();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    // Escolhe schema baseado no modo
    const schema = mode === "signup" ? signUpSchema : signInSchema;
    type FormValues = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<AuthFormValues>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    const onSubmit = async (data: FormValues) => {
        try {
            if (mode === "signup") {
                const { name, email, password } = data as z.infer<typeof signUpSchema>;
                await signUp({ name, email, password });
                toast({ title: "Account created successfully!", description: "Welcome to Dictionary!" });
            } else {
                const { email, password } = data as z.infer<typeof signInSchema>;
                await signIn({ email, password });
                toast({ title: "Welcome back!", description: "Login successful." });
            }
            reset();
            onClose();
        } catch (error: any) {
            alert(error)
            toast({ title: "Error", description: error, variant: "destructive" });
        }
    };

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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-4">
                    {mode === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className={clsx("relative transition-transform", errors.name && "animate-shake")}>
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter your full name"
                                    {...register("name")}
                                    className="pl-10"
                                />
                            </div>
                            {"name" in errors && errors.name && (
                                <p className="text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className={clsx("relative transition-transform", errors.email && "animate-shake")}>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                autoComplete="off"
                                placeholder="Enter your email"
                                {...register("email")}
                                className="pl-10"
                            />
                        </div>
                        {"email" in errors && errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className={clsx("relative transition-transform", errors.password && "animate-shake")}>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                autoComplete="off"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...register("password")}
                                className="pl-10 pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {"password" in errors && errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {mode === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div
                                className={clsx(
                                    "transition-transform",
                                    errors.confirmPassword && "animate-shake"
                                )}
                            >
                                <Input
                                    autoComplete="off"
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword")}
                                />
                            </div>
                            {"confirmPassword" in errors && errors.confirmPassword && (
                                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
                        {isLoading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
                    </Button>
                </form>

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
                            Don't have an account?{" "}
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
