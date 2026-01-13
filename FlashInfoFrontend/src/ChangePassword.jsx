import React, { useState, useEffect } from "react";
import { updatePassword } from "./Api/FlashInfoApi";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Form, Input, Button, Alert, Progress } from 'antd';
import resetPasswordIcon from './assets/resetPasswordIcon.png';

const ChangePassword = ({ onBack, onPasswordChanged }) => {
  const [form] = Form.useForm();
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [username, setUsername] = useState(""); 
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: ""
  });

  // Récupérer le username depuis localStorage au chargement
  useEffect(() => {
    const storedUsername = localStorage.getItem('flashinfo_userLogin') 
                        || localStorage.getItem('flashinfo_username');

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setError("Utilisateur non identifié. Veuillez vous reconnecter.");
    }
  }, []);

  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 9) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    let label = "";
    let color = "";

    if (score <= 2) { label = "Faible"; color = "red"; }
    else if (score === 3) { label = "Moyen"; color = "orange"; }
    else if (score === 4) { label = "Fort"; color = "green"; }

    return { score: score * 25, label, color };
  };

  const onPasswordChange = (e) => {
    const value = e.target.value;
    setPasswordStrength(calculatePasswordStrength(value));
  };

  // Vérifier si le mot de passe a déjà été changé
  useEffect(() => {
    if (!username) return;

    fetch(`/api/users/checkPasswordChanged?username=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setPasswordChanged(data.passwordChanged);
      })
      .catch((err) => {
        console.error("Error checking password status", err);
      });
  }, [username]);

  const handleSubmit = async (values) => {
    if (!username) {
      setError("Utilisateur non identifié.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    if (values.newPassword !== values.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await updatePassword(username, values.newPassword); 

      setSuccess("Mot de passe modifié avec succès !");
      setPasswordChanged(true);
      if (onPasswordChanged) {
        onPasswordChanged();
      }

     
    } catch (err) {
      setError("Échec du changement de mot de passe. Veuillez réessayer.");
      console.error("Erreur update password:", err);
    } finally {
      setLoading(false);
    }
  };

  if (passwordChanged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Alert
          message="Votre mot de passe a déjà été modifié."
          description="Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
          type="success"
          showIcon
          className="max-w-md"
        />
      </div>
    );
  }

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Alert
          message="Session expirée"
          description="Veuillez vous reconnecter."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="change-password-container min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="change-password-card max-w-5xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Section gauche - Décorative */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-12">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full border-2 border-white/20 flex items-center justify-center relative z-10 bg-white/10 backdrop-blur-sm shadow-inner">
                <img 
                  src={resetPasswordIcon} 
                  alt="Réinitialisation du mot de passe" 
                  className="w-20 h-20 object-contain" 
                />
              </div>
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-purple-400 opacity-30 blur-2xl animate-pulse"></div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-center">Réinitialisation Sécurisée</h2>
            <p className="text-center text-purple-100 mb-10 max-w-sm">
              Choisissez un nouveau mot de passe fort pour protéger votre accès au tableau de bord FlashInfo.
            </p>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-green-300 text-xl">✓</span>
                <span>Minimum 9 caractères</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-300 text-xl">✓</span>
                <span>Caractères spéciaux requis</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-300 text-xl">✓</span>
                <span>Mélange de majuscules et minuscules</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 text-white/60 text-sm">
              MAMDA • MCMA
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
       

          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Veuillez définir votre nouveau mot de passe pour le compte associé à <strong>{username}</strong>
            </p>

            {error && (
              <Alert message={error} type="error" showIcon closable className="mb-6" />
            )}

            {success && (
              <Alert message={success} type="success" showIcon className="mb-6" />
            )}

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="space-y-6"
            >
              <Form.Item
                name="newPassword"
                label="Nouveau mot de passe"
                rules={[
                  { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
                  { min: 9, message: 'Minimum 9 caractères' },
                  { pattern: /[a-z]/, message: 'Doit contenir au moins une minuscule' },
                  { pattern: /[A-Z]/, message: 'Doit contenir au moins une majuscule' },
                  { pattern: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: 'Doit contenir au moins un caractère spécial (@, /, ?, !, etc.)' },
                ]}
                validateTrigger="onSubmit" 
              >
                <Input.Password
                  placeholder="•••••••••"
                  size="large"
                  className="rounded-lg"
                  onChange={onPasswordChange}
                />
              </Form.Item>

              {/* Barre de force du mot de passe */}
              {passwordStrength.label && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Force du mot de passe:</span>
                    <span style={{ color: passwordStrength.color, fontWeight: 'bold' }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <Progress
                    percent={passwordStrength.score}
                    showInfo={false}
                    strokeColor={passwordStrength.color}
                    trailColor="#e6e6e6"
                  />
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                label="Confirmer le mot de passe"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Veuillez confirmer votre mot de passe' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Les deux mots de passe ne correspondent pas'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="•••••••••"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 h-12 text-base font-medium"
                >
                  {loading ? 'Changement en cours...' : 'Changer le mot de passe'}
                </Button>
              </Form.Item>
            </Form>

            <p className="text-center text-xs text-gray-500 mt-8">
              Si vous n'avez pas demandé ce changement, contactez immédiatement le support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;