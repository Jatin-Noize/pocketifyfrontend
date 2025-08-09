import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ transactions }) => {
  // Process transaction data to create chart data
  const processData = () => {
    const categories = {
      income: {},
      expense: {}
    };

    // Categorize transactions
    transactions.forEach(transaction => {
      const { type, category, amount } = transaction;
      if (!categories[type][category]) {
        categories[type][category] = 0;
      }
      categories[type][category] += amount;
    });

    return categories;
  };

  const categoryData = processData();

  // Income data for chart
  const incomeData = {
    labels: Object.keys(categoryData.income),
    datasets: [{
      data: Object.values(categoryData.income),
      backgroundColor: [
        '#4ade80', '#22d3ee', '#a78bfa', '#fbbf24', '#f87171',
        '#60a5fa', '#34d399', '#e879f9', '#fb923c', '#38bdf8'
      ],
      borderColor: '#1e293b',
      borderWidth: 1
    }]
  };

  // Expense data for chart
  const expenseData = {
    labels: Object.keys(categoryData.expense),
    datasets: [{
      data: Object.values(categoryData.expense),
      backgroundColor: [
        '#A8E6CF', // Soft mint
        '#DCEDC1', // Pale lime
        '#FFD3B6', // Peach
        '#FFAAA5', // Watermelon
        '#FF8B94', // Blush pink
        '#D4A5A5', // Dusty rose
        '#FEC8D8', // Cotton candy
        '#E0BBE4', // Lavender
        '#957DAD', // Muted purple
        '#D291BC', // Orchid
        '#F7D6E0', // Baby pink
        '#B5EAD7', // Aqua
        '#C7CEEA', // Periwinkle
        '#E2F0CB', // Honeydew
        '#B2F7EF', // Ice blue
        '#FFDFD3' 
      ],
      borderColor: '#1e293b',
      borderWidth: 1
    }]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl md:w-6xl   p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-gray-200 mb-6 text-center">
        Income vs Expenses by Category
      </h2>
    
      <div className="grid  grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-400 mb-4 text-center">Income</h3>
          {Object.keys(categoryData.income).length > 0 ? (
            <Pie data={incomeData} options={options} />
          ) : (
            <p className="text-gray-400 text-center py-8">No income data available</p>
          )}
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-400 mb-4 text-center">Expenses</h3>
          {Object.keys(categoryData.expense).length > 0 ? (
            <Pie data={expenseData} options={options} />
          ) : (
            <p className="text-gray-400 text-center py-8">No expense data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;