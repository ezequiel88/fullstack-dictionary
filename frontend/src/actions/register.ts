/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import api from "@/lib/api";
import { AuthSignUp, AuthResponse } from "@/types";
import { validateSignUp } from "@/lib/validations";
import { cookies } from "next/headers";

export async function registerAction(payload: AuthSignUp) {
  const cookieStore = await cookies();
  
  try {
    // Validar dados de entrada
    const validation = validateSignUp(payload);
    if (!validation.success) {
      return {
        success: false,
        message: "Dados inválidos",
        errors: validation.error.issues.map(issue => issue.message),
      };
    }

    // Fazer requisição para a API
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    
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
      message: "Cadastro realizado com sucesso",
    };
  } catch (error: any) {
    console.error("Register error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao fazer cadastro",
      errors: error.data?.errors || [],
    };
  }
}
