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
      const data = resp ;
      const token = data?.token || data?.accessToken || data?.jwt;
      const userLogin = data?.username 
      console.log("response login ", resp);
      console.log('Login successful for user:', userLogin);
      localStorage.setItem('flashinfo_userLogin', userLogin);
      localStorage.setItem('flashinfo_username', username);
      // Si pas de token dans la réponse, afficher OTP
      if (!token) {
        setOtpStep(true);
        setOtpInfo({ username : userLogin, phone: data.phone });
        return;
      }
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
const handleOtpVerify = async (otpCode) => {
  // ... ton code existant

  try {
    const resp = await verifyOtp(otpInfo.username, otpCode);

    // Récupère le token et password_changed depuis la réponse
    let token = resp?.token || resp?.accessToken || resp?.jwt;
    const passwordChanged = resp?.password_changed || resp?.passwordChanged;

    if (!token) {
      throw new Error('Token JWT non reçu après OTP');
    }

    localStorage.setItem('flashinfo_token', token);

    // Stocke aussi le username si tu veux
    if (otpInfo.username) {
      localStorage.setItem('flashinfo_userLogin', otpInfo.username);
      localStorage.setItem('flashinfo_username', otpInfo.username);
    }

    setOtpStep(false);

    // → Passe DEUX paramètres à onLogin : token + password_changed
    onLogin(token, passwordChanged);

  } catch (err) {
    // ... gestion erreur
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