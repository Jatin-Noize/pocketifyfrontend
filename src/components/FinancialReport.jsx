// src/components/FinancialReport.js
import React from "react";

const FinancialReport = ({ report }) => {
  if (!report) return null;

  

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
      

      {/* Content */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
        <section className="w-full max-w-6xl mx-auto bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-6 pb-2 border-b border-gray-700">
            Financial Report
          </h2>
          
          {/* Summary Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              <p className="text-gray-400 text-sm mb-1">Total Income</p>
              <p className="text-green-400 text-xl sm:text-2xl font-semibold">
              ₹{report.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              <p className="text-gray-400 text-sm mb-1">Total Expense</p>
              <p className="text-red-400 text-xl sm:text-2xl font-semibold">
              ₹{report.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              <p className="text-gray-400 text-sm mb-1">Net Balance</p>
              <p className={`text-xl sm:text-2xl font-semibold ${
                report.netBalance >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ₹{report.netBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Category Summary - Responsive Grid */}
          <div className="bg-gray-700 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Category-wise Summary
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Object.entries(report.categorySummary).map(([category, balance]) => (
                <div 
                  key={category} 
                  className="bg-gray-800 p-3 sm:p-4 rounded-md border border-gray-600 hover:border-purple-400 transition-colors duration-300"
                >
                  <p className="text-gray-300 text-sm sm:text-base truncate">{category}</p>
                  <p className={`font-medium text-lg ${
                    balance >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ₹{balance.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-red-500">
            
          </div>
        
          
        </section>
      
      
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

export default FinancialReport;