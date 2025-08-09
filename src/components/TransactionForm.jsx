// src/components/TransactionForm.js
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TransactionForm = ({ addTransaction }) => {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income",
    category: "",
    date: ""
  });

  useEffect(() => {
   
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setForm(prev => ({ ...prev, date: formattedDate }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date
    });
    setForm({ 
      description: "", 
      amount: "", 
      type: "income", 
      category: "", 
      date: new Date().toISOString().split('T')[0] // Reset to current date
    });
    toast.success("Transaction Added Successfully");
    
  };

 

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
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

      {/* Form content */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)]  flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md  bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700 transform transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-6 text-center">
            Add Transaction
          </h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <input
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                type="text"
                name="description"
                placeholder="Enter description"
                value={form.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Amount</label>
              <input
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                type="number"
                name="amount"
                placeholder="0.00"
                value={form.amount}
                onChange={handleInputChange}
                required
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Type</label>
              <select
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="type"
                value={form.type}
                onChange={handleInputChange}
              >
                <option value="income" className="bg-gray-800">Income</option>
                <option value="expense" className="bg-gray-800">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Category</label>
              <select
  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  name="category"
  value={form.category}
  onChange={handleInputChange}
  required
>
  <option value="" disabled className="text-gray-400 bg-gray-800">Select a category</option>
  
  {/* Expense Categories */}
  <optgroup label="Expenses" className="bg-gray-800">
    <option value="Groceries" className="bg-gray-800">Groceries</option>
    <option value="Entertainment" className="bg-gray-800">Entertainment</option>
    <option value="Utilities" className="bg-gray-800">Utilities</option>
    <option value="Rent/Mortgage" className="bg-gray-800">Rent/Mortgage</option>
    <option value="Transportation" className="bg-gray-800">Transportation</option>
    <option value="Dining Out" className="bg-gray-800">Dining Out</option>
    <option value="Healthcare" className="bg-gray-800">Healthcare</option>
    <option value="Education" className="bg-gray-800">Education</option>
    <option value="Shopping" className="bg-gray-800">Shopping</option>
  </optgroup>
  
  {/* Income Categories */}
  <optgroup label="Income" className="bg-gray-800">
    <option value="Salary" className="bg-gray-800">Salary</option>
    <option value="Freelance" className="bg-gray-800">Freelance</option>
    <option value="Investments" className="bg-gray-800">Investments</option>
    <option value="Gifts" className="bg-gray-800">Gifts</option>
    <option value="Bonus" className="bg-gray-800">Bonus</option>
  </optgroup>
  
  <option value="Other" className="bg-gray-800">Other</option>
</select>
            </div>

            <div>
      <label className="block text-gray-300 mb-1">Date</label>
      <input
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        type="date"
        name="date"
        readOnly
        value={form.date}
        onChange={handleInputChange}
        required
      />
    </div>

            <button 
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg"
              type="submit"
            >
              Add Transaction
            </button>
          </form>
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

export default TransactionForm;