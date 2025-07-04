import React from 'react';

const Header = () => {
  return (
    <nav className="flex items-center justify-between px-16 py-8 bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <div className="flex relative">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full -ml-4 animate-pulse delay-150"></div>
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">InterXAI</span>
      </div>
      <div className="flex items-center space-x-12">
        <a href="/" className="text-white hover:text-purple-300 transition-all duration-300 text-lg font-medium relative group">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="/about" className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative group">
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="/login" className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative group">
          Login
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="/signup" className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative group">
          Sign Up
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
        </a>
      </div>
    </nav>
  );
};

export default Header;