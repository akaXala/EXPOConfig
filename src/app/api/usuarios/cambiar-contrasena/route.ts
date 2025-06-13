import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/config/database";

export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // Creamos el cuerpo de la petición
        const {
            contrasena,
            notrabajador
        } = body;

        // Validamos los campos más necesarios
        if (!notrabajador || !contrasena) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Hasheamos la nueva contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Creamos la Query
        const query = `
            UPDATE usuario
            SET contrasena = $1
            WHERE notrabajador = $2
            RETURNING notrabajador;
        `;

        // Escribimos los datos de la petición
        const values = [
            hashedPassword,
            notrabajador,
        ];

        // Realizamos la query
        const result = await pool.query(query, values);

        // Filtro por si el usuario dejo de existir
        if (result.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: "Usuario no encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, id: result.rows[0].notrabajador },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en la actualización del registro: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}