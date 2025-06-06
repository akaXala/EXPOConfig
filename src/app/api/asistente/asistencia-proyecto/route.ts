import { NextRequest, NextResponse } from 'next/server';
import pool from '@/config/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const camposObligatorios = [
      'idproyecto',
      'nombreCompleto',
      'correo',
      'edad',
      'procedencia',
      'satisfaccion',
      'observaciones',
    ];

    const faltantes = camposObligatorios.filter(
      (campo) => body[campo] === undefined || body[campo] === ''
    );

    if (faltantes.length > 0) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios', faltantes },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const {
        nombreCompleto,
        correo,
        edad,
        procedencia,
        satisfaccion,
        observaciones,
        idproyecto,
      } = body;

      // Verificar si ya existe el asistente por correo
      const resultAsistente = await client.query(
        `SELECT IdAsistente FROM Asistente WHERE Correo = $1`,
        [correo]
      );

      let idAsistente: number;

      if (resultAsistente.rowCount! > 0) {
        idAsistente = resultAsistente.rows[0].idasistente;
      } else {
        const insertAsistente = await client.query(
          `INSERT INTO Asistente (NombreCompleto, Correo, Edad, Procedencia)
           VALUES ($1, $2, $3, $4)
           RETURNING IdAsistente`,
          [nombreCompleto, correo, edad, procedencia]
        );
        idAsistente = insertAsistente.rows[0].idasistente;
      }

      // Verificar si ya registró una visita a ese proyecto
      const resultVisita = await client.query(
        `SELECT 1 FROM VisitaProyecto WHERE IdAsistente = $1 AND NoProyecto = $2`,
        [idAsistente, idproyecto]
      );

      if (resultVisita.rowCount === 0) {
        await client.query(
          `INSERT INTO VisitaProyecto (IdAsistente, NoProyecto, Observaciones, Satisfaccion)
           VALUES ($1, $2, $3, $4)`,
          [idAsistente, idproyecto, observaciones, satisfaccion]
        );
      }

      await client.query('COMMIT');
      return NextResponse.json({ message: 'Registro guardado con éxito' });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error durante la transacción:', error);
      return NextResponse.json(
        { message: 'Error al guardar datos' },
        { status: 500 }
      );
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error procesando la solicitud:', error);
    return NextResponse.json(
      { message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
