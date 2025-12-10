import React, { useState, useEffect } from "react";
import { Clock, BarChart3 } from "lucide-react";
import Navigation from "./components/Navigation";
import TasksPage from "./components/TasksPage";
import TasksPageB from "./components/TasksPageB";
import CalendarView from "./components/CalendarView";
import AnalyticsPage from "./components/AnalyticsPage";
import SettingsPage from "./components/SettingsPage";
import ExportModal from "./components/ExportModal";
import ExportModalB from "./components/ExportModalB";
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

  // A/B Test variant detection from URL
  // Use ?variant=b or ?v=b to access variant B
  const [isVariantB, setIsVariantB] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('variant') === 'b' || params.get('v') === 'b';
  });

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
              {/* A/B Test Indicator */}
              {isVariantB && (
                <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                  Variant B
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentPage === "tasks" && (
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                >
                  <BarChart3 className="w-5 h-5" />
                  {showStats ? "Hide Stats" : "Quick Stats"}
                </button>
              )}
              {/* A/B Toggle Button */}
              <button
                onClick={() => {
                  const newVariant = !isVariantB;
                  setIsVariantB(newVariant);
                  const url = new URL(window.location.href);
                  if (newVariant) {
                    url.searchParams.set('v', 'b');
                  } else {
                    url.searchParams.delete('v');
                    url.searchParams.delete('variant');
                  }
                  window.history.replaceState({}, '', url);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                  isVariantB
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isVariantB ? 'Version B' : 'Version A'}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <Navigation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onExportClick={() => setShowExportModal(true)}
          />

          {/* Page Content */}
          {currentPage === "tasks" && !isVariantB && (
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

          {currentPage === "tasks" && isVariantB && (
            <TasksPageB
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

      {/* Export Modal - A/B variants */}
      {!isVariantB && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          tasks={tasks}
        />
      )}
      {isVariantB && (
        <ExportModalB
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          tasks={tasks}
        />
      )}
    </div>
  );
}

export default App;
