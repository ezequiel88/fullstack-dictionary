/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import api from "@/lib/api";
import { FavoritesResponse } from "@/types";
import { isAuthenticated } from "@/lib/auth";

export async function markAsFavorite(wordId: string) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        message: "Usuário não autenticado",
      };
    }

    const { data } = await api.post(`/entries/en/${wordId}/favorite`, {});
    
    return {
      success: true,
      data,
      message: "Palavra marcada como favorita",
    };
  } catch (error: any) {
    console.error("Mark as favorite error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao marcar como favorito",
    };
  }
}

export async function removeFavorite(wordId: string) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        message: "Usuário não autenticado",
      };
    }

    const { data } = await api.delete(`/entries/en/${wordId}/unfavorite`);
    
    return {
      success: true,
      data,
      message: "Palavra removida dos favoritos",
    };
  } catch (error: any) {
    console.error("Remove favorite error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao remover dos favoritos",
    };
  }
}

export async function getFavorites() {
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
    console.error("Get favorites error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao obter favoritos",
      data: [],
    };
  }
}
