import { use, useState } from "react";
import './Login.css';

export default function Login() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const[isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'error' | 'success', text: '' }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value}));
  

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: ''}));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un formato de correo válido.';
    }

    if (!isForgotPassword) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria.';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Debe tener al menos 8 caracteres.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    if(!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if(isForgotPassword) {
        setAlert({
          type: 'success',
          text: `Se ha enviado un enlace de recuperación a ${formData.email}`,
        });
      } else {
        if (formData.password === '123456') {
          setAlert({
            type: 'error',
            text: 'Credenciales inválidas. Por favor intenta nuevamente.',
          });
        } else {
          setAlert({
            type: 'success',
            text: '¡Inicio de sesión exitoso! (Modo presentación)'
          });
        }
      }
    }, 1500);
  };

  const toggleView = () => {
    setIsForgotPassword(!isForgotPassword);
    setErrors({});
    setAlert(null);
    setFormData((prev) => ({ ...prev, password: ''}));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/*Cabecera / Marca */}
        <div className="auth-header">
          <div className="auth-logo">✈️</div>
          <h2>{isForgotPassword ? 'Recuperar contraseña:' : 'Iniciar sesión'}</h2>
          <p>
            {isForgotPassword
              ? 'Ingresa tu correo y te enviaremos instrucciones.'
              : 'Bienvenido de nuevo a Viva Viajes'}
          </p>
        </div>
        {/* Alerta de Error / Éxito */}
        {alert && (
          <div className={`auth-alert alert-${alert.type}`} role ="alert">
            <span>{alert.text}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Campo Correo */}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          {/* Campo Contraseña (solo visible si no es recuperación) */}
          {!isForgotPassword && (
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Contraseña</label>
                <button
                  type="button"
                  className="link-btn"
                  onClick={toggleView}
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
          )}

          {/* Botón con Spinner */}
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner" aria-label="Cargando..."></span>
            ) : isForgotPassword ? (
              'Enviar instrucciones'
            ) : (
              'Entrar al sistema'
            )}
          </button>
        </form>
        {/* Toggle para volver al login */}
        {isForgotPassword && (
          <div className="auth-footer">
            <button
              type="button"
              className="link-btn back-btn"
              onClick={toggleView}
              disabled={isLoading}
            >
              ← Volver al inicio de sesión
            </button>
        </div>
      )}
    </div>
    </div>
  );
}
