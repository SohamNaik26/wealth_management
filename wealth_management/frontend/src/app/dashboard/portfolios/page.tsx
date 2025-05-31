"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import portfolioApi from "@/services/portfolioApi";
import React from "react";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useData } from "@/components/providers/DataProvider";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  totalValue: number;
  createdAt: string;
}

export default function PortfoliosPage() {
  const { portfolios, setPortfolios } = useData();
  const [error, setError] = useState("");
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [form, setForm] = useState({
    name: "",
    description: "",
    totalValue: "",
  });
  const { format } = useCurrency();
  const { t } = useLanguage();

  // useEffect(() => {
  //   const fetchPortfolios = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await portfolioApi.getAllPortfolios();
  //       setPortfolios(data);
  //       setError("");
  //     } catch (err) {
  //       console.error("Error fetching portfolios:", err);
  //       setError("Failed to load portfolios. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchPortfolios();
  // }, []);

  // Open Add Modal
  const handleAddPortfolio = () => {
    setForm({ name: "", description: "", totalValue: "" });
    setModalType("add");
    setShowModal(true);
    setError("");
  };
  // Open Edit Modal
  const handleEditPortfolio = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setForm({
      name: portfolio.name,
      description: portfolio.description,
      totalValue: String(portfolio.totalValue),
    });
    setModalType("edit");
    setShowModal(true);
    setError("");
  };
  // Delete with confirmation and API call
  const handleDeletePortfolio = async (portfolio: Portfolio) => {
    if (
      window.confirm(
        t("delete_portfolio_confirm") !== "delete_portfolio_confirm"
          ? t("delete_portfolio_confirm")
          : `Are you sure you want to delete portfolio: ${portfolio.name}?`
      )
    ) {
      try {
        await portfolioApi.deletePortfolio(Number(portfolio.id)); // TODO: Ensure API endpoint uses env variable
        setPortfolios((prev) => prev.filter((p) => p.id !== portfolio.id));
        setError("");
      } catch (err) {
        setError(
          t("delete_portfolio_error") !== "delete_portfolio_error"
            ? t("delete_portfolio_error")
            : "Failed to delete portfolio. Please try again later."
        );
      }
    }
  };
  // Handle form change
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Handle form submit with API integration and validation
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      form.totalValue === "" ||
      isNaN(Number(form.totalValue))
    ) {
      setError(
        t("form_validation_error") !== "form_validation_error"
          ? t("form_validation_error")
          : "Name, description, and value are required. Value must be a number."
      );
      return;
    }
    try {
      if (modalType === "add") {
        const newPortfolio = await portfolioApi.createPortfolio({
          name: form.name,
          description: form.description,
          totalValue: Number(form.totalValue),
        }); // TODO: Ensure API endpoint uses env variable
        setPortfolios((prev) => [...prev, newPortfolio]);
      } else if (modalType === "edit" && selectedPortfolio) {
        const updatedPortfolio = await portfolioApi.updatePortfolio(
          Number(selectedPortfolio.id),
          {
            name: form.name,
            description: form.description,
            totalValue: Number(form.totalValue),
          }
        ); // TODO: Ensure API endpoint uses env variable
        setPortfolios((prev) =>
          prev.map((p) =>
            p.id === selectedPortfolio.id ? { ...p, ...updatedPortfolio } : p
          )
        );
      }
      setShowModal(false);
      setModalType(null);
      setSelectedPortfolio(null);
      setError("");
    } catch (err) {
      setError(
        t("save_portfolio_error") !== "save_portfolio_error"
          ? t("save_portfolio_error")
          : "Failed to save portfolio. Please try again later."
      );
    }
  };

  return (
    <div className="p-6">
      {/* Modal for Add/Edit */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 id="portfolio-modal-title" className="text-xl font-bold mb-4">
              {modalType === "add" ? t("add_portfolio") : t("edit_portfolio")}
            </h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-2 mb-2">
                {error}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="portfolio-name"
                >
                  {t("name")}
                </label>
                <input
                  id="portfolio-name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="portfolio-description"
                >
                  {t("description")}
                </label>
                <textarea
                  id="portfolio-description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="portfolio-value"
                >
                  {t("value") || "Value"}
                </label>
                <input
                  id="portfolio-value"
                  name="totalValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.totalValue}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  aria-required="true"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  {modalType === "add" ? t("add") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("your_portfolios")}
        </h1>
        <button
          onClick={handleAddPortfolio}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>{t("add_portfolio")}</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      ) : portfolios.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example card for user guidance */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden border-2 border-dashed border-indigo-300 opacity-80">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t("example_growth_portfolio") || "Example: Growth Portfolio"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t("example_growth_portfolio_desc") ||
                  "A diversified portfolio focused on long-term growth."}
              </p>
              <div className="mb-3">
                <span className="text-sm text-gray-500">
                  {t("total_value")}
                </span>
                <p className="text-xl font-bold text-gray-900">
                  {format(50000)}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {t("created_on")} 2024-01-01
              </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-center text-gray-400 text-xs">
              {t("example_add_portfolio") ||
                "This is an example. Add your own portfolios!"}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {t(
                    portfolio.name === "Retirement Fund"
                      ? "retirement_fund"
                      : portfolio.name === "Tech Stocks"
                      ? "tech_stocks"
                      : portfolio.name === "Real Estate"
                      ? "real_estate"
                      : portfolio.name
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                  {t(
                    portfolio.description ===
                      "Long-term investments for retirement"
                      ? "long_term_investments"
                      : portfolio.description ===
                        "High growth technology investments"
                      ? "high_growth_technology"
                      : portfolio.description ===
                        "Property investments and REITs"
                      ? "property_investments"
                      : portfolio.description
                  )}
                </p>
                <div className="mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {t("total_value")}
                  </span>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {format(
                      typeof portfolio.totalValue === "number" &&
                        !isNaN(portfolio.totalValue)
                        ? portfolio.totalValue
                        : 0
                    )}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {t("created_on")}{" "}
                  {new Date(portfolio.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-5 py-3 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditPortfolio(portfolio)}
                  className="p-1 text-indigo-600 hover:text-indigo-800"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleDeletePortfolio(portfolio)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
