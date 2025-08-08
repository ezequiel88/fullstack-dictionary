"use server";

import api from "@/lib/api";
import { AuthResponse, AuthSignIn } from "@/types";
import { cookies } from "next/headers";

export async function loginAction(payload: AuthSignIn) {
    const cookieStore = await cookies()
    try {
        const { data } = await api.post<AuthResponse>(`/auth/signin`, payload);
        cookieStore.set("token", data.token, { httpOnly: true });
        return data
    } catch (error) {
        throw error
    }
}
