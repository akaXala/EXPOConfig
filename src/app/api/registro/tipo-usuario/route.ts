import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();  // Obtén los datos del cuerpo de la solicitud

        // Creamos el cuerpo de la petición
        const { id, rol } = body;

        // Validamos los campos más necesarios
        if (!id || ! rol) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Inseramos los datos en la DB
        const query = `
            INSERT INTO ${rol} (notrabajador)
            VALUES ($1)
            RETURNING notrabajador
        `;

        // Realizamos la query
        const result = await pool.query(query, [id]);

        return NextResponse.json(
            { success: true, id: result.rows[0].notrabajador },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Error en el registro: ", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }  
};