import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import "./QRGenerator.css";

// Simulación de eventos; reemplaza por tus datos reales
const events = [
  { id: "1", name: "Proyecto 1" },
  { id: "2", name: "Proyecto 2" },
  { id: "3", name: "Proyecto 3" },
  { id: "4", name: "Proyecto 4" },
];

export default function QRGenerator() {
  const [selectedEvent, setSelectedEvent] = useState(events[0].id);
  const qrRef = useRef<HTMLDivElement>(null);

  // URL de la encuesta de asistencia (ajusta según tu backend)
  const getSurveyUrl = (eventId: string) =>
    `https://tuservidor.com/encuesta-asistencia?evento=${eventId}`;

  const handleDownload = async () => {
    if (!qrRef.current) return;
    const dataUrl = await toPng(qrRef.current);
    const link = document.createElement("a");
    link.download = `QR_${selectedEvent}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="qr-generator-bg">
      <div className="qr-generator-panel">
        <h1>Generar QR de asistencia</h1>
        <label>
          Selecciona el evento:
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        </label>
        <div ref={qrRef} className="qr-generator-qrbox">
          <h2>{events.find((ev) => ev.id === selectedEvent)?.name}</h2>
          <QRCode
            value={getSurveyUrl(selectedEvent)}
            size={220}
            bgColor="#fff"
            fgColor="#000"
            level="H"
          />
          <div className="qr-generator-caption">
            Escanea para confirmar asistencia
          </div>
        </div>
        <button onClick={handleDownload} className="qr-generator-download">
          Descargar QR
        </button>
      </div>
    </div>
  );
}
