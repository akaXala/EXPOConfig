import { NextRequest, NextResponse } from 'next/server';
import pool from "@/config/database";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta el parámetro id' }, { status: 400 });
    }

    const values = [id];

    const queryProject = `SELECT * FROM proyecto WHERE noproyecto = $1`;
    const queryStudent = `
      SELECT e.noboleta, e.nombre, e.appaterno, e.apmaterno 
      FROM estudiante e 
      INNER JOIN participaestudiante pe ON e.noboleta = pe.noboleta 
      WHERE pe.noproyecto = $1
    `;
    const queryProfessor = `
      SELECT u.notrabajador, u.nombre, u.appaterno, u.apmaterno 
      FROM usuario u 
      INNER JOIN profesor p ON u.notrabajador = p.notrabajador 
      INNER JOIN estutor et ON p.notrabajador = et.notrabajador 
      WHERE et.noproyecto = $1
    `;
    const queryStand = `SELECT * FROM stand WHERE noproyecto = $1`;

    // Ejecutar todas las consultas en paralelo
    const [resultProject, resultStudent, resultProfessor, resultStand] = await Promise.all([
      pool.query(queryProject, values),
      pool.query(queryStudent, values),
      pool.query(queryProfessor, values),
      pool.query(queryStand, values),
    ]);

    if (resultProject.rows.length === 0) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    const data = {
      proyecto: resultProject.rows[0],
      estudiantes: resultStudent.rows,
      profesores: resultProfessor.rows,
      stand: resultStand.rows[0] || null,
    };

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    return NextResponse.json({ error: 'Error al obtener el proyecto' }, { status: 500 });
  }
}
