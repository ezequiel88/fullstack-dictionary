/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { AuthResponse, AuthSignIn } from "@/types";
import { validateSignIn } from "@/lib/validations";
import { cookies } from "next/headers";
import api from "@/lib/api";

export async function loginAction(payload: AuthSignIn) {
  const cookieStore = await cookies();
  
  try {
    // Validar dados de entrada
    const validation = validateSignIn(payload);
    if (!validation.success) {
      return {
        success: false,
        message: "Dados inválidos",
        errors: validation.error,
      };
    }

    // Fazer requisição para a API
    const { data } = await api.post<AuthResponse>("/auth/signin", payload);
    
    // Salvar token no cookie httpOnly
    cookieStore.set("token", data.token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
    
    return {
      success: true,
      data,
      message: "Login realizado com sucesso",
    };
  } catch (error: any) {
    console.error("Login error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao fazer login",
      errors: error.data?.errors || [],
    };
  }
}
