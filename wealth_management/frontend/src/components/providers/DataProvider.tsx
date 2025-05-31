"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Portfolio {
  id: string;
  name: string;
  description: string;
  totalValue: number;
  createdAt: string;
}
export interface Asset {
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
export interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  date: string;
  asset_id?: string;
  asset_name?: string;
  notes?: string;
}
export interface Goal {
  id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: "Low" | "Medium" | "High";
}

interface DataContextType {
  portfolios: Portfolio[];
  setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[]>>;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  return (
    <DataContext.Provider
      value={{
        portfolios,
        setPortfolios,
        assets,
        setAssets,
        transactions,
        setTransactions,
        goals,
        setGoals,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
