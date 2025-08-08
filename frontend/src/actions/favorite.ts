"use server";

import api from "@/lib/api";

export async function markAsFavorite(id: string) {
    try {
        const { data } = await api.post(`/entries/en/${id}/favorite`, {});
        return data
    } catch (error) {
        return null
    }
}

export async function removeFavorite(id: string) {
    try {
        const { data } = await api.delete(`/entries/en/${id}/unfavorite`);
        return data
    } catch (error) {
        return null
    }
}

export async function getFavorites() {
    try {
        const { data } = await api.get(`/user/me/favorites`);
        return data
    } catch (error) {
        return null
    }
}
