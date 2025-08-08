"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";
import { showToast, getErrorMessage } from "@/lib/toast";

const signUpSchema = z
    .object({
        name: z.string().min(2, "Nome completo é obrigatório"),
        email: z.string().email("Endereço de email inválido"),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
        confirmPassword: z.string().min(6, "Por favor, confirme sua senha"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
    onSuccess: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
    const { signUp, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            const { name, email, password } = data;
            await signUp({ name, email, password });
            showToast.auth.signupSuccess();
            reset();
            onSuccess();
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);
            showToast.auth.signupError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className={clsx("relative transition-transform", errors.name && "animate-shake")}>
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Digite seu nome completo"
                        {...register("name")}
                        className="pl-10"
                    />
                </div>
                {errors.name && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className={clsx("relative transition-transform", errors.email && "animate-shake")}>
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Digite seu email"
                        {...register("email")}
                        className="pl-10"
                    />
                </div>
                {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className={clsx("relative transition-transform", errors.password && "animate-shake")}>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        autoComplete="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
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
                {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className={clsx("relative transition-transform", errors.confirmPassword && "animate-shake")}>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        autoComplete="new-password"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirme sua senha"
                        {...register("confirmPassword")}
                        className="pl-10"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
        </form>
    );
};