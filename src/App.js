import React, { useState, useEffect } from "react";
import { Clock, BarChart3 } from "lucide-react";
import Navigation from "./components/Navigation";
import TasksPage from "./components/TasksPage";
import CalendarView from "./components/CalendarView";
import AnalyticsPage from "./components/AnalyticsPage";
import SettingsPage from "./components/SettingsPage";
import ExportModal from "./components/ExportModal";
import HelpPage from "./components/HelpPage";

function App() {
  // Load initial state from localStorage or use defaults
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("productivityTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [activeTaskId, setActiveTaskId] = useState(() => {
    const savedActiveTask = localStorage.getItem("activeTaskId");
    return savedActiveTask ? JSON.parse(savedActiveTask) : null;
  });

  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem("currentTime");
    return savedTime ? JSON.parse(savedTime) : 0;
  });

  const [currentPage, setCurrentPage] = useState("tasks");
  const [showStats, setShowStats] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("appSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          theme: "default",
          soundEnabled: true,
          autoStart: false,
          dailyGoal: 240,
        };
  });

  // Persist data in localStorage
  useEffect(() => {
    localStorage.setItem("productivityTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("activeTaskId", JSON.stringify(activeTaskId));
  }, [activeTaskId]);

  useEffect(() => {
    localStorage.setItem("currentTime", JSON.stringify(time));
  }, [time]);

  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  // Timer
  useEffect(() => {
    let interval;
    if (activeTaskId !== null) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTaskId]);

  // Task functions
  const addTask = (taskData) => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        ...taskData,
        time: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const startTask = (id) => {
    if (activeTaskId !== null) {
      saveTime();
    }
    setActiveTaskId(id);
    setTime(tasks.find((t) => t.id === id)?.time || 0);
  };

  const pauseTask = () => {
    saveTime();
    setActiveTaskId(null);
  };

  const saveTime = () => {
    if (activeTaskId !== null) {
      setTasks(
        tasks.map((t) => (t.id === activeTaskId ? { ...t, time: time } : t))
      );
    }
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Productivity Tracker
              </h1>
            </div>
            {currentPage === "tasks" && (
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
              >
                <BarChart3 className="w-5 h-5" />
                {showStats ? "Hide Stats" : "Quick Stats"}
              </button>
            )}
          </div>

          {/* Navigation */}
          <Navigation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onExportClick={() => setShowExportModal(true)}
          />

          {/* Page Content */}
          {currentPage === "tasks" && (
            <TasksPage
              tasks={tasks}
              addTask={addTask}
              startTask={startTask}
              pauseTask={pauseTask}
              completeTask={completeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              activeTaskId={activeTaskId}
              time={time}
              showStats={showStats}
            />
          )}

          {currentPage === "calendar" && <CalendarView tasks={tasks} />}

          {currentPage === "analytics" && (
            <AnalyticsPage tasks={tasks} settings={settings} />
          )}

          {currentPage === "settings" && (
            <SettingsPage
              settings={settings}
              setSettings={setSettings}
              tasks={tasks}
              setTasks={setTasks}
              setActiveTaskId={setActiveTaskId}
              setTime={setTime}
            />
          )}

          {currentPage === "help" && <HelpPage />}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        tasks={tasks}
      />
    </div>
  );
}

export default App;
