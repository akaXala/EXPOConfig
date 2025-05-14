import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json({
    success: true,
    message: "Sesión cerrada correctamente",
  });

  // Elimina la cookie del token
  response.cookies.set("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expira inmediatamente
  });

  return response;
}; 