import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Star, Users, Trophy, Zap, MessageCircle, Brain, Target } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/Footer';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "95%", label: "Success Rate", icon: Trophy },
    { number: "50K+", label: "Users Trained", icon: Users },
    { number: "1M+", label: "Interviews Practiced", icon: Target }
  ];

  return (
       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{ fontFamily: 'Madefor, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Header />
    <div>
      {/* Revolutionary Hero Section */}
      <section className="relative px-16 py-24 min-h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className={`max-w-5xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Floating Stats */}
            <div className="flex items-center space-x-8 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-500 ${currentStat === index ? 'bg-purple-500/20 border-purple-400/50 scale-105' : ''}`}>
                    <Icon className="w-5 h-5 text-purple-300" />
                    <span className="text-white font-semibold">{stat.number}</span>
                    <span className="text-gray-300 text-sm">{stat.label}</span>
                  </div>
                );
              })}
            </div>

            <h1 className="text-9xl font-black text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text mb-8 leading-tight">
              Master Any
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text animate-pulse">
                Interview
              </span>
            </h1>
            
            <p className="text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl">
              Transform your interview skills with AI-powered practice sessions. Get personalized feedback, 
              realistic scenarios, and the confidence to land your dream job.
            </p>
            
            <div className="flex items-center space-x-6 mb-16">
              <button className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 flex items-center space-x-3">
                <span>Start Practicing</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group flex items-center space-x-3 text-white hover:text-purple-300 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:border-purple-400/50 group-hover:bg-purple-500/20 transition-all duration-300">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <span className="text-xl font-semibold">Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-lg">4.9/5 from 10,000+ users</span>
              </div>
              <div className="h-6 w-px bg-gray-600"></div>
              <span className="text-lg">Trusted by Fortune 500 companies</span>
            </div>
          </div>

          {/* Interactive AI Interview Simulator Preview */}
          <div className="absolute top-1/2 right-16 transform -translate-y-1/2 w-96 h-96">
            <div className="relative w-full h-full">
              {/* Floating Chat Bubbles */}
              <div className="absolute top-8 right-8 bg-gradient-to-r from-purple-500/90 to-blue-500/90 backdrop-blur-sm text-white p-4 rounded-2xl rounded-tr-sm shadow-2xl animate-float">
                <p className="text-sm font-medium">"Tell me about yourself"</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Brain className="w-4 h-4" />
                  <span className="text-xs opacity-75">AI Interviewer</span>
                </div>
              </div>
              
              <div className="absolute top-32 right-24 bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-2xl rounded-br-sm shadow-2xl animate-float-delayed">
                <p className="text-sm font-medium">"I'm passionate about..."</p>
                <div className="flex items-center space-x-2 mt-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-xs opacity-75">You</span>
                </div>
              </div>

              <div className="absolute bottom-16 right-12 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm text-white p-4 rounded-2xl shadow-2xl animate-float">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Real-time Feedback</span>
                </div>
                <p className="text-xs mt-1 opacity-90">Great eye contact! 👍</p>
              </div>

              {/* Animated Background Circles */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-12 right-8 w-24 h-24 bg-blue-400/20 rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/2 right-1/2 w-40 h-40 bg-cyan-400/10 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-slow-float"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-slow-float-delayed"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-slow-pulse"></div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section className="px-16 py-32 bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          {/* Features Header */}
          <div className="text-center mb-20">
            <h2 className="text-7xl font-black text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text mb-8">
              Why InterXAI Dominates
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
              Experience the most advanced AI interview preparation platform. 
              Every feature designed to give you the ultimate competitive edge.
            </p>
          </div>

          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="group bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 text-center">
                Advanced AI Conversations
              </h3>
              <p className="text-gray-300 text-center leading-relaxed text-lg">
                Practice with GPT-4 powered interviewers that adapt to your responses. 
                Experience realistic conversations with industry-specific scenarios and behavioral questions.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2 text-purple-300">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Most Realistic AI</span>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-3xl p-12 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Zap className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 text-center">
                Instant Smart Feedback
              </h3>
              <p className="text-gray-300 text-center leading-relaxed text-lg">
                Get real-time analysis of your body language, speech patterns, and answer quality. 
                Receive detailed reports with actionable insights to improve immediately.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2 text-blue-300">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Precision Analysis</span>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-cyan-900/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-12 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 text-center">
                Hyper-Personalized Journey
              </h3>
              <p className="text-gray-300 text-center leading-relaxed text-lg">
                Customized interview paths based on your industry, role, and experience level. 
                Practice anywhere with our mobile-first platform and track your progress.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2 text-cyan-300">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Tailored Success</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white px-16 py-6 rounded-full text-2xl font-bold hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 animate-pulse">
              Experience the Revolution
            </button>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        @keyframes slow-float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(-10px) translateX(-10px); }
        }
        @keyframes slow-float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(15px) translateX(-15px); }
          66% { transform: translateY(-25px) translateX(5px); }
        }
        @keyframes slow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-slow-float {
          animation: slow-float 8s ease-in-out infinite;
        }
        .animate-slow-float-delayed {
          animation: slow-float-delayed 10s ease-in-out infinite;
        }
        .animate-slow-pulse {
          animation: slow-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
         <Footer />
    </div>
  );
};

export default Home;