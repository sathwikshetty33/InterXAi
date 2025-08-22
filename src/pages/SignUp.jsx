import React, { useState, useEffect } from 'react';
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import SignUpForm from '../components/forms/SignUpForm';
import EmailVerification from '../components/forms/EmailVerification';
import NotificationMessage from '../components/ui/NotificationMessage';
import BackgroundEffects from '../components/ui/BackgroundEffects';
import CustomStyles from '../components/ui/CustomStyles';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    if (!username || !email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationId(data.verification_id);
        setVerificationMode(true);
        showMessage('Verification code sent to your email!', 'success');
      } else {
        console.log('Registration error:', data);
        showMessage(data.error || JSON.stringify(data.errors) || 'Registration failed', 'error');
      }
    } catch (error) {
      showMessage('Server error during signup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      showMessage('Please enter verification code', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verification_code: verificationCode,
          verification_id: verificationId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (response.ok) {
          showMessage('Account created successfully! Redirecting...', 'success');
        
          // ✅ Save token for profile setup access
          localStorage.setItem("authToken", data.token);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("password", password); // <-- Add this too if you use session fallback
        
          setTimeout(() => {
            navigate(`/profile-setup`);
          }, 1500);
        }
        

        setVerificationMode(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setVerificationCode('');
        setVerificationId('');
      } else {
        showMessage(data.error || 'Verification failed', 'error');
      }
    } catch (error) {
      showMessage('Server error during verification', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}resend-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'registration',
        }),
      });

      if (response.ok) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <BackgroundEffects />
      
      <Header />

      <div className="flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <div className={`max-w-md w-full transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {verificationMode ? (
            <EmailVerification
              email={email}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              handleVerifyEmail={handleVerifyEmail}
              handleResendCode={handleResendCode}
              setVerificationMode={setVerificationMode}
              isLoading={isLoading}
            />
          ) : (
            <SignUpForm
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              handleSignUp={handleSignUp}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <Footer />

      <NotificationMessage message={message} messageType={messageType} />
      <CustomStyles />
    </div>
  );
};

export default SignUp;