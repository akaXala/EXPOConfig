import { NextResponse } from "next/server";
import pool from "@/config/database"; // Conexión a PostgreSQL

export async function GET() {
  try {
    const query = `
      SELECT 
        e.notrabajador, 
        e.noproyecto AS idproyecto, 
        CONCAT(u.nombre, ' ', u.appaterno, ' ', u.apmaterno) AS nombreProfesor, 
        p.nombre AS nombreProyecto
      FROM Evalua e
      INNER JOIN Profesor pr ON pr.notrabajador = e.notrabajador
      INNER JOIN Proyecto p ON p.noproyecto = e.noproyecto
      INNER JOIN Usuario u ON u.notrabajador = pr.notrabajador
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Error fetching assignments' }, { status: 500 });
  }
}
