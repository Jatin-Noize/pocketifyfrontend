import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Assuming you have an auth context
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState(null);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, reportRes, budgetsRes] = await Promise.all([
        axios.get('/transactions', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/report', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/budget', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      
      setTransactions(transactionsRes.data);
      setReport(reportRes.data);
      setBudgets(budgetsRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      
      // Set up polling for real-time updates (every 30 seconds)
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, timeRange]);

  // Handle setting new budget
  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/budget', newBudget, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Budget set for ${newBudget.category}`);
      setNewBudget({ category: '', limit: '' });
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to set budget');
      console.error(error);
    }
  };

  // Filter transactions by time range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    
    if (timeRange === 'week') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return transactionDate >= oneWeekAgo;
    } else if (timeRange === 'month') {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return transactionDate >= oneMonthAgo;
    } else if (timeRange === 'year') {
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      return transactionDate >= oneYearAgo;
    }
    return true;
  });

  // Prepare data for charts
  const prepareChartData = () => {
    if (!report) return [];
    
    // Income vs Expense over time
    const monthlyData = filteredTransactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { name: month, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }
      
      return acc;
    }, {});
    
    const incomeExpenseData = Object.values(monthlyData);
    
    // Category breakdown
    const categoryData = Object.entries(report.categorySummary || {}).map(([name, value]) => ({
      name,
      value: Math.abs(value)
    }));
    
    // Budget vs Actual
    const budgetData = Object.entries(budgets).map(([category, budget]) => {
      const spent = report.categorySummary?.[category] < 0 ? 
        Math.abs(report.categorySummary[category]) : 0;
      return {
        name: category,
        budget,
        spent,
        remaining: budget - spent
      };
    });
    
    return { incomeExpenseData, categoryData, budgetData };
  };

  const { incomeExpenseData, categoryData, budgetData } = prepareChartData();

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Financial Dashboard</h1>
        <div className="flex space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">
            ${report?.totalIncome?.toFixed(2) || '0.00'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            ${report?.totalExpense?.toFixed(2) || '0.00'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Net Balance</h3>
          <p className={`text-3xl font-bold ${
            report?.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${report?.netBalance?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Income vs Expenses Over Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#F44336" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Budget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Budget vs Actual */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Budget vs Actual Spending</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                <Bar dataKey="spent" fill="#FF8042" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Set Budget Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Set Budget</h3>
          <form onSubmit={handleSetBudget} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newBudget.category}
                onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Limit ($)</label>
              <input
                type="number"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({...newBudget, limit: parseFloat(e.target.value)})}
                className="w-full border rounded px-3 py-2"
                min="0"
                step="0.01"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Set Budget
            </button>
          </form>
          
          {/* Budget Alerts */}
          <div className="mt-6">
            <h4 className="font-medium mb-2">Budget Warnings</h4>
            {budgetData.filter(item => item.spent > item.budget).length > 0 ? (
              budgetData
                .filter(item => item.spent > item.budget)
                .map(item => (
                  <div key={item.name} className="bg-red-100 border-l-4 border-red-500 p-3 mb-2">
                    <p className="text-red-700">
                      <strong>{item.name}</strong>: You've exceeded your budget by ${(item.spent - item.budget).toFixed(2)}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-green-600">No budgets exceeded!</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <p className="text-center py-4 text-gray-500">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;