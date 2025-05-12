export const expresiones: Record<string, RegExp> = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    apellidoPaterno: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    apellidoMaterno: /^([a-zA-ZÀ-ÿ\s]{1,40})?$/,
    telefono: /^\d{10}$/,
};
  
export const mensajesError: Record<string, string> = {
    nombre: "El nombre solo puede contener letras y espacios.",
    apellidoPaterno: "El apellido paterno solo puede contener letras y espacios.",
    apellidoMaterno: "El apellido materno solo puede contener letras y espacios.",
    telefono: "El teléfono debe contener 10 dígitos.",
};
  