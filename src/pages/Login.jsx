import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/ui/footer';
import LoginForm from '../components/LoginForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import MessageNotification from '../components/MessageNotification';
import FormContainer from '../components/FormContainer';

const baseUrl = 'http://localhost:8000/api/users/';

const Login = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [step, setStep] = useState(1);
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch(`${baseUrl}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        showMessage('Login successful!', 'success');
      } else {
        showMessage(data.detail || 'Login failed', 'error');
      }
    } catch (error) {
      showMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotMode(true);
  };

  const handleSendCode = async (username) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch(`${baseUrl}forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      
      if (res.ok) {
        setStep(2);
        showMessage('Verification code sent to your email.', 'success');
      } else {
        showMessage('Failed to send verification code', 'error');
      }
    } catch (error) {
      showMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch(`${baseUrl}verify-reset-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_code: code }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setResetToken(data.reset_token || 'dummy-token');
        setStep(3);
        showMessage('Code verified successfully!', 'success');
      } else {
        showMessage(data.detail || 'Code verification failed', 'error');
      }
    } catch (error) {
      showMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch(`${baseUrl}reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reset_token: resetToken,
          password1: newPassword,
          password2: confirmPassword,
        }),
      });
      
      if (res.ok) {
        showMessage('Password reset successful!', 'success');
        setTimeout(() => {
          setForgotMode(false);
          setStep(1);
        }, 2000);
      } else {
        const data = await res.json();
        showMessage(data.detail || 'Reset failed', 'error');
      }
    } catch (error) {
      showMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (username) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const res = await fetch(`${baseUrl}resend-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      
      if (res.ok) {
        showMessage('Verification code resent!', 'success');
      } else {
        showMessage('Failed to resend code', 'error');
      }
    } catch (error) {
      showMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setForgotMode(false);
    setStep(1);
    clearMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Header />
      
      <FormContainer isVisible={isVisible}>
        {!forgotMode ? (
          <LoginForm
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            isLoading={isLoading}
          />
        ) : (
          <ForgotPasswordForm
            step={step}
            onSendCode={handleSendCode}
            onVerifyCode={handleVerifyCode}
            onResetPassword={handleResetPassword}
            onResendCode={handleResendCode}
            onBackToLogin={handleBackToLogin}
            isLoading={isLoading}
          />
        )}
      </FormContainer>
      
      <Footer />

      <MessageNotification
        message={message}
        messageType={messageType}
        onClose={clearMessage}
      />
    </div>
  );
};

export default Login;