import { NextResponse } from "next/server";
import pool from "@/config/database"; // Conexión a PostgreSQL

export async function GET() {
  try {
    const query = `SELECT * FROM dashboardproyectoview`;
    const result = await pool.query(query);
    console.log(result.rows);
    return NextResponse.json(result.rows);
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}