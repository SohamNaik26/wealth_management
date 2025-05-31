import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">
                Wealth Wizard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-indigo-600"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate px-6 lg:px-8 py-12 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Wealth Management Wizard
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Take control of your financial future with our comprehensive wealth
            management platform. Track your investments, manage your portfolios,
            and set financial goals all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/signin"
              className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-gray-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Manage Better
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your wealth
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides you with all the tools you need to track,
              analyze, and grow your wealth.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative bg-white p-6 rounded-xl shadow-card">
                <dt className="text-base font-semibold leading-7 text-indigo-600">
                  Portfolio Management
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Create and manage multiple portfolios to organize your
                  investments by goal or strategy.
                </dd>
              </div>
              <div className="relative bg-white p-6 rounded-xl shadow-card">
                <dt className="text-base font-semibold leading-7 text-indigo-600">
                  Asset Tracking
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Track the performance of all your assets in one place with
                  real-time updates and visualization.
                </dd>
              </div>
              <div className="relative bg-white p-6 rounded-xl shadow-card">
                <dt className="text-base font-semibold leading-7 text-indigo-600">
                  Financial Goal Setting
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Set and track progress towards your financial goals, whether
                  it's retirement, a home purchase, or education.
                </dd>
              </div>
              <div className="relative bg-white p-6 rounded-xl shadow-card">
                <dt className="text-base font-semibold leading-7 text-indigo-600">
                  Transaction History
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Keep a detailed record of all your financial transactions for
                  better tracking and financial planning.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2024 Wealth Management Wizard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
