"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();

  try {
    // Remover token do cookie
    cookieStore.delete("token");
    
    return {
      success: true,
      message: "Logout realizado com sucesso",
    };
  } catch (error) {
    console.error("Logout error:", error);
    
    return {
      success: false,
      message: "Erro ao fazer logout",
    };
  }
}

export async function logoutAndRedirect() {
  await logoutAction();
  redirect("/");
}
