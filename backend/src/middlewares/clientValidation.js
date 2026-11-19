export function validateClientPayload(req, res, next) {
  const { nombres, apellidos, telefono, email } = req.body;

  if (
    !nombres || !nombres.trim() ||
    !apellidos || !apellidos.trim() ||
    !telefono || !telefono.trim() ||
    !email || !email.trim()
  ) {
    return res.status(400).json({
      error: 'Los campos nombres, apellidos, telefono y email son obligatorios y no pueden estar vacios.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: 'El formato de correo electronico es invalido.',
    });
  }

  const ecuadorPhoneRegex = /^(\+593|0)9[0-9]{8}$/;
  const cleanPhone = telefono.trim().replace(/\s+/g, '');
  if (!ecuadorPhoneRegex.test(cleanPhone)) {
    return res.status(400).json({
      error: 'El formato del telefono debe ser de Ecuador (+5939XXXXXXXX o 09XXXXXXXX).',
    });
  }

  req.body.nombres = nombres.trim();
  req.body.apellidos = apellidos.trim();
  req.body.telefono = cleanPhone;
  req.body.email = email.trim().toLowerCase();

  next();
}

export function validateClientId(req, res, next) {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    return res.status(400).json({
      error: 'El identificador del cliente debe ser un numero entero positivo valido.',
    });
  }

  req.params.id = numericId;
  next();
}