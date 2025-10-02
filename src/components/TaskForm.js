import React from "react";
import { Plus, X } from "lucide-react";
import { categories, priorities } from "../utils/helpers";

const TaskForm = ({
  showAddForm,
  setShowAddForm,
  newTask,
  setNewTask,
  newCategory,
  setNewCategory,
  newPriority,
  setNewPriority,
  newEstimate,
  setNewEstimate,
  addTask,
}) => {
  if (!showAddForm) {
    return (
      <button
        onClick={() => setShowAddForm(true)}
        className="w-full mb-6 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium text-lg"
      >
        <Plus className="w-6 h-6" />
        Add New Task
      </button>
    );
  }

  return (
    <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-indigo-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Create New Task</h3>
        <button
          onClick={() => setShowAddForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Name *
          </label>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task name..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {pri}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Est. Time (min)
            </label>
            <input
              type="number"
              value={newEstimate}
              onChange={(e) => setNewEstimate(e.target.value)}
              placeholder="30"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
