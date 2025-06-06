import { NextResponse } from "next/server";
import pool from "@/config/database"; // Conexión a PostgreSQL

export const GET = async () => {
    try {
        const query = `
            SELECT 
                notrabajador, 
                CONCAT(nombre, ' ', appaterno, ' ', COALESCE(apmaterno, '')) AS nombre_completo
            FROM vistaprofesores
        `;
        const result = await pool.query(query);

        // Retorna los resultados como JSON
        return NextResponse.json(
            { success: true, data: result.rows },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error en obtener profesores:", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );        
    }
}