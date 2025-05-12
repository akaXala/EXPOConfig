import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "@/config/database"; // Conexión a PostgreSQL

const SECRET_KEY = process.env.SECRET_KEY || process.env.SECRET_KEY2 || "tu-clave-secreta";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { email, contrasena } = body;

        if (!email || !contrasena) {
            return NextResponse.json(
                { success: false, error: "Correo y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        // Obtenemos el rol
        const domain = email.split("@")[1]?.split(".")[0];
        let rol = domain;

        let query = "";
        let idColumn = "";

        if (rol === "profesor") {
            query = `SELECT notrabajador AS id, contrasena FROM proflogin WHERE email = $1`;
            idColumn = "notrabajador";
        } else if (rol === "organizador") {
            query = `SELECT notrabajador AS id, contrasena FROM orglogin WHERE email = $1`;
            idColumn = "notrabajador";
        } else if (rol === "impresiones") {
            query = `SELECT notrabajador AS id, contrasena FROM imprlogin WHERE email = $1`;
            idColumn = "notrabajador";
        } else if (rol === "administrador") {
            query = `SELECT notrabajador AS id, contrasena FROM adminlogin WHERE email = $1`;
            idColumn = "notrabajador";
        }

        let result;

        try {
            result = await pool.query(query, [email]);
        } catch (dbError) {
            console.error("Error en la consulta de la base de datos: ", dbError);
            return NextResponse.json(
                { success: false, error: "Error al consultar en la base de datos." },
                { status: 500 }
            );
        }

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Correo no registrado" },
                { status: 404 }
            );
        }

        const { id, contrasena: hashedPassword } = result.rows[0];

        console.log(hashedPassword);

        const isPasswordValid = await bcrypt.compare(contrasena, hashedPassword);
        if (!isPasswordValid) {
        return NextResponse.json(
            { success: false, error: "Contraseña incorrecta" },
            { status: 401 }
        );
        }

        let token;
        try {
            token = jwt.sign({ id, email, rol }, SECRET_KEY, { expiresIn: "1h" });
        } catch (error) {
            console.error("Error al generar el token:", error);
            return NextResponse.json(
                { success: false, error: "Error al generar el token" },
                { status: 500 }
            );
        }

        // Determinar la URL de redirección según el rol
        const redirectUrl =
        rol === "profesor"
            ? "/profesor"
            : rol === "organizador"
            ? "/organizador"
            : rol === "impresiones"
            ? "/impresiones"
            : "/administrador";

        const response = NextResponse.json({
            success: true,
            message: "Sesión iniciada correctamente",
            redirectUrl, // URL de redirección basada en el rol
        });

        response.cookies.set("auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600,
            path: "/",
        });

        return response;        
    } catch (error) {
        console.error("Error en el inicio de sesion: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}