"use server";

import api from "@/lib/api";
import { User } from "@/types";

export async function getUser() {
    try {
        const { data } = await api.get<User>(`/user/me`);
        console.log(data);
        return data
    } catch (error) {
        return null
    }
}
