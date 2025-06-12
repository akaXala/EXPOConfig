import { NextResponse } from 'next/server';
import pool from '@/config/database'; // ajusta esta ruta si es diferente

export async function DELETE() {
  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM "evalua"');
      await client.query('COMMIT');

      return NextResponse.json({ message: 'Asignaciones eliminadas correctamente' }, { status: 200 });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar asignaciones:', error);
      return NextResponse.json({ message: 'Error al eliminar asignaciones' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error de conexión con la base de datos:', error);
    return NextResponse.json({ message: 'Error de conexión con la base de datos' }, { status: 500 });
  }
}
