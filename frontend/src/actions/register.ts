"use server";

import api from "@/lib/api";
import { AuthSignUp, AuthResponse } from "@/types";
import { cookies } from "next/headers";

export async function registerAction(payload: AuthSignUp) {
  const cookieStore = await cookies()
  try {
    const { data } = await api.post<AuthResponse>(`/auth/signup`, payload);
    cookieStore.set("token", data.token, { httpOnly: true });
    return data
  } catch (error) {
    throw error
  }
}
