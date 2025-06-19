import { BrowserRouter, Routes, Route } from "react-router-dom";
import QRGenerator from "../admin/QRGenerator";
import AttendanceConfirmation from "../admin/AttendanceConfirmation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/generar-qr" element={<QRGenerator />} />
        <Route path="/admin/confirmacion-asistencia" element={<AttendanceConfirmation />} />
        {/* Otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
