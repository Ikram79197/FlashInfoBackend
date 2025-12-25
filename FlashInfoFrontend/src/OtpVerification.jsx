// import { ArrowLeftOutlined } from '@ant-design/icons';
// import { Form, Input, Button, Alert, Space } from 'antd';
// import React, { useState, useRef, useEffect } from 'react';
// import './OtpVerification.css';

// const OtpVerification = ({ onVerify, onBack, email, phone }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [resendTimer, setResendTimer] = useState(0);
//   const inputRefs = useRef([]);

//   // Timer for resend button
//   useEffect(() => {
//     let interval;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [resendTimer]);

//   const handleOtpChange = (value, index) => {
//     // Only allow numbers
//     const numValue = value.replace(/[^0-9]/g, '');
    
//     if (numValue.length > 1) {
//       return;
//     }

//     // Set the value for current input
//     if (inputRefs.current[index]) {
//       inputRefs.current[index].value = numValue;
//     }

//     // Auto-focus next input when a number is entered
//     if (numValue && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === 'Backspace' && !e.target.value && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//     if (e.key === 'ArrowLeft' && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//     if (e.key === 'ArrowRight' && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Go directly to app without any verification
//       setSuccess('Accès autorisé! Redirection...');
//       setTimeout(() => {
//         if (onVerify) onVerify('verified');
//       }, 500);
//     } catch (err) {
//       setError(err?.message || 'Erreur lors de la vérification du code.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//   setError('');
//   setSuccess(''); // on nettoie juste les messages

//   try {
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     setResendTimer(60);

//     // Clear OTP inputs
//     inputRefs.current.forEach((ref) => {
//       if (ref) ref.value = '';
//     });
//     inputRefs.current[0]?.focus();
//   } catch (err) {
//     setError(err?.message || 'Erreur lors du renvoi du code.');
//   }
// };

//   return (
//     <div className="otp-verification-container">
//       <div className="otp-card">
//         {/* Left Section - Decorative */}
//         <div className="otp-left-section">
//           <div className="otp-gradient-background"></div>
//           <div className="otp-particles-effect"></div>
//           <div className="otp-left-content">
//             <div className="otp-left-inner">
//               <div className="otp-icon-container">
//                 <div className="otp-icon">
//                   <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
//                     <circle cx="60" cy="60" r="55" stroke="#951b81" strokeWidth="2" opacity="0.2"/>
//                     <path d="M50 60L55 65L70 50" stroke="#951b81" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </div>
//               </div>
//               <h2 className="otp-title">Sécurité en place</h2>
//               <p className="otp-description">
//                 Votre compte est protégé par une vérification en deux étapes. Veuillez entrer le code envoyé.
//               </p>
//               <div className="otp-features">
//                 <div className="otp-feature">
//                   <span className="feature-icon">✓</span>
//                   <span>Vérification SMS</span>
//                 </div>
//                 <div className="otp-feature">
//                   <span className="feature-icon">✓</span>
//                   <span>Vérification Email</span>
//                 </div>
//                 <div className="otp-feature">
//                   <span className="feature-icon">✓</span>
//                   <span>Code à usage unique</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Section - Form */}
//         <div className="otp-right-section">
//           <div className="otp-form-container">
//             <button className="otp-back-button" onClick={onBack} disabled={loading}>
//               <ArrowLeftOutlined />
//               <span>Retour</span>
//             </button>

//             <div className="otp-header-section">
//               <h2 className="otp-welcome-title">Vérification en deux étapes</h2>
//               <p className="otp-subtitle">
//                 Entrez le code à 6 chiffres envoyé à:
//               </p>
             
//             </div>

//             {error && (
//               <Alert
//                 message={error}
//                 type="error"
//                 showIcon
//                 style={{ marginBottom: '24px' }}
//                 closable
//                 onClose={() => setError('')}
//               />
//             )}

//             {success && (
//               <Alert
//                 message={success}
//                 type="success"
//                 showIcon
//                 style={{ marginBottom: '24px' }}
//                 closable
//                 onClose={() => setSuccess('')}
//               />
//             )}

//             <div className="otp-form-section">
//               <label className="otp-label">Code de vérification</label>
//               <div className="otp-input-group">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <input
//                     key={index}
//                     ref={(el) => (inputRefs.current[index] = el)}
//                     type="text"
//                     maxLength="1"
//                     className="otp-input"
//                     placeholder="0"
//                     onChange={(e) => handleOtpChange(e.target.value, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     disabled={loading}
//                     autoFocus={index === 0}
//                   />
//                 ))}
//               </div>
//               <p className="otp-hint">
//                 Entrez les 6 chiffres du code reçu
//               </p>
//             </div>

//             <Button
//               type="primary"
//               block
//               size="large"
//               onClick={handleSubmit}
//               loading={loading}
//               className="otp-submit-button"
//               disabled={loading}
//               style={{ marginTop: '32px' }}
//             >
//               {loading ? 'Vérification...' : 'Vérifier le code'}
//             </Button>

//             <div className="otp-resend-section">
//               <p className="otp-resend-text">Vous n'avez pas reçu le code ?</p>
//               <Space direction="vertical" style={{ width: '100%' }}>
//                 <Button
//                   type="link"
//                   onClick={handleResend}
//                   disabled={resendTimer > 0 || loading}
//                   className="otp-resend-button"
//                 >
//                   {resendTimer > 0
//                     ? `Renvoyer le code (${resendTimer}s)`
//                     : 'Renvoyer le code'}
//                 </Button>
//               </Space>
//             </div>

//             <div className="otp-timer-info">
//               <p className="otp-timer-text">
//                 <span className="timer-icon">⏱</span>
//                 Code valide pendant 3 minutes
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtpVerification;
