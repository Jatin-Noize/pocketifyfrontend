// src/components/BudgetForm.js
import React, { useState } from "react";

const BudgetForm = ({ setBudgetForCategory }) => {
  const [budgetForm, setBudgetForm] = useState({ category: "", limit: "" });

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setBudgetForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setBudgetForCategory({
      category: budgetForm.category,
      limit: parseFloat(budgetForm.limit)
    });
    setBudgetForm({ category: "", limit: "" });
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Animated background - fixed positioning */}
      <div className="fixed inset-0 overflow-hidden -z-10">
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

      {/* Form content - properly sized container */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        <section className="w-full max-w-md bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-6 mx-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6 text-center">
            Set Budget
          </h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 text-lg">Category</label>
<select
  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  name="category"
  value={budgetForm.category}
  onChange={handleBudgetChange}
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
 
  
  <option value="Other" className="bg-gray-800">Other</option>
</select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 text-lg">Budget Limit</label>
              <input
                className="w-full p-4 text-lg bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                name="limit"
                placeholder="0.00"
                value={budgetForm.limit}
                onChange={handleBudgetChange}
                required
                step="0.01"
                min="0"
              />
            </div>
            
            <button 
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg text-lg"
              type="submit"
            >
              Set Budget
            </button>
          </form>
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

export default BudgetForm;