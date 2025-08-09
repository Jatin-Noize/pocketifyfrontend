// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import CategoryPieChart from "./CategoryPieChart";

const Home = () => {
  const [animationStage, setAnimationStage] = useState(0); // 0: logo, 1: transition, 2: content

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationStage(1); // Start fade out
    }, 1500);

    const timer2 = setTimeout(() => {
      setAnimationStage(2); // Show content
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-95"></div>
        <div className="absolute top-0 left-0 w-full h-full animate-pulse">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-600 opacity-20"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 15 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Logo Splash Screen */}
      <div className={`relative z-20 min-h-[calc(100vh-4rem)] flex items-center justify-center transition-all duration-500 ${
        animationStage === 0 ? 'opacity-100 scale-100' : 
        animationStage === 1 ? 'opacity-0 scale-110' : 'hidden'
      }`}>
        <div className="animate-pulse">
          <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            Pocketify
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 transition-all duration-700 ${
        animationStage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="w-full max-w-4xl bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-700 transform transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-4 sm:mb-6">
            Welcome to Pocketify!
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8">
            Manage your transactions, view reports, and set budgets with ease.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600 hover:border-purple-400 transition-all duration-300">
              <h3 className="text-purple-300 font-semibold text-lg mb-2">Transactions</h3>
              <p className="text-gray-300 text-sm">Track all your income and expenses</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600 hover:border-purple-400 transition-all duration-300">
              <h3 className="text-purple-300 font-semibold text-lg mb-2">Reports</h3>
              <p className="text-gray-300 text-sm">Visualize your financial data</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600 hover:border-purple-400 transition-all duration-300">
              <h3 className="text-purple-300 font-semibold text-lg mb-2">Budgets</h3>
              <p className="text-gray-300 text-sm">Set and manage spending limits</p>
            </div>

          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;