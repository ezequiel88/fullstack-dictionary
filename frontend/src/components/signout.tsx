import { logoutAction } from "@/actions";

export async function Signout() {
    async function handleLogout() {
        "use server";
        await logoutAction();
    }

    return (
        <form action={handleLogout}>
            <button type="submit" className="text-red-500">Sair</button>
        </form>
    )
}