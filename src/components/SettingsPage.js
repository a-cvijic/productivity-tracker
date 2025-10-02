import React from "react";
import { Settings } from "lucide-react";

const SettingsPage = ({
  settings,
  setSettings,
  tasks,
  setTasks,
  setActiveTaskId,
  setTime,
}) => {
  const handleClearCompleted = () => {
    if (window.confirm("Are you sure you want to clear all completed tasks?")) {
      setTasks(tasks.filter((t) => !t.completed));
    }
  };

  const handleResetTimers = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all task timers? This cannot be undone."
      )
    ) {
      setTasks(tasks.map((t) => ({ ...t, time: 0 })));
      setActiveTaskId(null);
      setTime(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Application Settings
          </h2>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["default", "dark", "minimal"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({ ...settings, theme })}
                  className={`p-4 rounded-lg border-2 transition capitalize font-medium ${
                    settings.theme === theme
                      ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Notifications Toggle */}
          <div className="pt-6 border-t border-gray-200">
            <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition cursor-pointer">
              <div>
                <p className="font-semibold text-gray-800">
                  Auto-start Next Task
                </p>
                <p className="text-sm text-gray-500">
                  Automatically start timer for next task
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.autoStart}
                  onChange={(e) =>
                    setSettings({ ...settings, autoStart: e.target.checked })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-14 h-8 rounded-full transition ${
                    settings.autoStart ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                      settings.autoStart
                        ? "translate-x-7 mt-1 ml-1"
                        : "translate-x-1 mt-1"
                    }`}
                  />
                </div>
              </div>
            </label>
          </div>

          {/* Daily Goal Slider */}
          <div className="pt-6 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Daily Productivity Goal (minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="30"
                max="480"
                step="30"
                value={settings.dailyGoal}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dailyGoal: parseInt(e.target.value),
                  })
                }
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center min-w-24">
                <p className="text-3xl font-bold text-indigo-600">
                  {settings.dailyGoal}
                </p>
                <p className="text-xs text-gray-500">minutes</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>30 min</span>
              <span>8 hours</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleClearCompleted}
                className="p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-100 transition font-medium"
              >
                Clear Completed Tasks
              </button>
              <button
                onClick={handleResetTimers}
                className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
              >
                Reset All Timers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">About</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Version:</strong> 2.0.0
          </p>
          <p>
            <strong>Build:</strong> Advanced Productivity Tracker
          </p>
          <p className="pt-3 border-t border-gray-200">
            This application helps you track time spent on tasks, analyze
            productivity patterns, and improve time management through detailed
            analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
