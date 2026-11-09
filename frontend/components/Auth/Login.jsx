import { use, useState } from "react";
import "./Login.css";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [alert, setAlert] = useState(null); // { type: 'error' | 'success', text: '' }

  const { login } = useAuth();
  const navigate = useNavigate();

  const loginRequest = async (credentials) => {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Credenciales inválidas');
    }
    return data;
  };

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.token, data.usuario);
      setAlert({
        type: 'success',
        text: '¡Bienvenido! Redirigiendo...'
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    },
    onError: (error) => {
      setAlert({
        type: 'error',
        text: error.message
      });
    }
  });

  const isLoading = loginMutation.isPending;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un formato de correo válido.";
    }

    if (!isForgotPassword) {
      if (!formData.password) {
        newErrors.password = "La contraseña es obligatoria.";
      } else if (formData.password.length < 8) {
        newErrors.password = "Debe tener al menos 8 caracteres.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validate()) return;

    if (isForgotPassword) {
      setAlert({
        type: 'success',
        text: `Se ha enviado un enlace de recuperación a ${formData.email}`,
      });
      return;
    }

    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const toggleView = () => {
    setIsForgotPassword(!isForgotPassword);
    setErrors({});
    setAlert(null);
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/*Cabecera / Marca */}
        <div className="auth-header">
          <div className="auth-logo">✈️</div>
          <h2>
            {isForgotPassword ? "Recuperar contraseña:" : "Iniciar sesión"}
          </h2>
          <p>
            {isForgotPassword
              ? "Ingresa tu correo y te enviaremos instrucciones."
              : "Bienvenido de nuevo a Viva Viajes"}
          </p>
        </div>
        {/* Alerta de Error / Éxito */}
        {alert && (
          <div className={`auth-alert alert-${alert.type}`} role="alert">
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
              className={errors.email ? "input-error" : ""}
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
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>
          )}

          {/* Botón con Spinner */}
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {loginMutation.isPending ? (
              <span className="spinner" aria-label="Cargando..."></span>
            ) : isForgotPassword ? (
              "Enviar instrucciones"
            ) : (
              "Entrar al sistema"
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
