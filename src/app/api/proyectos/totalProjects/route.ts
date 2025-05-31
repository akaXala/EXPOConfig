import { NextResponse } from "next/server";
import pool from "@/config/database"; // Conexión a PostgreSQL

export async function GET() {
  try {
    const query = `SELECT COUNT(*) AS total_proyectos FROM dashboardproyectoview`;
    const result = await pool.query(query);
    // result.rows es un array con un solo objeto: [{ total_proyectos: 'X' }]
    const total = result.rows[0]?.total_proyectos || 0;

    return NextResponse.json({ total_proyectos: Number(total) });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}
