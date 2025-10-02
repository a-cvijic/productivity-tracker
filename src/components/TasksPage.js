import React, { useState } from "react";
import { Clock } from "lucide-react";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import ActiveTimer from "./ActiveTimer";
import TaskCard from "./TaskCard";
import { formatTime, categories } from "../utils/helpers";

const TasksPage = ({
  tasks,
  addTask,
  startTask,
  pauseTask,
  completeTask,
  deleteTask,
  updateTask,
  activeTaskId,
  time,
  showStats,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("Work");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newEstimate, setNewEstimate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({
        name: newTask,
        category: newCategory,
        priority: newPriority,
        estimate: newEstimate ? parseInt(newEstimate) * 60 : 0,
      });
      setNewTask("");
      setNewEstimate("");
      setShowAddForm(false);
    }
  };

  const filteredTasks = tasks
    .filter((t) => filterCategory === "All" || t.category === filterCategory)
    .filter((t) => filterPriority === "All" || t.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === "date")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "priority") {
        const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "time") return b.time - a.time;
      return 0;
    });

  const totalTime = tasks.reduce((acc, t) => acc + t.time, 0);
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTime = tasks
    .filter((t) => !t.completed)
    .reduce((acc, t) => acc + t.time, 0);

  return (
    <>
      {/* Quick Stats */}
      {showStats && (
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-indigo-600">
                {tasks.length}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {completedTasks}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm font-medium">Active Time</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatTime(activeTime)}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm font-medium">Total Time</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatTime(totalTime)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Task Form */}
      <TaskForm
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newTask={newTask}
        setNewTask={setNewTask}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newPriority={newPriority}
        setNewPriority={setNewPriority}
        newEstimate={newEstimate}
        setNewEstimate={setNewEstimate}
        addTask={handleAddTask}
      />

      {/* Filter Bar */}
      <FilterBar
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Active Timer */}
      <ActiveTimer
        task={tasks.find((t) => t.id === activeTaskId)}
        time={time}
        pauseTask={pauseTask}
      />

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              No tasks match your filters. Try adjusting them or add a new task!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              activeTaskId={activeTaskId}
              startTask={startTask}
              pauseTask={pauseTask}
              completeTask={completeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))
        )}
      </div>
    </>
  );
};

export default TasksPage;
