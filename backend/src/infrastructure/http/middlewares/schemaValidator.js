export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
  
    if (!result.success) {
      const errorsList = result.error.issues || result.error.errors || [];
      const formattedErrors = errorsList.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        error: 'Error de validación en los datos de entrada',
        details: formattedErrors,
      });
    }

    req.body = result.data;
    next();
  }
}