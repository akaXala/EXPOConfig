// Componente para descargar un PDF usando MUI, React y Next.js
'use client';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import React from 'react';

interface DownloadPosterProjectProps {
  url: string;
  disabled?: boolean;
}

const DownloadPosterProject: React.FC<DownloadPosterProjectProps> = ({ url, disabled }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudo descargar el archivo');
      const blob = await response.blob();
      const link = document.createElement('a');
      // Obtener el nombre original del archivo de la URL
      let downloadName = 'archivo.pdf';
      try {
        const urlParts = url.split('?')[0].split('/');
        downloadName = urlParts[urlParts.length - 1] || 'archivo.pdf';
      } catch {}
      link.href = window.URL.createObjectURL(blob);
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Error al descargar el archivo: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      disabled={disabled || !url}
    >
      Descargar Cartel
    </Button>
  );
};

export default DownloadPosterProject;
