import {
  normalizeEmail,
  validatePhoneNumber,
  normalizeEcuadorianPhone,
  validateClientDocument,
} from '../utils/contactValidation.js';

export function validateClientPayload(req, res, next) {
  const { nombres, apellidos, telefono, email, identificacion } = req.body;

  if (!nombres || !nombres.trim()) {
    return res.status(400).json({
      error: 'El campo nombres es obligatorio.',
      field: 'nombres',
    });
  }

  if (!apellidos || !apellidos.trim()) {
    return res.status(400).json({
      error: 'El campo apellidos es obligatorio.',
      field: 'apellidos',
    });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({
      error: 'El campo email es obligatorio.',
      field: 'email',
    });
  }

  const sanitizedEmail = normalizeEmail(email);
  if (!sanitizedEmail) {
    return res.status(400).json({
      error: 'La dirección de correo no cumple con el estándar RFC 5322.',
      field: 'email',
    });
  }

  if (!telefono || !telefono.trim()) {
    return res.status(400).json({
      error: 'El campo teléfono es obligatorio.',
      field: 'telefono',
    });
  }

  if (!validatePhoneNumber(telefono)) {
    return res.status(400).json({
      error: 'El número de teléfono es inválido o no cumple con el formato (+593 para Ecuador).',
      field: 'telefono',
    });
  }

  if (identificacion && identificacion.trim()) {
    if (!validateClientDocument(identificacion)) {
      return res.status(400).json({
        error: 'El documento de identificación (cédula ecuatoriana o pasaporte) es inválido.',
        field: 'identificacion',
      });
    }
    req.body.identificacion = identificacion.trim().toUpperCase();
  }

  req.body.nombres = nombres.trim();
  req.body.apellidos = apellidos.trim();
  req.body.email = sanitizedEmail;
  req.body.telefono = normalizeEcuadorianPhone(telefono);

  next();
}

export function validateClientId(req, res, next) {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    return res.status(400).json({
      error: 'El identificador del cliente debe ser un entero positivo válido.',
      field: 'id',
    });
  }

  req.params.id = numericId;
  next();
}