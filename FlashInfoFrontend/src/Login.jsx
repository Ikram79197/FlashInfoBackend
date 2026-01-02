import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import React, { useState } from 'react';
import { authLogin } from './Api/FlashInfoApi';
import { verifyOtp } from './Api/FlashInfoApi';
import OtpVerification from './OtpVerification';
import logoMamdaMcma from './assets/MamdaMcma_Logo instit.png';
import backgroundGraph from './assets/coin.png';
import './Login.css';

const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpInfo, setOtpInfo] = useState({ username: '', email: '', phone: '' });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      const username = (values && values.username) || '';
      const password = (values && values.password) || '';
      const resp = await authLogin(username, password);
      const data = resp && resp.data ? resp.data : resp;
      // Si pas de token dans la réponse, afficher OTP
      const token = data?.token || data?.accessToken || data?.jwt;
      if (!token) {
        setOtpStep(true);
        // Si username ressemble à un email, extraire le login (avant le @)
        let login = username;
        if (username && username.includes('@')) {
          login = username.split('@')[0];
        }
        setOtpInfo({ username: login, email: data.email, phone: data.phone });
        return;
      }
      // Sinon, login classique avec token
      const tokenStr = String(token);
      const rawToken = tokenStr.startsWith('Bearer ') ? tokenStr.substring(7) : tokenStr;
      if (!rawToken || !rawToken.includes('.')) {
        throw new Error('Token invalide reçu du serveur');
      }
      localStorage.setItem('flashinfo_token', rawToken);
      onLogin(rawToken);
    } catch (err) {
      let msg;
      if (err && (err.status === 401 || err.status === 403)) {
        msg = 'Mail ou mot de passe incorrect';
      } else {
        msg = err?.body || err?.message || 'Erreur lors de la connexion';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la vérification OTP
  const handleOtpVerify = async (otpCode) => {
    setLoading(true);
    setError('');
    try {
      let resp;
      try {
        resp = await verifyOtp(otpInfo.username, otpCode);
      } catch (e) {
        // Si le backend retourne du texte et pas du JSON, on ignore l'erreur de parsing
        if (e && e.status === 200 && e.response) {
          resp = e.response;
        } else {
          throw e;
        }
      }
      // Chercher le token dans le body ou dans le header Authorization
      let token = resp?.token || resp?.accessToken || resp?.jwt;
      let username = null;
      // Si pas de token dans le body, essayer de le lire dans le header (fetch natif)
      if (resp && resp.headers && typeof resp.headers.get === 'function') {
        const authHeader = resp.headers.get('Authorization') || resp.headers.get('authorization');
        if (!token && authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
        // Récupérer le nom d'utilisateur dans le header si présent
        username = resp.headers.get('userEmail') || resp.headers.get('username') || null;
      }
      // Si pas de token, essayer de le lire dans l'objet brut (cas custom fetch)
      if (!token && resp && (resp.Authorization || resp.authorization)) {
        const authHeader = resp.Authorization || resp.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
      // Si toujours pas de token, essayer de le lire dans la dernière réponse fetch (cas edge)
      if (!token && window && window.fetch) {
        try {
          const lastResponse = window.__lastOtpResponse;
          if (lastResponse && lastResponse.headers) {
            const authHeader = lastResponse.headers.get('Authorization') || lastResponse.headers.get('authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
              token = authHeader.substring(7);
            }
            if (!username) {
              username = lastResponse.headers.get('userEmail') || lastResponse.headers.get('username') || null;
            }
          }
        } catch (e) {}
      }
      if (!token) {
        throw new Error('Token JWT non reçu après OTP');
      }
      localStorage.setItem('flashinfo_token', token);
      if (username) {
        localStorage.setItem('flashinfo_username', username);
      }
      setOtpStep(false);
      onLogin(token);
    } catch (err) {
      let msg = err?.body || err?.message || 'Erreur lors de la vérification OTP';
      // Si le message est un JSON (ex: {"error":...}), on extrait le message
      try {
        if (typeof msg === 'string' && msg.trim().startsWith('{')) {
          const parsed = JSON.parse(msg);
          if (parsed && parsed.error) msg = parsed.error;
        }
      } catch (e) {}
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishFailed = () => {
    // Keep silent — validation is optional; handled on submit
  };

  if (otpStep) {
    return (
      <OtpVerification
        onVerify={handleOtpVerify}
        onBack={() => setOtpStep(false)}
        email={otpInfo.email}
        phone={otpInfo.phone}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Section gauche avec design diagonal */}
        <div className="left-section">
          <div className="gradient-background"></div>
          <div className="particles-effect"></div>
          <div className="left-content">
            <div className="left-inner">
              <div className="graph-container">
                <img 
                  src={backgroundGraph} 
                  alt="Illustration financière avec graphiques et visualisations de données"
                  className="graph-image"
                />
                <div className="graph-overlay"></div>
              </div>
              <h1 className="main-title">
                <span className="title-gradient">FlashInfo</span>
                <br />
                <span className="title-subtitle">Dashboard</span>
              </h1>
              <p className="description">
                Accédez instantanément à vos informations critiques et pilotez 
                vos données en temps réel avec FlashInfo.
              </p>
              <div className="decorative-bars">
                <div className="bar-1"></div>
                <div className="bar-2"></div>
                <div className="bar-3"></div>
              </div>
              <div className="info-card">
                <div className="info-row">
                  <span className="info-value">MAMDA • MCMA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite avec formulaire */}
        <div className="right-section">
          <div className="form-container">
            <div className="header-section">
              <img 
                src={logoMamdaMcma} 
                alt="Logo MamdaMcma" 
                className="logo"
              />
              <h2 className="welcome-title">
                <span className="welcome-gradient">Bienvenue</span>
              </h2>
              <p className="subtitle">
                Connectez-vous à votre tableau de bord FlashInfo.
              </p>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: '24px' }}
                closable
                onClose={() => setError('')}
              />
            )}

            <div className="form-section">
              <Form
                form={form}
                name="login"
                onFinish={handleSubmit}
                onFinishFailed={handleFinishFailed}
                layout="vertical"
                size="large"
                className="custom-form"
              >
                <Form.Item
                  name="username"
                  label="Email"
                  rules={[]} // Explicitly no validation rules
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#951b81' }} />}
                    placeholder="votre_nom_utilisateur (optionnel)"
                    className="custom-input"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mot de passe"
                  rules={[]} // Explicitly no validation rules
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#951b81' }} />}
                    placeholder="•••••••• (optionnel)"
                    iconRender={(visible) => (visible ? <EyeOutlined style={{ color: '#951b81' }} /> : <EyeInvisibleOutlined style={{ color: '#951b81' }} />)}
                    className="custom-input"
                  />
                </Form.Item>

                <div className="checkbox-section">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="custom-checkbox">
                      Se souvenir de moi
                    </Checkbox>
                  </Form.Item>
                  <a href="#" className="forgot-link">
                    Mot de passe oublié ?
                  </a>
                </div>

                <Form.Item style={{ marginTop: '24px' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="custom-button"
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;