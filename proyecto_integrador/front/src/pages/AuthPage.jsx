import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  passwordStrengthLabel,
  validateSecurePassword,
} from '../utils/passwordValidator';
import '../components/Auth.css';

function buildRedirectPath(returnTo, fromChat) {
  const safePath = returnTo && returnTo.startsWith('/') ? returnTo : '/';
  if (!fromChat) return safePath;

  const [pathname, search = ''] = safePath.split('?');
  const params = new URLSearchParams(search);
  params.set('chat', 'open');
  const query = params.toString();
  return query ? `${pathname}?${query}` : `${pathname}?chat=open`;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromChat = searchParams.get('from') === 'chat';
  const returnTo = searchParams.get('returnTo') || '/';
  const { login, register, isAuthenticated } = useAuth();

  const [mode, setMode] = useState(
    () => (searchParams.get('mode') === 'register' ? 'register' : 'login')
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordCheck = useMemo(
    () => (mode === 'register' ? validateSecurePassword(password) : null),
    [mode, password]
  );

  const strength = passwordCheck
    ? passwordStrengthLabel(passwordCheck.score, passwordCheck.maxScore)
    : null;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(buildRedirectPath(returnTo, fromChat), { replace: true });
    }
  }, [isAuthenticated, navigate, fromChat, returnTo]);

  if (isAuthenticated) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!passwordCheck?.valid) {
        setError('La contraseña no cumple todos los requisitos de seguridad.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(fullName, email, password);
      }
      navigate(buildRedirectPath(returnTo, fromChat));
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-badge">V-HEALT</div>
        <h1 className="auth-title">
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h1>
        <p className="auth-subtitle">
          {fromChat
            ? 'Regístrate o inicia sesión para usar el asistente de plantas medicinales con IA.'
            : mode === 'login'
              ? 'Accede a tu cuenta para usar el asistente y guardar tu progreso.'
              : 'Crea tu cuenta con una contraseña segura. Tus datos se almacenan cifrados.'}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => {
              setMode('login');
              setError('');
            }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => {
              setMode('register');
              setError('');
            }}
          >
            Registrarme
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div>
              <label className="auth-label" htmlFor="fullName">
                Nombre completo
              </label>
              <input
                id="fullName"
                className="auth-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Ej. María González"
              />
            </div>
          )}

          <div>
            <label className="auth-label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="auth-label" htmlFor="password">
              Contraseña
            </label>
            <div className="auth-input-wrap">
              <input
                id="password"
                className="auth-input auth-input--with-btn"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'register' ? 'Mín. 8 caracteres, mayúscula, número...' : '••••••••'}
              />
              <button
                type="button"
                className="auth-toggle-pwd"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>

            {mode === 'register' && password.length > 0 && (
              <div className="auth-pwd-strength">
                <div className="auth-pwd-bar-track">
                  <div
                    className={`auth-pwd-bar-fill ${strength?.color || ''}`}
                    style={{ width: `${(passwordCheck.score / passwordCheck.maxScore) * 100}%` }}
                  />
                </div>
                <p className="auth-pwd-label">Fortaleza: {strength?.label}</p>
                <ul className="auth-pwd-rules">
                  {passwordCheck.rules.map((rule) => (
                    <li
                      key={rule.id}
                      className={rule.passed ? 'auth-pwd-rule--ok' : 'auth-pwd-rule--fail'}
                    >
                      {rule.passed ? '✓' : '○'} {rule.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label className="auth-label" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="auth-field-error">Las contraseñas no coinciden</p>
              )}
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting
              ? 'Procesando…'
              : mode === 'login'
                ? 'Entrar'
                : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to={returnTo} className="auth-link">
            ← Volver
          </Link>
        </p>
      </div>
    </div>
  );
}
