import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import React, { useState } from 'react';
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
      // Simuler un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onLogin) onLogin();
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
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
                  rules={[
                    { required: true, message: 'Veuillez saisir votre nom d\'utilisateur!' }
                  ]}
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
                  rules={[
                    { required: true, message: 'Veuillez saisir votre mot de passe!' }
                  ]}
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

            <div className="divider-section">
              <div className="divider-line">
                <div className="divider-border"></div>
              </div>
              <div className="divider-content">
                <span className="divider-text">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="signup-section">
              <p className="signup-text">
                Vous n'avez pas de compte ?{' '}
                <a href="#" className="signup-link">
                  S'inscrire
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
