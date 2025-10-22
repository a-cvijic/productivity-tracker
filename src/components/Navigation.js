import React from "react";
import {
  Home,
  TrendingUp,
  Settings,
  Calendar,
  Download,
  HelpCircle,
} from "lucide-react";

const Navigation = ({ currentPage, setCurrentPage, onExportClick }) => {
  const navItems = [
    { id: "tasks", icon: Home, label: "Tasks" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "analytics", icon: TrendingUp, label: "Analytics" },
    { id: "export", icon: Download, label: "Export" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <div className="flex gap-2 mb-8 bg-gray-100 p-2 rounded-xl flex-wrap">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "export") {
                onExportClick();
              } else {
                setCurrentPage(item.id);
              }
            }}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
              currentPage === item.id
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
