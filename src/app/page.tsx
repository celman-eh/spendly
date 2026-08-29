"use client";

import { useState, useEffect } from "react";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  expense: ["Food", "Transport", "Rent", "Entertainment", "Shopping", "Bills", "Other"],
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Food");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("spendly-transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("spendly-transactions", JSON.stringify(transactions));
  }, [transactions]);

  const balance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Spendly</h1>
          <p className="text-gray-400 mt-2">Simple expense tracker that actually works</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl p-5 text-center border border-gray-800">
            <p className="text-sm text-gray-400">Balance</p>
            <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-5 text-center border border-gray-800">
            <p className="text-sm text-gray-400">Income</p>
            <p className="text-2xl font-bold mt-1 text-emerald-400">+${income.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-5 text-center border border-gray-800">
            <p className="text-sm text-gray-400">Expenses</p>
            <p className="text-2xl font-bold mt-1 text-red-400">-${expense.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Transaction Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategory("Food");
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition ${type === "expense" ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400"
                }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategory("Salary");
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition ${type === "income" ? "bg-emerald-500 text-white" : "bg-gray-800 text-gray-400"
                }`}
            >
              Income
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              min="0"
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition"
            >
              Add Transaction
            </button>
          </div>
        </form>

        {/* Transaction List */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No transactions yet. Add your first one!</p>
          ) : (
            transactions.map((t) => (
              <div
                key={t.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-sm text-gray-400">
                    {t.category} • {t.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`font-semibold ${t.type === "income" ? "text-emerald-400" : "text-red-400"
                      }`}
                  >
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="text-gray-500 hover:text-red-400 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}