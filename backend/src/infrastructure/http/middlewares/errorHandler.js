export function errorHandler(err, req, res, next) {
  console.error('Unhandled application error:', err);

  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Violacion de unicidad: ya existe un registro con esos datos.',
    });
  }

  return res.status(500).json({
    error: 'Error interno del servidor. La operacion no pudo ser completada.',
  });
}