import React from "react";
import { Home, TrendingUp, Settings, Calendar, Download } from "lucide-react";

const Navigation = ({ currentPage, setCurrentPage, onExportClick }) => {
  return (
    <div className="flex gap-2 mb-8 bg-gray-100 p-2 rounded-xl">
      <button
        onClick={() => setCurrentPage("tasks")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
          currentPage === "tasks"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Home className="w-5 h-5" />
        Tasks
      </button>
      <button
        onClick={() => setCurrentPage("calendar")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
          currentPage === "calendar"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Calendar className="w-5 h-5" />
        Calendar
      </button>
      <button
        onClick={() => setCurrentPage("analytics")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
          currentPage === "analytics"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <TrendingUp className="w-5 h-5" />
        Analytics
      </button>
      <button
        onClick={() => setCurrentPage("settings")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
          currentPage === "settings"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Settings className="w-5 h-5" />
        Settings
      </button>
      <button
        onClick={onExportClick}
        className="px-4 py-3 rounded-lg transition font-medium bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        Export
      </button>
    </div>
  );
};

export default Navigation;
