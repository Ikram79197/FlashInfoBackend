import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import React, { useState } from 'react';
import { authLogin } from './Api/FlashInfoApi';
import logoMamdaMcma from './assets/MamdaMcma_Logo instit.png';
import backgroundGraph from './assets/coin.png';
import './Login.css';

const Login = ({ onLogin, onOtpRequired }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      const { username, password } = values;
      if (!username || !password) {
        setError('Veuillez fournir le nom d\'utilisateur et le mot de passe.');
        setLoading(false);
        return;
      }

      const resp = await authLogin(username, password);
      // resp should contain token and expiresInMs
      if (resp && resp.token) {
        localStorage.setItem('flashinfo_token', resp.token);
        // Get user email and phone from response for OTP verification
        const userEmail = resp.email || '';
        const userPhone = resp.phone || '';
        
        // Show OTP verification page instead of logging in directly
        if (onOtpRequired) {
          onOtpRequired({
            token: resp.token,
            email: userEmail,
            phone: userPhone,
            username: username
          });
        } else if (onLogin) {
          onLogin(resp.token);
        }
      } else {
        setError('Réponse inattendue du serveur.');
      }
    } catch (err) {
      // If the request returned a 401, present a user-friendly message
      if (err && err.status === 401) {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
      } else {
        const msg = (err && err.message) ? err.message : 'Erreur de connexion. Veuillez réessayer.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinishFailed = () => {
    setError('Veuillez remplir tous les champs requis.');
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
                  label="Nom d'utilisateur"
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#951b81' }} />}
                    placeholder="votre_nom_utilisateur"
                    className="custom-input"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mot de passe"
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#951b81' }} />}
                    placeholder="••••••••"
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

