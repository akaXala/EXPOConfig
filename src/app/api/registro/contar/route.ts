import { NextResponse } from "next/server";
import pool from "@/config/database"; // Conexión a PostgreSQL

export const GET = async () => {
  try {
    const query = `SELECT COUNT(*) FROM usuario`;
    const result = await pool.query(query);

    const count = parseInt(result.rows[0].count, 10);

    return NextResponse.json(
      { success: true, count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en obtener usuarios:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
};