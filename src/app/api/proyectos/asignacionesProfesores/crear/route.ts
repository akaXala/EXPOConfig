import { NextRequest, NextResponse } from 'next/server';
import pool from '@/config/database';

type Asignacion = {
  NoTrabajador: number;
  NoProyecto: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const asignaciones: Asignacion[] = body.asignaciones;

    if (!asignaciones || !Array.isArray(asignaciones)) {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Vaciar la tabla Evalua
      await client.query('DELETE FROM Evalua');

      // Insertar nuevas asignaciones
      for (const { NoTrabajador, NoProyecto } of asignaciones) {
        await client.query(
          'INSERT INTO Evalua (NoTrabajador, NoProyecto) VALUES ($1, $2)',
          [NoTrabajador, NoProyecto]
        );
      }

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Asignaciones guardadas con éxito' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en la asignación:', error);
      return NextResponse.json({ message: 'Error al guardar asignaciones' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al procesar el request:', error);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
