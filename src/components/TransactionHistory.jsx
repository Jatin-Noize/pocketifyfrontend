// src/components/TransactionHistory.js
import React, { useState, useEffect } from "react";
import CategoryPieChart from "./CategoryPieChart";
import * as XLSX from "xlsx";
import { FaFileCsv, FaSearch, FaFilter } from "react-icons/fa";
import { FaFileExcel, FaFilePdf, FaPrint, FaCopy } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransactionHistory = ({ transactions }) => {
    const tableRef = React.useRef();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [dateRange, setDateRange] = useState({
        start: "",
        end: ""
    });
    const [showFilters, setShowFilters] = useState(false);

    // Get unique categories for dropdown
    const categories = ["all", ...new Set(transactions.map(t => t.category))];
    useEffect(() => {
      let results = transactions;
  
      // Filter by search term (description)
      if (searchTerm) {
          results = results.filter(t => 
              t.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
      }
  
      // Filter by category
      if (selectedCategory !== "all") {
          results = results.filter(t => 
              t.category.toLowerCase() === selectedCategory.toLowerCase()
          );
      }
  
      // Filter by date range
      if (dateRange.start || dateRange.end) {
          results = results.filter(t => {
              try {
                  const transactionDate = new Date(t.date);
                  const startDate = dateRange.start ? new Date(dateRange.start) : null;
                  const endDate = dateRange.end ? new Date(dateRange.end) : null;
                  
                  // Handle invalid dates
                  if (isNaN(transactionDate.getTime())) return false;
                  
                  let afterStart = true;
                  if (startDate && !isNaN(startDate.getTime())) {
                      afterStart = transactionDate >= startDate;
                  }
                  
                  let beforeEnd = true;
                  if (endDate && !isNaN(endDate.getTime())) {
                      // Include the entire end date (up to 23:59:59)
                      const endOfDay = new Date(endDate);
                      endOfDay.setHours(23, 59, 59, 999);
                      beforeEnd = transactionDate <= endOfDay;
                  }
                  
                  return afterStart && beforeEnd;
              } catch (e) {
                  console.error("Error processing date filter:", e);
                  return false;
              }
          });
      }
  
      setFilteredTransactions(results);
  }, [searchTerm, selectedCategory, dateRange, transactions]);

    // Excel export
    const exportToExcel = () => {
        const table = tableRef.current;
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, "Transaction_History.xlsx");
    };  

    // Print method
    const handlePrint = () => {
        const printContent = document.getElementById('table').outerHTML;
        const newWindow = window.open('', '_blank');
        newWindow.document.open();
        newWindow.document.write(`
            <html>
                <head>
                    <title>Expense Statement</title>
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>${printContent}</body>
            </html>
        `);
        newWindow.document.close();
        newWindow.print();
    };
 
    // CSV export
    const exportToCSV = () => {
        const table = tableRef.current;
        let csvContent = "";
    
        // Get table headers
        const headers = [];
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            headers.push(table.rows[0].cells[i].innerText);
        }
        csvContent += headers.join(",") + "\n";
    
        // Get table rows
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const rowData = [];
            for (let j = 0; j < row.cells.length; j++) {
                rowData.push(row.cells[j].innerText);
            }
            csvContent += rowData.join(",") + "\n";
        }
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "Transaction_History.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
  
    // Copy to clipboard
    const copyTableToClipboard = () => {
        const table = tableRef.current;
        const range = document.createRange();
        range.selectNode(table);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        try {
            document.execCommand('copy');
            toast.success("Data Copied To Clipboard")
        } catch (err) {
            console.error('Error copying table content: ', err);
        }

        window.getSelection().removeAllRanges();
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setDateRange({ start: "", end: "" });
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
            <ToastContainer/>
            
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
            <div className="relative justify-center items-center z-10 min-h-[calc(100vh-4rem)] p-4 sm:p-6">
                <div className="flex justify-center items-center pt-10">
                    <CategoryPieChart transactions={filteredTransactions} />
                </div>
                
                <section className="max-w-4xl mx-auto mt-12 bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-lg rounded-lg border border-gray-700 overflow-hidden">
                    <div className="p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                                Transaction History
                            </h2>
                            
                            <div className="flex justify-center items-center space-x-2">
                               
                                
                                {filteredTransactions.length > 0 && (
                                    <div className="md:flex md:gap-2 sm:flex space-y-2 no-print">
                                       <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center justify-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
                                >
                                    <FaFilter className="mr-1" /> Filters
                                </button>
                                        <button
                                            onClick={exportToExcel}
                                            className="flex items-center uppercase px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                                            title="Export to Excel"
                                        >
                                            <FaFileExcel className="mr-1" /> Excel
                                        </button>

                                        <button
                                            onClick={exportToCSV}
                                            className="flex items-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm transition-colors"
                                            title="Export to Excel"
                                        >
                                            <FaFileCsv className="mr-1" /> CSV
                                        </button>                  
                                        
                                        <button
                                            onClick={handlePrint}
                                            className="flex items-center uppercase px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors"
                                            title="Print"
                                        >
                                            <FaPrint className="mr-1" /> Print
                                        </button>
                                        
                                        <button
                                            onClick={copyTableToClipboard}
                                            className="flex items-center uppercase px-3 py-1.5 h-fit bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <FaCopy className="mr-1" /> Copy
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Search and Filter Section */}
                        {showFilters && (
                            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Search by Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Search Description
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaSearch className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 w-full bg-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Search transactions..."
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Filter by Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Filter by Category
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full bg-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* Date Range Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Date Range
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                value={dateRange.start}
                                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                                className="bg-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Start date"
                                            />
                                            <input
                                                type="date"
                                                value={dateRange.end}
                                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                                className="bg-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="End date"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={resetFilters}
                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Results count */}
                        <div className="mb-2 text-sm text-gray-400">
                            Showing {filteredTransactions.length} of {transactions.length} transactions
                        </div>
                        
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                No transactions found matching your criteria.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table id="table" ref={tableRef} className="w-full">
                                    <thead className="bg-gray-700 text-gray-300">
                                        <tr>
                                            <th className="p-3 text-left text-sm sm:text-base">Date</th>
                                            <th className="p-3 text-left text-sm sm:text-base">Type</th>
                                            <th className="p-3 text-left text-sm sm:text-base">Category</th>
                                            <th className="p-3 text-left text-sm sm:text-base">Amount</th>
                                            <th className="p-3 text-left text-sm sm:text-base">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredTransactions.map((t, index) => (
                                            <tr 
                                                key={index}
                                                className={`hover:bg-gray-700 transition-colors ${
                                                    t.type === 'income' 
                                                        ? 'bg-green-900 bg-opacity-10 hover:bg-opacity-20' 
                                                        : 'bg-red-900 bg-opacity-10 hover:bg-opacity-20'
                                                }`}
                                            >
                                                <td className="p-3 text-sm sm:text-base text-gray-300">{t.date}</td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                                                        t.type === 'income' 
                                                            ? 'bg-green-900 text-green-100' 
                                                            : 'bg-red-900 text-red-100'
                                                    }`}>
                                                        {t.type}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm sm:text-base text-gray-300 capitalize">{t.category}</td>
                                                <td className={`p-3 font-medium ${
                                                    t.type === 'income' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    ₹{parseFloat(t.amount).toFixed(2)}
                                                </td>
                                                <td className="p-3 text-sm sm:text-base text-gray-300 truncate max-w-xs" title={t.description}>
                                                    {t.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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

export default TransactionHistory;