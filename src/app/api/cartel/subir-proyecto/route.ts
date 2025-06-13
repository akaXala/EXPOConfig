import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Función para asegurar que el directorio de subida existe
const ensureUploadDirExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Para archivos privados, guárdalos fuera del directorio 'public'.
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads/carteles');

export async function POST(req: NextRequest) {
  try {
    ensureUploadDirExists(UPLOAD_DIR); // Asegura que el directorio existe

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const registro = formData.get('registro') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    // Sanitizar y generar un nombre de archivo único
    const originalFilename = file.name || 'file';
    const ext = path.extname(originalFilename) || '';
    // Usa el nombre de registro para el nombre del archivo
    const safeRegistro = (registro || 'sin_registro').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const uniqueFilename = `cartel_${safeRegistro}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // Subimos el archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.promises.writeFile(filePath, buffer);

    console.log(`Archivo subido: ${uniqueFilename}, Ruta: ${filePath}`);
    console.log(`Tamaño: ${file.size}, Tipo: ${file.type}`);

    // Validar tamaño máximo después de recibir el archivo (o antes si es posible con alguna config)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      await fs.promises.unlink(filePath); // Eliminar archivo si excede el tamaño
      return NextResponse.json({ error: `El archivo excede el límite de ${MAX_FILE_SIZE / (1024*1024)}MB.` }, { status: 413 });
    }

    // Validar tipo de archivo (opcional, pero recomendado)
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.type)) {
      await fs.promises.unlink(filePath); // Eliminar archivo si el tipo no es permitido
      return NextResponse.json({ error: 'Tipo de archivo no permitido.' }, { status: 415 });
    }


    return NextResponse.json({
      message: 'Archivo subido exitosamente.',
      fileName: uniqueFilename,
      filePath: `/uploads/carteles/${uniqueFilename}`, // Ruta accesible si está en public/uploads
      size: file.size,
      type: file.type,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error en el servidor al subir el archivo:', error);
    // Aquí podrías intentar eliminar un archivo parcialmente subido si filePath está definido
    return NextResponse.json({
      error: `Error interno del servidor al procesar el archivo. ${error.message || ''}`,
    }, { status: 500 });
  }
}

// (Opcional) Si quieres manejar otros métodos HTTP en la misma ruta:
// export async function GET(req: NextRequest) {
//   return NextResponse.json({ message: "Hola desde GET" });
// }