import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // Creemos el cuerpo de la petición
        const {
            noproyecto,
            notrabajador,
        } = body;

        // Validamos los campos necesarios
        if (!noproyecto || !notrabajador) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        // Insertamos los datos en la DB
        const query = `
            INSERT INTO estutor (
                noproyecto,
                notrabajador
            ) VALUES ($1, $2)
            RETURNING notrabajador
        `

        // Escribimos los valores
        const values = [
            noproyecto,
            notrabajador,
        ]

        // Realizamos la query
        const result = await pool.query(query, values);

        return NextResponse.json(
            { success: true, id: result.rows[0].notrabajador },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error en el registro: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}