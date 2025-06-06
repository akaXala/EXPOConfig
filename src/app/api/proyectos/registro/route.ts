import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // Creamos el cuerpo de la petición
        const {
            nombre,
            ua,
            grupo,
            academia,
            descripcion,
            cartel,
        } = body;

        // Validamos los campos necesarios
        if (!nombre || !ua || !grupo || !academia || !descripcion || !cartel) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Insertamos los datos en la DB
        const query = `
            INSERT INTO proyecto (
                nombre,
                ua,
                grupo,
                academia,
                descripcion,
                cartel
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING noproyecto;
        `;

        // Escribimos los valores
        const values = [
            nombre,
            ua,
            grupo,
            academia,
            descripcion,
            cartel,
        ];

        // Realizamos la query
        const result = await pool.query(query, values);

        return NextResponse.json(
            { success: true, id: result.rows[0].noproyecto },
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