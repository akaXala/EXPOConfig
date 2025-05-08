import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY || "tu-clave-secreta");

// Rutas protegidas por rol
const roleBasedRoutes: Record<string, string[]> = {
  administrador: ["/administrador", "/registro"],
  instructor: ["/instructor"],
  organizador: ["/organizador", "/eventos"],
  competidor: ["/competidor", "/eventos-competidor"],
};

// Página inicial por rol
const roleHomePages: Record<string, string> = {
  administrador: "/administrador",
  instructor: "/instructor",
  organizador: "/organizador",
  competidor: "/competidor",
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;

  if (token) {
    try {
      // Verificar el token usando `jose`
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const { rol } = payload as { rol: string };

      const pathname = req.nextUrl.pathname;

      // Redirigir desde `/` a la página principal según el rol
      if (pathname === "/") {
        const redirectUrl = roleHomePages[rol] || "/";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }

      // Proteger rutas según el rol
      const allowedRoutes = roleBasedRoutes[rol];
      if (allowedRoutes && !allowedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", req.url)); // Redirige a la raíz si no tiene permisos
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Token inválido o expirado:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Si no hay token, permitir acceso solo a la raíz (`/`) para el login
  const pathname = req.nextUrl.pathname;
  if (pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configuración del middleware para todas las rutas
export const config = {
  matcher: ["/", "/administrador/:path*", "/instructor/:path*", "/organizador/:path*", "/competidor/:path*", "/eventos/:path*", "/registro/:path*"],
};