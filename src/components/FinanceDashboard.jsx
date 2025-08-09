import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Papa from 'papaparse';
import {
  LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import CategoryPieChart from './CategoryPieChart';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6961', '#a05195', '#f95d6a', '#ff7c43', '#665191'];

const FinanceDashboard = () => {
  const [data, setData] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balanceData, setBalanceData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map(row => ({
          date: new Date(row['Date']).toISOString().split('T')[0],
          type: row['Type'],
          category: row['Category'],
          amount: parseFloat(row['Amount'].replace(/[₹,]/g, '')),
          description: row['Description']
        }));

        setData(parsed);
        processStats(parsed);
      }
    });
  };

  const printRef = useRef();
  

  const processStats = (parsed) => {
    let income = 0, expense = 0, runningBalance = 0;
    const daily = {};
    const categoryMap = {};

    const sorted = [...parsed].sort((a, b) => new Date(a.date) - new Date(b.date));
    const balanceChart = [];

    sorted.forEach(entry => {
      if (!daily[entry.date]) daily[entry.date] = { date: entry.date, income: 0, expense: 0 };

      if (entry.type === 'income') {
        income += entry.amount;
        daily[entry.date].income += entry.amount;
        runningBalance += entry.amount;
      } else {
        expense += entry.amount;
        daily[entry.date].expense += entry.amount;
        runningBalance -= entry.amount;
        categoryMap[entry.category] = (categoryMap[entry.category] || 0) + entry.amount;
      }

      balanceChart.push({ date: entry.date, balance: runningBalance });
    });

    setIncomeTotal(income);
    setExpenseTotal(expense);
    setBalanceData(balanceChart);
    setCategoryData(Object.entries(categoryMap).map(([k, v]) => ({ name: k, value: v })));
  };

  const dailyData = Object.values(
    data.reduce((acc, item) => {
      const key = item.date;
      if (!acc[key]) acc[key] = { date: key, income: 0, expense: 0 };
      if (item.type === 'income') acc[key].income += item.amount;
      else acc[key].expense += item.amount;
      return acc;
    }, {})
  );



  return (
    <div  className="min-h-screen  bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8">
      
      <div className="max-w-7xl mx-auto0 " ref={printRef} >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2">💰 Pocketify Dashboard</h1>
            <p className="text-purple-600">Visualize your financial data in a delightful way</p>
          </div>
          

          
          {/* File Upload */}
          <div className="w-full md:w-auto">
            
          {/* <button
              onClick={printDiv}
              className="no-print flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Dashboard
            </button> */}
            
            <label className="flex flex-col items-center px-4 py-3 bg-white rounded-lg border-2 border-dashed border-purple-300 cursor-pointer hover:bg-purple-50 transition-colors">
              <div id="id" className="flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="font-medium text-purple-700">Choose CSV File</span>
              </div>
              <input 
                type="file" 
                accept=".csv,.tsv" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              {fileName && (
                <span className="mt-1 text-sm text-purple-600 truncate max-w-xs">
                  {fileName}
                </span>
              )}
            </label>
          </div>
          
          
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard 
            title="Total Income" 
            value={`₹${incomeTotal.toFixed(2)}`} 
            icon="💰" 
            bgColor="bg-green-100"
            textColor="text-green-800"
          />
          <SummaryCard 
            title="Total Expenses" 
            value={`₹${expenseTotal.toFixed(2)}`} 
            icon="💸" 
            bgColor="bg-red-100"
            textColor="text-red-800"
          />
          <SummaryCard 
            title="Net Balance" 
            value={`₹${(incomeTotal - expenseTotal).toFixed(2)}`} 
            icon="🏦" 
            bgColor="bg-blue-100"
            textColor="text-blue-800"
          />
          <SummaryCard 
            title="Top Category" 
            value={categoryData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'} 
            icon="🏷️" 
            bgColor="bg-purple-100"
            textColor="text-purple-800"
          />
          
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expenses Chart */}
          <ChartContainer title="Income vs Expenses by Date" emoji="📅">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                <XAxis dataKey="date" stroke="#6b46c1" />
                <YAxis stroke="#6b46c1" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.5rem',
                    borderColor: '#d8b4fe',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="#82ca9d" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ff6961" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Expense Categories Pie Chart */}
          <ChartContainer title="Expense Categories" emoji="🗂️">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={categoryData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80}
                  innerRadius={40}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.5rem',
                    borderColor: '#d8b4fe'
                  }}
                />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Cumulative Balance Line Chart */}
          <div className="lg:col-span-2">
            <ChartContainer title="Your Financial Journey" emoji="📈">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="date" stroke="#6b46c1" />
                  <YAxis stroke="#6b46c1" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '0.5rem',
                      borderColor: '#d8b4fe'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', r: 4 }}
                    activeDot={{ r: 6, fill: '#6b46c1' }}
                    name="Balance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
          </div>
        </div>

        {/* Recent Transactions Table */}
        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-purple-100 bg-purple-50">
              <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                <span>🔄</span> Recent Transactions
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-100">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {data.slice(0, 5).map((transaction, index) => (
                    <tr key={index} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900">
                        {transaction.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </div>
    
    </div>
  );
};

const SummaryCard = ({ title, value, icon, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-xl p-4 shadow-sm border border-transparent hover:border-${textColor.split('-')[1]}-300 transition-all`}>
    <div className="flex items-center justify-between">
      <div>
        <h4 className={`text-xs font-semibold ${textColor} uppercase tracking-wider`}>{title}</h4>
        <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
    
  </div>
);

const ChartContainer = ({ title, emoji, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
    <div className="p-4 border-b border-purple-100">
      <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

export default FinanceDashboard;