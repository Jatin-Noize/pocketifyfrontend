// src/components/BudgetOverview.js
import React from "react";

const BudgetOverview = ({ budget }) => {
  return (
    <section className="mb-8 m-4 p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Budget Overview</h2>
      <ul className="space-y-2">
        {Object.entries(budget).map(([cat, bal]) => (
          <li 
            key={cat} 
            className="flex justify-between items-center p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            <span className="text-gray-300">{cat}</span>
            <span className="font-medium text-white">₹{bal}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BudgetOverview;