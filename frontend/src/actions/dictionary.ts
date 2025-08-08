/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import api from "@/lib/api";
import { WordDefinition, WordListResponse, WordQueryParams } from "@/types";

export async function searchWord(word: string) {
  try {
    const { data } = await api.get<WordDefinition>(`/entries/en/${word}`);
    
    return {
      success: true,
      data,
      message: "Palavra encontrada",
    };
  } catch (error: any) {
    console.error("Search word error:", error);
    
    return {
      success: false,
      message: error.message || "Palavra não encontrada",
      data: null,
    };
  }
}

export async function getWordsList(params?: WordQueryParams) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.cursor) {
      queryParams.append("cursor", params.cursor);
    }

    const url = `/entries/en${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const { data } = await api.get<WordListResponse>(url);
    
    return {
      success: true,
      data,
      message: "Lista de palavras obtida com sucesso",
    };
  } catch (error: any) {
    console.error("Get words list error:", error);
    
    return {
      success: false,
      message: error.message || "Erro ao obter lista de palavras",
      data: null,
    };
  }
}