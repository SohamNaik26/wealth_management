"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  portfolioApi,
  assetApi,
  goalApi,
  transactionApi,
} from "@/services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { SmartSearchBar } from "@/components/dashboard/SmartSearchBar";
import { useData } from "@/components/providers/DataProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

// Define types for our data
interface AssetSummary {
  name: string;
  value: number;
  color: string;
}

interface Portfolio {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string;
}

interface Asset {
  id: number;
  name: string;
  asset_type: string;
  ticker_symbol: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  purchase_date: string;
  portfolio_id: number;
  created_at: string;
}

interface FinancialGoal {
  id: number;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: string;
  user_id: number;
  created_at: string;
}

interface Transaction {
  id: number;
  transaction_type: string;
  amount: number;
  asset_id: number;
  user_id: number;
  transaction_date: string;
  notes: string;
}

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
];

export default function Dashboard() {
  const { data: session } = useSession();
  const { portfolios, assets, transactions, goals } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string>("");
  const { t } = useLanguage();

  // Calculate total portfolio value
  const totalPortfolioValue = assets.reduce(
    (total, asset) => total + asset.quantity * asset.current_price,
    0
  );

  // Prepare asset type distribution data for pie chart
  const assetTypeDistribution = assets.reduce(
    (acc: Record<string, number>, asset) => {
      const value = asset.quantity * asset.current_price;
      acc[asset.asset_type] = (acc[asset.asset_type] || 0) + value;
      return acc;
    },
    {}
  );

  const assetDistributionData: AssetSummary[] = Object.keys(
    assetTypeDistribution
  ).map((type, idx) => ({
    name: type,
    value: assetTypeDistribution[type],
    color: COLORS[idx % COLORS.length],
  }));

  // Prepare goals progress data for bar chart
  const goalsProgressData = goals.map((goal, idx) => ({
    name: goal.name,
    current: goal.current_amount,
    target: goal.target_amount,
    color: COLORS[idx % COLORS.length],
  }));

  // Demo data for analytics chart
  const analyticsData = {
    pie: {
      labels: assetDistributionData.map((a) => a.name),
      datasets: [
        {
          data: assetDistributionData.map((a) => a.value),
          backgroundColor: assetDistributionData.map((a) => a.color),
        },
      ],
    },
    bar: {
      labels: goals.map((g) => g.name),
      datasets: [
        {
          label: "Current",
          data: goals.map((g) => g.current_amount),
          backgroundColor: "#6366f1",
        },
        {
          label: "Target",
          data: goals.map((g) => g.target_amount),
          backgroundColor: "#a5b4fc",
        },
      ],
    },
  };

  // Smart search items (combine assets, portfolios, goals)
  const searchItems = [
    ...assets.map((a) => ({ ...a, type: "Asset" })),
    ...portfolios.map((p) => ({ ...p, type: "Portfolio" })),
    ...goals.map((g) => ({ ...g, type: "Goal" })),
  ];
  const handleSearchSelect = (item: any) => {
    alert(`Navigate to ${item.type}: ${item.name}`);
    // TODO: Implement navigation
  };

  // AI Insights (mock)
  const aiInsights = [
    "Consider diversifying your portfolio with more international assets.",
    "Your Tech Stocks portfolio is overweight compared to your risk profile.",
    "You are on track to reach your Retirement Fund goal by 2045.",
  ];

  // Real-time widget (mock)
  const realTimePrices = [
    { name: "AAPL", price: 173.45, change: "+1.2%" },
    { name: "SPY", price: 415.78, change: "-0.5%" },
    { name: "BTC", price: 65000, change: "+2.1%" },
  ];

  // WebAuthn and Crypto Wallet Connect (scaffold/demo)
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };
  const handleWebAuthn = () => showToast("WebAuthn authentication (demo)");
  const handleWalletConnect = () => showToast("Crypto wallet connect (demo)");

  // For recent transactions, use transactions.slice(-5).reverse() or similar
  const recentTransactions = transactions.slice(-5).reverse();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
      {/* Analytics Chart with Search Bar */}
      <AnalyticsChart
        data={analyticsData}
        searchBar={
          <SmartSearchBar
            items={searchItems}
            onSelect={handleSearchSelect}
            placeholder={t("search") || "Search..."}
          />
        }
        title={t("portfolio_analytics") || "Portfolio Analytics"}
      />
      {/* AI Insights */}
      <section
        className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 mb-8 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800"
        aria-label={t("ai_insights") || "AI Insights"}
      >
        <h2 className="text-2xl font-extrabold mb-6 text-indigo-700 dark:text-indigo-300">
          {t("ai_insights") || "AI Insights"}
        </h2>
        <ul className="list-disc pl-8 space-y-4 text-lg">
          {aiInsights.map((insight, i) => (
            <li key={i}>{insight}</li>
          ))}
        </ul>
      </section>
      {/* Real-Time Prices */}
      <section
        className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 mb-8 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800"
        aria-label={t("real_time_prices") || "Real-Time Prices"}
      >
        <h2 className="text-2xl font-extrabold mb-6 text-indigo-700 dark:text-indigo-300">
          {t("real_time_prices") || "Real-Time Prices"}
        </h2>
        <div className="flex space-x-10 justify-center">
          {realTimePrices.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-6 py-4 mx-2 min-w-[100px]"
            >
              <span className="font-bold text-lg mb-1">{p.name}</span>
              <span className="text-xl font-mono mb-1">{p.price}</span>
              <span
                className={
                  p.change.startsWith("+")
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {p.change}
              </span>
            </div>
          ))}
        </div>
      </section>
      {/* WebAuthn & Crypto Wallet Connect */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleWebAuthn}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {t("webauthn_login") || "WebAuthn Login"}
        </button>
        <button
          onClick={handleWalletConnect}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          {t("connect_crypto_wallet") || "Connect Crypto Wallet"}
        </button>
      </div>
      <h1 className="text-2xl font-bold">{t("dashboard") || "Dashboard"}</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm font-medium">
            {t("total_portfolio_value") || "Total Portfolio Value"}
          </h2>
          <p className="text-2xl font-semibold mt-2">
            ${totalPortfolioValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm font-medium">
            {t("total_assets") || "Total Assets"}
          </h2>
          <p className="text-2xl font-semibold mt-2">{assets.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm font-medium">
            {t("active_portfolios") || "Active Portfolios"}
          </h2>
          <p className="text-2xl font-semibold mt-2">{portfolios.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm font-medium">
            {t("financial_goals") || "Financial Goals"}
          </h2>
          <p className="text-2xl font-semibold mt-2">{goals.length}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asset Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">
            {t("asset_distribution") || "Asset Distribution"}
          </h2>
          {assetDistributionData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {assetDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center h-64 flex items-center justify-center">
              {t("no_assets_found") ||
                "No assets found. Add some assets to see their distribution."}
            </p>
          )}
        </div>

        {/* Financial Goals Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">
            {t("financial_goals_progress") || "Financial Goals Progress"}
          </h2>
          {goalsProgressData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={goalsProgressData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar
                    dataKey="current"
                    name={t("current_amount") || "Current Amount"}
                    fill="#8884d8"
                  />
                  <Bar
                    dataKey="target"
                    name={t("target_amount") || "Target Amount"}
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center h-64 flex items-center justify-center">
              {t("no_financial_goals_found") ||
                "No financial goals found. Create some goals to track your progress."}
            </p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="divide-y">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium capitalize">
                    {transaction.transaction_type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`font-semibold ${
                    ["deposit", "dividend"].includes(
                      transaction.transaction_type
                    )
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {["deposit", "dividend"].includes(
                    transaction.transaction_type
                  )
                    ? "+"
                    : "-"}
                  ${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center p-6">
            No transactions found. Make some transactions to see them here.
          </p>
        )}
      </div>
    </div>
  );
}
