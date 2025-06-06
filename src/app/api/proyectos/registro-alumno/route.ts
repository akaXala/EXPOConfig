import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // Creamos el cuerpo de la petición
        const {
            noboleta,
            nombre,
            appaterno,
            apmaterno,
            carrera
        } = body;

        // Validamos los campos necesarios
        if (!noboleta || !nombre || !appaterno || !apmaterno || !carrera) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        // Insertamos los datos en la DB
        const query = `
            INSERT INTO estudiante (
                noboleta,
                nombre,
                appaterno,
                apmaterno,
                carrera
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING noboleta;
        `

        // Escribimos los valores
        const values = [
            noboleta,
            nombre,
            appaterno,
            apmaterno,
            carrera,
        ];

        // Realizamos la query
        const result = await pool.query(query, values);

        return NextResponse.json(
            { success: true, id: result.rows[0].noboleta },
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