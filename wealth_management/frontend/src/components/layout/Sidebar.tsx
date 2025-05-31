"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  HomeIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Portfolios", href: "/dashboard/portfolios", icon: BriefcaseIcon },
  { name: "Assets", href: "/dashboard/assets", icon: ChartBarIcon },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Financial Goals",
    href: "/dashboard/goals",
    icon: ArrowTrendingUpIcon,
  },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen p-4 fixed`}
    >
      <div className="flex justify-between items-center mb-10">
        {!isCollapsed && <h1 className="text-xl font-bold">Wealth Wizard</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-700"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                pathname.startsWith(item.href)
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            <item.icon
              className={`${
                isCollapsed ? "mx-auto" : "mr-3"
              } flex-shrink-0 h-6 w-6`}
              aria-hidden="true"
            />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 w-full px-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full"
        >
          <ArrowLeftOnRectangleIcon
            className={`${
              isCollapsed ? "mx-auto" : "mr-3"
            } flex-shrink-0 h-6 w-6`}
          />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}
