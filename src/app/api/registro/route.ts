import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/config/database";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();  // Obtén los datos del cuerpo de la solicitud

        // Creamos el cuerpo de la petición
        const {
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            fechaNacimiento,
            sexo,
            telefono,
            email,
            contrasena,
        } = body;

        // Validamos los campos más necesarios
        if (!nombre || !apellidoPaterno || !fechaNacimiento || !sexo || !telefono || !email || !contrasena) {
            return NextResponse.json(
                { success: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        // Hasheamos la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Insertamos los datos en la DB
        const query = `
            INSERT INTO usuario (
                nombre,
                appaterno,
                apmaterno,
                fechanacimiento,
                sexo,
                telefono,
                email,
                contrasena
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING notrabajador;
        `;

        // Escribimos los valores
        const values = [
            nombre,
            apellidoPaterno,
            apellidoMaterno || null,
            fechaNacimiento,
            sexo,
            telefono,
            email,
            hashedPassword,
        ];

        // Realizamos la query
        const result = await pool.query(query, values);

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