"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { assetApi } from "@/services/api";
import React from "react";
import { useData } from "@/components/providers/DataProvider";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  ticker_symbol?: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  purchase_date: string;
  portfolio_id: string;
  portfolio_name?: string;
}

export default function AssetsPage() {
  const { assets, setAssets } = useData();
  const [error, setError] = useState("");
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [form, setForm] = useState({
    name: "",
    asset_type: "",
    ticker_symbol: "",
    quantity: 0,
    purchase_price: 0,
    current_price: 0,
    purchase_date: "",
    portfolio_id: "",
    portfolio_name: "",
  });

  // useEffect(() => {
  //   const fetchAssets = async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await assetApi.getAllAssets();
  //       setAssets(data);
  //       setError("");
  //     } catch (err) {
  //       console.error("Error fetching assets:", err);
  //       setError("Failed to load assets. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchAssets();
  // }, []);

  // Simulate real-time price updates for AAPL and Indian stocks
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          if (
            [
              "AAPL",
              "RELIANCE.NS",
              "TCS.NS",
              "HDFCBANK.NS",
              "INFY.NS",
            ].includes(asset.ticker_symbol || "")
          ) {
            return {
              ...asset,
              current_price:
                Math.round(
                  (asset.current_price + (Math.random() - 0.5) * 2) * 100
                ) / 100,
            };
          }
          return asset;
        })
      );
    }, 3000); // update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate gain/loss percentage
  const calculateGainLoss = (purchasePrice: number, currentPrice: number) => {
    const percentage = ((currentPrice - purchasePrice) / purchasePrice) * 100;
    return percentage.toFixed(2);
  };

  // Calculate the total value of an asset
  const calculateTotalValue = (quantity: number, currentPrice: number) => {
    return quantity * currentPrice;
  };

  // Open Add Modal
  const handleAddAsset = () => {
    setForm({
      name: "",
      asset_type: "",
      ticker_symbol: "",
      quantity: 0,
      purchase_price: 0,
      current_price: 0,
      purchase_date: "",
      portfolio_id: "",
      portfolio_name: "",
    });
    setModalType("add");
    setShowModal(true);
  };
  // Open Edit Modal
  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setForm({
      name: asset.name,
      asset_type: asset.asset_type,
      ticker_symbol: asset.ticker_symbol || "",
      quantity: asset.quantity,
      purchase_price: asset.purchase_price,
      current_price: asset.current_price,
      purchase_date: asset.purchase_date,
      portfolio_id: asset.portfolio_id,
      portfolio_name: asset.portfolio_name || "",
    });
    setModalType("edit");
    setShowModal(true);
  };
  // Delete with confirmation
  const handleDeleteAsset = (asset: Asset) => {
    if (
      window.confirm(`Are you sure you want to delete asset: ${asset.name}?`)
    ) {
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
    }
  };
  // Handle form change
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "quantity" ||
        name === "purchase_price" ||
        name === "current_price"
          ? Number(value)
          : value,
    });
  };
  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "add") {
      const newAsset: Asset = {
        id: (Math.random() * 100000).toFixed(0),
        name: form.name,
        asset_type: form.asset_type,
        ticker_symbol: form.ticker_symbol,
        quantity: form.quantity,
        purchase_price: form.purchase_price,
        current_price: form.current_price,
        purchase_date: form.purchase_date,
        portfolio_id: form.portfolio_id,
        portfolio_name: form.portfolio_name,
      };
      setAssets((prev) => [...prev, newAsset]);
    } else if (modalType === "edit" && selectedAsset) {
      setAssets((prev) =>
        prev.map((a) => (a.id === selectedAsset.id ? { ...a, ...form } : a))
      );
    }
    setShowModal(false);
    setModalType(null);
    setSelectedAsset(null);
  };

  return (
    <div className="p-6">
      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add Asset" : "Edit Asset"}
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
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  name="asset_type"
                  value={form.asset_type}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ticker Symbol
                </label>
                <input
                  name="ticker_symbol"
                  value={form.ticker_symbol}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Purchase Price
                </label>
                <input
                  name="purchase_price"
                  type="number"
                  value={form.purchase_price}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Price
                </label>
                <input
                  name="current_price"
                  type="number"
                  value={form.current_price}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Purchase Date
                </label>
                <input
                  name="purchase_date"
                  type="date"
                  value={form.purchase_date}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Portfolio Name
                </label>
                <input
                  name="portfolio_name"
                  value={form.portfolio_name}
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
        <h1 className="text-2xl font-bold text-gray-900">Your Assets</h1>
        <button
          onClick={handleAddAsset}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Asset</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      ) : assets.length === 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-card overflow-hidden">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Portfolio</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Purchase Price</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-right">Gain/Loss</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Example row for user guidance */}
              <tr className="bg-gray-50 border-2 border-dashed border-indigo-300 opacity-80">
                <td className="py-3 px-4 font-medium">
                  Example: Apple Inc.{" "}
                  <span className="text-xs text-gray-500 ml-1">(AAPL)</span>
                </td>
                <td className="py-3 px-4">Stock</td>
                <td className="py-3 px-4">Growth Portfolio</td>
                <td className="py-3 px-4 text-right">10</td>
                <td className="py-3 px-4 text-right">₹150.00</td>
                <td className="py-3 px-4 text-right">₹175.00</td>
                <td className="py-3 px-4 text-right font-medium">₹1,750.00</td>
                <td className="py-3 px-4 text-right font-medium text-green-600">
                  +16.67%
                </td>
                <td className="py-3 px-4 text-center text-gray-400 text-xs">
                  This is an example
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center text-gray-400 text-xs mt-2">
            This is an example. Add your own assets!
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-card overflow-hidden">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Portfolio</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Purchase Price</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-right">Gain/Loss</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((asset) => {
                const gainLossPercent = calculateGainLoss(
                  asset.purchase_price,
                  asset.current_price
                );
                const totalValue = calculateTotalValue(
                  asset.quantity,
                  asset.current_price
                );

                return (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {asset.name}
                      {asset.ticker_symbol && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({asset.ticker_symbol})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{asset.asset_type}</td>
                    <td className="py-3 px-4">{asset.portfolio_name}</td>
                    <td className="py-3 px-4 text-right">{asset.quantity}</td>
                    <td className="py-3 px-4 text-right">
                      {asset.purchase_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {asset.current_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        Number(gainLossPercent) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Number(gainLossPercent) >= 0 ? "+" : ""}
                      {gainLossPercent}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="p-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
