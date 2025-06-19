import { NextRequest, NextResponse } from "next/server";
import pool from "@/config/database";

export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // Creamos el cuerpo de la petición
        const {
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            fechaNacimiento,
            sexo,
            telefono,
            notrabajador,
        } = body;

        // Validamos los campos más necesarios
        if (!notrabajador || !nombre || !apellidoPaterno || !fechaNacimiento || !sexo || !telefono) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Creamos la Query
        const query = `
            UPDATE usuario
            SET nombre = $1,
                appaterno = $2,
                apmaterno = $3,
                fechanacimiento = $4,
                sexo = $5,
                telefono = $6
            WHERE notrabajador = $7
            RETURNING notrabajador;
        `;

        // Escribimos los datos de la petición
        const values = [
            nombre,
            apellidoPaterno,
            apellidoMaterno || null,
            fechaNacimiento,
            sexo,
            telefono,
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