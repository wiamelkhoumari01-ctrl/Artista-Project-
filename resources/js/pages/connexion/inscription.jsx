import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../api';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import OnboardingModal from './OnboardingModal';

// Client ID Google — fixe pour éviter tout problème de variable d'env Vite
const GOOGLE_CLIENT_ID = '832417069767-tumkpqutir1v6juarh1ugv4h9fr9cvk8.apps.googleusercontent.com';

export default function Inscription() {
  const navigate = useNavigate();
  const { locale, t } = useLanguage();
  const { handleAuthSuccess } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '',
    password: '', password_confirmation: '', role: 'utilisateur'
  });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors]                           = useState({});
  const [generalError, setGeneralError]               = useState('');
  const [showOnboarding, setShowOnboarding]           = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    try {
      const response = await api.post('/api/inscription', { ...formData, locale });
      if (response.data.success) {
        handleAuthSuccess(response.data.access_token, response.data.user);
        if (response.data.user.role === 'artiste') {
          setShowOnboarding(true);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setGeneralError(t('auth.register_error'));
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGeneralError('');
    try {
      const response = await api.post('/api/google-auth', {
        token:  credentialResponse.credential,
        role:   formData.role,
        locale: locale,
      });
      if (response.data.success) {
        handleAuthSuccess(response.data.access_token, response.data.user);
        if (response.data.user.role === 'artiste') {
          setShowOnboarding(true);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      setGeneralError(t('auth.google_error'));
    }
  };

  const handleGoogleError = () => {
    setGeneralError(
      'La connexion Google a échoué. Assurez-vous que les origines autorisées sont bien configurées dans Google Cloud Console.'
    );
  };

  const ErrorMsg = ({ field }) => (
    errors[field]
      ? <div className="text-danger ps-3 mt-1" style={{ fontSize: '12px', fontWeight: '500' }}>{errors[field][0]}</div>
      : null
  );

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}

      <div className="login-container">
        <header className="header text-center mb-4">
          <h1 className="title">{t('auth.register_title')}</h1>
          <p className="subtitle">{t('auth.register_subtitle')}</p>
        </header>

        <main className="login-card">

          {/* Sélection du rôle */}
          <div className="role-selection mb-4 d-flex justify-content-center gap-2">
            <button
              type="button"
              className={`btn-role ${formData.role === 'utilisateur' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'utilisateur' })}
            >
              {t('auth.role_user')}
            </button>
            <button
              type="button"
              className={`btn-role ${formData.role === 'artiste' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'artiste' })}
            >
              {t('auth.role_artist')}
            </button>
          </div>

          {/* Erreur générale */}
          {generalError && (
            <div className="alert alert-danger text-center mb-3" style={{ borderRadius: '20px', fontSize: '14px' }}>
              {generalError}
            </div>
          )}

          {/* Formulaire */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label-custom">{t('auth.first_name')}</label>
                <input
                  type="text" name="first_name"
                  className={`form-control-pill ${errors.first_name ? 'is-invalid' : ''}`}
                  value={formData.first_name}
                  onChange={handleChange} required
                />
                <ErrorMsg field="first_name" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label-custom">{t('auth.last_name')}</label>
                <input
                  type="text" name="last_name"
                  className={`form-control-pill ${errors.last_name ? 'is-invalid' : ''}`}
                  value={formData.last_name}
                  onChange={handleChange} required
                />
                <ErrorMsg field="last_name" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label-custom">{t('auth.email')}</label>
              <input
                type="email" name="email"
                className={`form-control-pill ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange} required
              />
              <ErrorMsg field="email" />
            </div>

            <div className="mb-3">
              <label className="form-label-custom">{t('auth.password')}</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control-pill ${errors.password ? 'is-invalid' : ''}`}
                  onChange={handleChange} required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <ErrorMsg field="password" />
            </div>

            <div className="mb-4">
              <label className="form-label-custom">{t('auth.confirm_password')}</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  className="form-control-pill"
                  onChange={handleChange} required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary-pill">
              {t('auth.register_btn')}
            </button>
          </form>

          <div className="divider"><span>{t('auth.or')}</span></div>

          {/* Bouton Google */}
          <div className="google-button-wrapper d-flex justify-content-center mb-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="pill"
              theme="outline"
              locale={locale === 'ar' ? 'ar' : locale === 'en' ? 'en' : 'fr'}
            />
          </div>

          <div className="text-center mt-3">
            <Link to="/login" className="signup-link">
              {t('auth.already_registered')}
            </Link>
          </div>

        </main>

      </div>

    </GoogleOAuthProvider>
  );
}