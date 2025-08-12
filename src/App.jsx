import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import TransactionForm from "./components/TransactionForm";
import TransactionHistory from "./components/TransactionHistory";
import FinancialReport from "./components/FinancialReport";
import BudgetForm from "./components/BudgetForm";
import BudgetOverview from "./components/BudgetOverview";
import Home from "./components/Home";
import CategoryPieChart from './components/CategoryPieChart';
import SignUp from "./components/Signup";
import Login from "./components/LogIn";
import axios from "axios";
import FinanceDashboard from "./components/FinanceDashboard";



const API_URL = "http://localhost:5000" || "https://pocketifybackend.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState(null);
  const [budget, setBudget] = useState({});

  const authAxios = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  // Protected fetch functions
  const fetchTransactions = async () => {
    try {
      const res = await authAxios.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchReport = async () => {
    try {
      const res = await authAxios.get("/report");
      setReport(res.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const fetchBudget = async () => {
    try {
      const res = await authAxios.get("/budget");
      setBudget(res.data);
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      await authAxios.post("/transaction", transaction);
      fetchTransactions();
      fetchReport();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const setBudgetForCategory = async (budgetData) => {
    try {
      await authAxios.post("/budget", budgetData);
      fetchBudget();
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  // When token is available, load data
  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchReport();
      fetchBudget();
    }
  }, [token]);

  // Simple logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Render authentication components if no token is present
  if (!token) {
    return (
      <Router>
        
        <div className="relative min-h-screen overflow-hidden flex justify-center items-center">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-95"></div>
            <div className="absolute top-0 left-0 w-full h-full animate-pulse">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-blue-500 opacity-20"
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
          <div className="bg-opacity-50 rounded-3xl backdrop-blur-sm text-white p-8 shadow-xl w-full max-w-md mx-4 m-4 border-gray-700">
          <h1 className="text-4xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-gradient">
  Pocketify
</h1>
            <p className="text-center text-gray-400 mb-6">
              Your Personal Finance Management App
            </p>
            
            <div className="space-y-6">
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login onLogin={(token) => setToken(token)} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
               
              </Routes>
              
              <div className="relative border-t border-gray-700">
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl px-4 text-gray-400">
                  OR
                </span>
                
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => window.location.href = '/signup'}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                >
                  Sign Up
                </button>
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
      </Router>
    );
  }

  // Main app content when authenticated
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar isAuthenticated={!!token} onLogout={handleLogout} />
        <div className="max-w-full mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={
              <div>
                <TransactionForm addTransaction={addTransaction} />
                <TransactionHistory transactions={transactions} />
              </div>
            } />
            <Route path="/report" element={<FinancialReport report={report} />} />
            <Route path="/dash" element={<FinanceDashboard/>} />
           
           
            <Route path="/budget" element={
              <div>
                <BudgetForm setBudgetForCategory={setBudgetForCategory} />
                <BudgetOverview budget={budget} />
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;