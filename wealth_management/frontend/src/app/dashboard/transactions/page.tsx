"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { transactionApi } from "@/services/api";
import React from "react";
import { useData } from "@/components/providers/DataProvider";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  date: string;
  asset_id?: string;
  asset_name?: string;
  notes?: string;
}

export default function TransactionsPage() {
  const { transactions, setTransactions } = useData();
  const [error, setError] = useState("");
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [form, setForm] = useState({
    transaction_type: "",
    amount: 0,
    date: "",
    asset_id: "",
    asset_name: "",
    notes: "",
  });

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await transactionApi.getAllTransactions();
  //       setTransactions(data);
  //       setError("");
  //     } catch (err) {
  //       console.error("Error fetching transactions:", err);
  //       setError("Failed to load transactions. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchTransactions();
  // }, []);

  // Sample transactions for development
  useEffect(() => {
    if (transactions.length === 0) {
      setTransactions([
        {
          id: "1",
          transaction_type: "Purchase",
          amount: 6793.5,
          date: "2023-04-15",
          asset_id: "1",
          asset_name: "Apple Inc.",
          notes: "Initial purchase of 50 shares",
        },
        {
          id: "2",
          transaction_type: "Purchase",
          amount: 7605.0,
          date: "2023-03-10",
          asset_id: "2",
          asset_name: "S&P 500 ETF",
          notes: "Monthly retirement contribution",
        },
        {
          id: "3",
          transaction_type: "Dividend",
          amount: 320.75,
          date: "2023-06-30",
          asset_id: "2",
          asset_name: "S&P 500 ETF",
          notes: "Quarterly dividend payment",
        },
        {
          id: "4",
          transaction_type: "Sale",
          amount: 2500.0,
          date: "2023-05-22",
          asset_id: "1",
          asset_name: "Apple Inc.",
          notes: "Partial sale of 15 shares",
        },
        {
          id: "5",
          transaction_type: "Income",
          amount: 1200.0,
          date: "2023-07-01",
          asset_id: "3",
          asset_name: "Rental Property",
          notes: "Monthly rental income",
        },
      ]);
    }
  }, [transactions.length]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Open Add Modal
  const handleAddTransaction = () => {
    setForm({
      transaction_type: "",
      amount: 0,
      date: "",
      asset_id: "",
      asset_name: "",
      notes: "",
    });
    setModalType("add");
    setShowModal(true);
  };
  // Open Edit Modal
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setForm({
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      date: transaction.date,
      asset_id: transaction.asset_id || "",
      asset_name: transaction.asset_name || "",
      notes: transaction.notes || "",
    });
    setModalType("edit");
    setShowModal(true);
  };
  // Delete with confirmation
  const handleDeleteTransaction = (transaction: Transaction) => {
    if (window.confirm(`Are you sure you want to delete this transaction?`)) {
      setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
    }
  };
  // Handle form change
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "amount" ? Number(value) : value });
  };
  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "add") {
      const newTransaction: Transaction = {
        id: (Math.random() * 100000).toFixed(0),
        transaction_type: form.transaction_type,
        amount: form.amount,
        date: form.date,
        asset_id: form.asset_id,
        asset_name: form.asset_name,
        notes: form.notes,
      };
      setTransactions((prev) => [...prev, newTransaction]);
    } else if (modalType === "edit" && selectedTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id ? { ...t, ...form } : t
        )
      );
    }
    setShowModal(false);
    setModalType(null);
    setSelectedTransaction(null);
  };

  return (
    <div className="p-6">
      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add Transaction" : "Edit Transaction"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="transaction_type"
                  value={form.transaction_type}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Sale">Sale</option>
                  <option value="Dividend">Dividend</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Asset Name
                </label>
                <input
                  name="asset_name"
                  value={form.asset_name}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  {modalType === "add" ? "Add" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Transaction History
        </h1>
        <button
          onClick={handleAddTransaction}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example row for user guidance */}
                <tr className="bg-gray-50 border-2 border-dashed border-indigo-300 opacity-80">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2024-05-20
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Purchase
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Apple Inc.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    ₹1,000.00
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    Initial investment
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-400 text-xs">
                    This is an example
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-center text-gray-400 text-xs mt-2">
              This is an example. Add your own transactions!
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          transaction.transaction_type === "Purchase"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.transaction_type === "Sale"
                            ? "bg-purple-100 text-purple-800"
                            : transaction.transaction_type === "Dividend"
                            ? "bg-green-100 text-green-800"
                            : transaction.transaction_type === "Income"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.asset_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {transaction.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {transaction.notes || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
