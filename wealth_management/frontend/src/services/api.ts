import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = "http://localhost:8000";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

// API methods for portfolios
export const portfolioApi = {
  getAllPortfolios: async () => {
    const response = await api.get("/portfolios/");
    return response.data;
  },

  getPortfolio: async (id: number) => {
    const response = await api.get(`/portfolios/${id}`);
    return response.data;
  },

  createPortfolio: async (data: { name: string; description?: string }) => {
    const response = await api.post("/portfolios/", data);
    return response.data;
  },

  updatePortfolio: async (
    id: number,
    data: { name: string; description?: string }
  ) => {
    const response = await api.put(`/portfolios/${id}`, data);
    return response.data;
  },

  deletePortfolio: async (id: number) => {
    const response = await api.delete(`/portfolios/${id}`);
    return response.data;
  },
};

// API methods for assets
export const assetApi = {
  getAllAssets: async (portfolioId?: number) => {
    const url = portfolioId
      ? `/assets/?portfolio_id=${portfolioId}`
      : "/assets/";
    const response = await api.get(url);
    return response.data;
  },

  getAsset: async (id: number) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  createAsset: async (data: {
    name: string;
    asset_type: string;
    ticker_symbol?: string;
    quantity: number;
    purchase_price: number;
    current_price: number;
    purchase_date: string;
    portfolio_id: number;
  }) => {
    const response = await api.post("/assets/", data);
    return response.data;
  },

  updateAsset: async (id: number, data: any) => {
    const response = await api.put(`/assets/${id}`, data);
    return response.data;
  },

  deleteAsset: async (id: number) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  },
};

// API methods for financial goals
export const goalApi = {
  getAllGoals: async () => {
    const response = await api.get("/goals/");
    return response.data;
  },

  getGoal: async (id: number) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  createGoal: async (data: {
    name: string;
    description?: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    priority: string;
  }) => {
    const response = await api.post("/goals/", data);
    return response.data;
  },

  updateGoal: async (id: number, data: any) => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },

  updateGoalProgress: async (id: number, current_amount: number) => {
    const response = await api.patch(
      `/goals/${id}/progress?current_amount=${current_amount}`
    );
    return response.data;
  },

  deleteGoal: async (id: number) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};

// API methods for transactions
export const transactionApi = {
  getAllTransactions: async (params?: {
    asset_id?: number;
    transaction_type?: string;
  }) => {
    let url = "/transactions/";
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.asset_id)
        queryParams.append("asset_id", params.asset_id.toString());
      if (params.transaction_type)
        queryParams.append("transaction_type", params.transaction_type);
      if (queryParams.toString()) url += `?${queryParams.toString()}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getTransaction: async (id: number) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: {
    transaction_type: string;
    amount: number;
    asset_id?: number;
    notes?: string;
  }) => {
    const response = await api.post("/transactions/", data);
    return response.data;
  },

  deleteTransaction: async (id: number) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

// API methods for user
export const userApi = {
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateUser: async (data: { first_name?: string; last_name?: string }) => {
    const response = await api.put("/users/me", data);
    return response.data;
  },

  registerUser: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    const response = await api.post("/users/", data);
    return response.data;
  },
};
