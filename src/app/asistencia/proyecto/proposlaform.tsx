import React, { useState } from "react";
import "./proposalform.css";

type ProposalFormData = {
  nombreProyecto: string;
  semestre: string;
  integrantes: string; // separados por coma
  profesor: string;
  tipo: string;
  fecha: string;
  carrera: string;
  descripcion: string;
  email: string;
};

const initialState: ProposalFormData = {
  nombreProyecto: "",
  semestre: "",
  integrantes: "",
  profesor: "",
  tipo: "",
  fecha: "",
  carrera: "",
  descripcion: "",
  email: "",
};

const tipos = ["Software", "Hardware", "Redes"];
const carreras = ["ISC", "II", "IM"];

export default function ProposalForm() {
  const [form, setForm] = useState<ProposalFormData>(initialState);
  const [errors, setErrors] = useState<{ [K in keyof ProposalFormData]?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.nombreProyecto) newErrors.nombreProyecto = "Campo obligatorio";
    if (!form.semestre) newErrors.semestre = "Campo obligatorio";
    if (!form.integrantes) newErrors.integrantes = "Campo obligatorio";
    if (!form.profesor) newErrors.profesor = "Campo obligatorio";
    if (!form.tipo) newErrors.tipo = "Campo obligatorio";
    if (!form.fecha) newErrors.fecha = "Campo obligatorio";
    if (!form.carrera) newErrors.carrera = "Campo obligatorio";
    if (!form.descripcion) newErrors.descripcion = "Campo obligatorio";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Correo válido requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Aquí puedes hacer la petición a tu backend o servicio de correo
    // Ejemplo: await fetch("/api/propuestas", { method: "POST", body: JSON.stringify(form) });

    setSubmitted(true);
    setForm(initialState);
  };

  if (submitted) {
    return (
      <div className="proposal-success">
        <h2>¡Propuesta enviada!</h2>
        <p>Recibirás un correo de confirmación en breve.</p>
      </div>
    );
  }

  return (
    <form className="proposal-form" onSubmit={handleSubmit} autoComplete="off">
      <h1>Enviar propuesta de evento</h1>
      <div className="proposal-row">
        <div className="proposal-col">
          <label>
            Nombre del proyecto *
            <input
              type="text"
              name="nombreProyecto"
              value={form.nombreProyecto}
              onChange={handleChange}
            />
            {errors.nombreProyecto && <span className="proposal-error">{errors.nombreProyecto}</span>}
          </label>
          <label>
            Semestre *
            <input
              type="text"
              name="semestre"
              value={form.semestre}
              onChange={handleChange}
              placeholder="Ej: 2025-2"
            />
            {errors.semestre && <span className="proposal-error">{errors.semestre}</span>}
          </label>
          <label>
            Integrantes (separados por coma) *
            <input
              type="text"
              name="integrantes"
              value={form.integrantes}
              onChange={handleChange}
              placeholder="Ej: Juan, Ana, Pedro"
            />
            {errors.integrantes && <span className="proposal-error">{errors.integrantes}</span>}
          </label>
          <label>
            Profesor encargado *
            <input
              type="text"
              name="profesor"
              value={form.profesor}
              onChange={handleChange}
            />
            {errors.profesor && <span className="proposal-error">{errors.profesor}</span>}
          </label>
          <label>
            Correo de contacto *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@dominio.com"
            />
            {errors.email && <span className="proposal-error">{errors.email}</span>}
          </label>
        </div>
        <div className="proposal-col">
          <label>
            Tipo de proyecto *
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="">Selecciona</option>
              {tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.tipo && <span className="proposal-error">{errors.tipo}</span>}
          </label>
          <label>
            Fecha *
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />
            {errors.fecha && <span className="proposal-error">{errors.fecha}</span>}
          </label>
          <label>
            Carrera *
            <select name="carrera" value={form.carrera} onChange={handleChange}>
              <option value="">Selecciona</option>
              {carreras.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.carrera && <span className="proposal-error">{errors.carrera}</span>}
          </label>
          <label>
            Descripción del proyecto *
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={6}
              placeholder="Describe brevemente el proyecto y sus objetivos"
            />
            {errors.descripcion && <span className="proposal-error">{errors.descripcion}</span>}
          </label>
        </div>
      </div>
      <div className="proposal-actions">
        <button type="submit">Enviar propuesta</button>
      </div>
    </form>
  );
}
