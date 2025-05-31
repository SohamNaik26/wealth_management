"use client";
import React, { useState } from "react";
import Fuse from "fuse.js";

export const SmartSearchBar: React.FC<{
  items: any[];
  onSelect: (item: any) => void;
}> = ({ items, onSelect }) => {
  const [query, setQuery] = useState("");
  const fuse = new Fuse(items, { keys: ["name", "description"] });
  const results = query ? fuse.search(query).map((r) => r.item) : [];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full px-4 py-2 rounded shadow border border-gray-300 dark:bg-gray-800 dark:text-white"
      />
      {query && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow mt-1 max-h-60 overflow-y-auto">
          {results.length === 0 && (
            <div className="p-2 text-gray-500">No results</div>
          )}
          {results.map((item) => (
            <div
              key={item.id}
              className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
