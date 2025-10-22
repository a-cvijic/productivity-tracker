// src/components/HelpPage.js
import React from "react";
import { HelpCircle } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Help & Documentation
          </h1>
        </div>
        <p className="text-gray-600">
          Find answers to common questions and learn how to use the app.
        </p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Getting Started
        </h2>
        <p className="text-gray-700 mb-4">
          Welcome to Productivity Tracker! This application helps you track time
          spent on tasks and analyze your productivity patterns.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">
          Quick Guide
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Create a new task using the "Add New Task" button</li>
          <li>Click "Start" to begin tracking time</li>
          <li>View your statistics in the Analytics page</li>
          <li>Export your data for backup or analysis</li>
        </ol>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">
          Need More Help?
        </h3>
        <p className="text-gray-700">
          For detailed tutorials, visit our{" "}
          <a href="/tutorials" className="text-blue-600 hover:underline">
            tutorials page
          </a>{" "}
          or{" "}
          <a href="/support/contact" className="text-blue-600 hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
