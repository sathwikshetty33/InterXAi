import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowLeft, Mail, Lock, User, Shield } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/Footer';

const baseUrl = 'http://localhost:8000/api/users/';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [forgotMode, setForgotMode] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  const handleLogin = async () => {
    setIsLoading(true);
  
    try {
      const res = await fetch(`${baseUrl}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // 1. Store the token
        localStorage.setItem("authToken", data.token);
  
        // 2. Fetch profile_id from /get-id/
        const idRes = await fetch("http://localhost:8000/api/users/get-id/", {
          headers: {
            Authorization: `Token ${data.token}`,
          },
        });
  
        const idData = await idRes.json();
  
        if (idRes.ok && idData.profile_id) {
          showMessage('Login successful!', 'success');
  
          // 3. Redirect to dashboard
          window.location.href = `/profile/${idData.profile_id}`;
        } else {
          showMessage('Failed to retrieve profile ID.', 'error');
        }
  
      } else {
        showMessage(data.detail || 'Login failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleForgotPassword = async () => {
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

  const handleVerifyCode = async () => {
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

  const handleResetPassword = async () => {
    
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
          setNewPassword('');
          setConfirmPassword('');
          setCode('');
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

  const handleResendCode = async () => {
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

  const resetForm = () => {
    setForgotMode(false);
    setStep(1);
    setUsername('');
    setPassword('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setMessageType('');
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return <Mail className="w-6 h-6" />;
      case 2: return <Shield className="w-6 h-6" />;
      case 3: return <Lock className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <AlertCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Header />
      
      <div className="flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <div className={`max-w-md w-full transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>
            
            {!forgotMode ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400 mt-2">Sign in to your account</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder-slate-400"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-white shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
                    {getStepIcon()}
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {step === 1 ? 'Reset Password' : step === 2 ? 'Verify Code' : 'New Password'}
                  </h2>
                  <p className="text-slate-400 mt-2">
                    {step === 1 ? 'Enter your username to receive a reset code' : 
                     step === 2 ? 'Enter the verification code sent to your email' : 
                     'Create your new password'}
                  </p>
                </div>

                <div className="space-y-4">
                  {step === 1 && (
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder-slate-400"
                        required
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <>
                      <div className="relative group">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="Verification Code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder-slate-400 text-center text-lg tracking-widest"
                          required
                        />
                      </div>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={isLoading}
                          className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline disabled:opacity-50"
                        >
                          Resend verification code
                        </button>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder-slate-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-700/50 border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder-slate-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={step === 1 ? handleForgotPassword : step === 2 ? handleVerifyCode : handleResetPassword}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-white shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>
                        {step === 1 ? 'Sending...' : step === 2 ? 'Verifying...' : 'Resetting...'}
                      </span>
                    </div>
                  ) : (
                    step === 1 ? 'Send Code' : step === 2 ? 'Verify Code' : 'Reset Password'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </button>
                </div>
              </div>
            )}

            {/* Message popup */}
            {message && (
              <div className={`fixed top-6 right-6 max-w-sm p-4 rounded-xl shadow-2xl border backdrop-blur-xl transform transition-all duration-500 z-50 ${
                messageType === 'success' 
                  ? 'bg-green-900/80 border-green-500/50 text-green-100' 
                  : messageType === 'error'
                  ? 'bg-red-900/80 border-red-500/50 text-red-100'
                  : 'bg-blue-900/80 border-blue-500/50 text-blue-100'
              } animate-slide-in`}>
                <div className="flex items-center space-x-3">
                  {getMessageIcon()}
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slide-in {
          0% { 
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          100% { 
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;