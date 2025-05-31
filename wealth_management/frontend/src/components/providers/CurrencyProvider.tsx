"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const currencyOptions = [{ code: "INR", symbol: "₹", name: "Indian Rupee" }];

interface CurrencyContextProps {
  currency: string;
  setCurrency: (currency: string) => void;
  currencies: string[];
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(
  undefined
);

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    const stored = localStorage.getItem("currency");
    if (stored && currencyOptions.some((c) => c.code === stored))
      setCurrency(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const currencies = currencyOptions.map((c) => c.code);
  const format = (amount: number) => {
    const symbol =
      currencyOptions.find((c) => c.code === currency)?.symbol || "₹";
    return (
      symbol + amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })
    );
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, currencies, format }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
