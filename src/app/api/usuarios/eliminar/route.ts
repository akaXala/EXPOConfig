import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // Creamos el cuerpo de la petición
        const {
            notrabajador,
        } = body;

        // Validamos los campos más necesarios
        if (!notrabajador) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Inicia una transacción
        await pool.query("BEGIN");

        // Hacemos un DELETE ON CASCADE (solo profesor)
        await pool.query(
            `DELETE FROM estutor WHERE notrabajador = $1`,
            [notrabajador]
        );
        await pool.query(
            `DELETE FROM evalua WHERE notrabajador = $1`,
            [notrabajador]
        );
        await pool.query(
            `DELETE FROM profesor WHERE notrabajador = $1`,
            [notrabajador]
        );

        // Creamos la Query
        const query = `
            DELETE FROM usuario
            WHERE notrabajador = $1;
        `;

        // Escribimos los datos de la petición
        const values = [notrabajador];

        // Realizamos la query
        const result = await pool.query(query, values);

        // Filtro por si el usuario dejo de existir
        if (result.rowCount === 0) {
            await pool.query("ROLLBACK");
            return NextResponse.json(
                { success: false, error: "Usuario no encontrado." },
                { status: 404 }
            );
        }

        await pool.query("COMMIT");
        return NextResponse.json(
            { success: true },
            { status: 201 }
        );
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error en la actualización del registro: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}