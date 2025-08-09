// src/components/SignUp.js
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const SignUp = ({ onSignUpSuccess }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/register`, form);
      toast.success("Account created successfully! You can now login.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Clear form on success
      setForm({ username: "", password: "" });
      
      // Optional: Automatically redirect to login or callback
      if (onSignUpSuccess) {
        onSignUpSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      
      if (error.response?.status === 400) {
        toast.error("Username already exists", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-600 shadow-2xl rounded mb-4 relative">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          minLength={3}
        />
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={4}
        />
        <button 
          className={`w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 
                     transition-all duration-200 hover:shadow-lg active:shadow-inner
                     hover:-translate-y-0.5 active:translate-y-0 border-b-4 border-purple-700
                     active:border-b-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;