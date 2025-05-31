"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/services/api";
import { useSession } from "next-auth/react";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  // Set default sample user and form data
  const [user, setUser] = useState<UserProfile | null>({
    id: "1",
    email: session?.user?.email || "user@example.com",
    first_name: "John",
    last_name: "Doe",
  });
  const [formData, setFormData] = useState({
    first_name: "John",
    last_name: "Doe",
    email: session?.user?.email || "user@example.com",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");

    try {
      // In a real app, we would call the API to update the profile
      // await userApi.updateUser({
      //   first_name: formData.first_name,
      //   last_name: formData.last_name
      // });

      // For demo purposes, just show success message
      setSuccessMessage("Profile updated successfully!");

      // Update local user state
      if (user) {
        setUser({
          ...user,
          first_name: formData.first_name,
          last_name: formData.last_name,
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");

    // Validate passwords
    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      // In a real app, we would call the API to change the password
      // await userApi.changePassword({
      //   current_password: formData.current_password,
      //   new_password: formData.new_password
      // });

      // For demo purposes, just show success message
      setSuccessMessage("Password updated successfully!");

      // Clear password fields
      setFormData({
        ...formData,
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
        "Failed to change password. Please check your current password and try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Settings</h1>
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {error}
        </div>
      ) : null}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Account Settings
        </h1>

        <div className="space-y-8">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
              {successMessage}
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Profile Information
              </h2>
              <p className="text-sm text-gray-500">
                Update your account's profile information.
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-500">
                Ensure your account is using a strong password for security.
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="current_password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="new_password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minLength={8}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Preferences */}
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Account Preferences
              </h2>
              <p className="text-sm text-gray-500">
                Manage your notification and display preferences.
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-xs text-gray-500">
                      Receive email updates about your account activity.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Portfolio Updates
                    </h3>
                    <p className="text-xs text-gray-500">
                      Receive notifications about significant changes in your
                      portfolio.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Financial Goal Alerts
                    </h3>
                    <p className="text-xs text-gray-500">
                      Receive notifications when you reach milestones towards
                      your financial goals.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
