import { NextRequest, NextResponse } from 'next/server';
import pool from '@/config/database'; // Asegúrate de tener bien configurada la conexión

export async function POST(req: NextRequest) {
  try {
    const profesores = await req.json();
    
    if (!Array.isArray(profesores)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const prof of profesores) {
        const { notrabajador, evaluador } = prof;

        if (typeof notrabajador !== 'number' || typeof evaluador !== 'boolean') {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Datos inválidos en el arreglo' }, { status: 400 });
        }

        await client.query(
          'UPDATE Profesor SET evaluador = $1 WHERE NoTrabajador = $2',
          [evaluador, notrabajador]
        );
      }
      await client.query('COMMIT');
      return NextResponse.json({ message: 'Evaluadores actualizados correctamente' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error durante la transacción:', err);
      return NextResponse.json({ error: 'Error al actualizar evaluadores' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error general en el endpoint:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
