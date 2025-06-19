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

        // Verifica si el alumno ya existe
        const checkQuery = `SELECT noboleta FROM estudiante WHERE noboleta = $1`;
        const checkResult = await pool.query(checkQuery, [noboleta]);

        if ((checkResult.rowCount ?? 0) > 0) {
            // Ya existe, regresa el id (noboleta)
            return NextResponse.json(
                { success: true, id: checkResult.rows[0].noboleta, alreadyExists: true },
                { status: 200 }
            );
        }

        // Si no existe, inserta el alumno
        const query = `
            INSERT INTO estudiante (
                noboleta,
                nombre,
                appaterno,
                apmaterno,
                carrera
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING noboleta;
        `;

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
            { success: true, id: result.rows[0].noboleta, alreadyExists: false },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en el registro: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}