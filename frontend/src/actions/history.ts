"use server";

import api from "@/lib/api";

export async function getHistory() {
  try {
    const { data } = await api.get(`/user/me/history`);
    console.log(data)
    return data
  } catch (error) {
    return null
  }
}
