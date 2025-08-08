import { logoutAction } from "@/actions/logout";

export async function Signout() {
    return (
        <form action={logoutAction}>
            <button type="submit" className="text-red-500">Sair</button>
        </form>
    )
}