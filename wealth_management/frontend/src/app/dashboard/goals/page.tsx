"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { goalApi } from "@/services/api";
import React from "react";
import { useData } from "@/components/providers/DataProvider";

interface Goal {
  id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: "Low" | "Medium" | "High";
}

export default function GoalsPage() {
  const { goals, setGoals } = useData();
  const [error, setError] = useState("");
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    target_amount: 0,
    current_amount: 0,
    target_date: "",
    priority: "Medium",
  });

  // useEffect(() => {
  //   const fetchGoals = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await goalApi.getAllGoals();
  //       setGoals(data);
  //       setError("");
  //     } catch (err) {
  //       console.error("Error fetching goals:", err);
  //       setError("Failed to load financial goals. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchGoals();
  // }, []);

  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate the time remaining
  const calculateTimeRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) {
      return `${years} yr${years > 1 ? "s" : ""} ${
        months > 0 ? `${months} mo${months > 1 ? "s" : ""}` : ""
      }`;
    } else if (months > 0) {
      return `${months} mo${months > 1 ? "s" : ""} ${
        days > 0 ? `${days} day${days > 1 ? "s" : ""}` : ""
      }`;
    } else {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  };

  // Open Add Modal
  const handleAddGoal = () => {
    setForm({
      name: "",
      description: "",
      target_amount: 0,
      current_amount: 0,
      target_date: "",
      priority: "Medium",
    });
    setModalType("add");
    setShowModal(true);
  };
  // Open Edit Modal
  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setForm({
      name: goal.name,
      description: goal.description || "",
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date,
      priority: goal.priority,
    });
    setModalType("edit");
    setShowModal(true);
  };
  // Delete with confirmation
  const handleDeleteGoal = (goal: Goal) => {
    if (window.confirm(`Are you sure you want to delete goal: ${goal.name}?`)) {
      setGoals((prev) => prev.filter((g) => g.id !== goal.id));
    }
  };
  // Handle form change
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "target_amount" || name === "current_amount"
          ? Number(value)
          : value,
    });
  };
  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "add") {
      const newGoal: Goal = {
        id: (Math.random() * 100000).toFixed(0),
        name: form.name,
        description: form.description,
        target_amount: form.target_amount,
        current_amount: form.current_amount,
        target_date: form.target_date,
        priority: form.priority as "Low" | "Medium" | "High",
      };
      setGoals((prev) => [...prev, newGoal]);
    } else if (modalType === "edit" && selectedGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === selectedGoal.id ? { ...g, ...form } : g))
      );
    }
    setShowModal(false);
    setModalType(null);
    setSelectedGoal(null);
  };

  return (
    <div className="p-6">
      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add Goal" : "Edit Goal"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Amount
                </label>
                <input
                  name="target_amount"
                  type="number"
                  value={form.target_amount}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Amount
                </label>
                <input
                  name="current_amount"
                  type="number"
                  value={form.current_amount}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Date
                </label>
                <input
                  name="target_date"
                  type="date"
                  value={form.target_date}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
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
        <h1 className="text-2xl font-bold text-gray-900">Your Goals</h1>
        <button
          onClick={handleAddGoal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      ) : goals.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example card for user guidance */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden border-2 border-dashed border-indigo-300 opacity-80">
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Example: Buy a Car
                </h3>
                <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                  Medium
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Save for a new car by 2027
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-400 h-2.5 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="text-sm font-medium">₹8,000</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Target</p>
                  <p className="text-sm font-medium">₹20,000</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target Date: 2027-12-31</span>
                <span>3 yrs</span>
              </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-center text-gray-400 text-xs">
              This is an example. Add your own goals!
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercentage = calculateProgress(
              goal.current_amount,
              goal.target_amount
            );
            const timeRemaining = calculateTimeRemaining(goal.target_date);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {goal.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium
                      ${
                        goal.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : goal.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {goal.priority}
                    </span>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-500 mb-4">
                      {goal.description}
                    </p>
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Current</p>
                      <p className="text-sm font-medium">
                        ₹{goal.current_amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Target</p>
                      <p className="text-sm font-medium">
                        ₹{goal.target_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target Date: {formatDate(goal.target_date)}</span>
                    <span>{timeRemaining}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="p-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
