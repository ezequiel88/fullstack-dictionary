/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import api from "@/lib/api";
import { HistoryResponse } from "@/types";
import { isAuthenticated } from "@/lib/auth";

export async function getHistory() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        message: "Usuário não autenticado",
        data: [],
      };
    }

    const { data } = await api.get<HistoryResponse>("/user/me/history");
    
    return {
      success: true,
      data,
      message: "Histórico obtido com sucesso",
    };
  } catch (error: any) {
    console.error("Get history error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao obter histórico",
      data: [],
    };
  }
}

export async function clearHistory() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        message: "Usuário não autenticado",
      };
    }

    await api.delete("/user/me/history");
    
    return {
      success: true,
      message: "Histórico limpo com sucesso",
    };
  } catch (error: any) {
    console.error("Clear history error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao limpar histórico",
    };
  }
}
