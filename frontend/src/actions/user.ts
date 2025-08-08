/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import api from "@/lib/api";
import { User, HistoryResponse, FavoritesResponse } from "@/types";
import { isAuthenticated } from "@/lib/auth";

export async function getUserProfile() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        message: "Usuário não autenticado",
        data: null,
      };
    }

    const { data } = await api.get<User>("/user/me");
    
    return {
      success: true,
      data,
      message: "Perfil obtido com sucesso",
    };
  } catch (error: any) {
    console.error("Get user profile error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao obter perfil do usuário",
      data: null,
    };
  }
}

export async function getUserHistory() {
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
    console.error("Get user history error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao obter histórico",
      data: [],
    };
  }
}

export async function getUserFavorites() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        message: "Usuário não autenticado",
        data: [],
      };
    }

    const { data } = await api.get<FavoritesResponse>("/user/me/favorites");
    
    return {
      success: true,
      data,
      message: "Favoritos obtidos com sucesso",
    };
  } catch (error: any) {
    console.error("Get user favorites error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao obter favoritos",
      data: [],
    };
  }
}
