import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import React, { useState } from 'react';
import { authLogin } from './Api/FlashInfoApi';
import logoMamdaMcma from './assets/MamdaMcma_Logo instit.png';
import backgroundGraph from './assets/coin.png';
import './Login.css';

const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      const username = (values && values.username) || '';
      const password = (values && values.password) || '';
      const resp = await authLogin(username, password);
      // resp may be axios response or data directly
      const data = resp && resp.data ? resp.data : resp;
      const token = data?.token || data?.accessToken || data?.jwt || data;
      if (!token) {
        throw new Error(data?.message || 'Authentication failed');
      }
      // Ensure we store the raw JWT (without the 'Bearer ' prefix)
      const tokenStr = String(token);
      const rawToken = tokenStr.startsWith('Bearer ') ? tokenStr.substring(7) : tokenStr;
      if (!rawToken || !rawToken.includes('.')) {
        throw new Error('Token invalide reçu du serveur');
      }
      localStorage.setItem('flashinfo_token', rawToken);
      onLogin(rawToken);
    } catch (err) {
      let msg;
      // fetch-based REQUEST_UC attaches numeric status and body on error
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

  const handleFinishFailed = () => {
    // Keep silent — validation is optional; handled on submit
  };

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