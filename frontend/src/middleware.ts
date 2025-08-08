import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Somente "/" é pública (para quem não está autenticado)
const publicRoutes = ["/"];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Permite service worker e outros arquivos PWA sem redirecionamento
  if (nextUrl.pathname === "/sw.js" || 
      nextUrl.pathname === "/offline.html" ||
      nextUrl.pathname === "/manifest.json") {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname === route ||
    nextUrl.pathname.startsWith(`${route}/`)
  );

  // 1. Não autenticado tentando acessar rota privada → manda para landing "/"
  if (!token && !isPublicRoute) {
    const url = new URL("/", req.url);
    url.searchParams.set("redirect", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  // 2. Autenticado tentando acessar "/" (landing) → manda para /dictionary
  if (token && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dictionary", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth/|_next/|favicon.ico|manifest.json|sw.js|offline.html|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)",
  ],
};
