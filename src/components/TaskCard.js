// src/components/TaskCard.js
import React, { useState } from "react";
import {
  Check,
  Edit2,
  Save,
  X,
  Trash2,
  PlayCircle,
  PauseCircle,
  Tag,
  AlertCircle,
} from "lucide-react";
import {
  formatTime,
  getPriorityColor,
  categories,
  priorities,
} from "../utils/helpers";

const TaskCard = ({
  task,
  activeTaskId,
  startTask,
  pauseTask,
  completeTask,
  deleteTask,
  updateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: task.name,
    category: task.category,
    priority: task.priority,
    estimate: task.estimate / 60,
  });

  const handleSave = () => {
    updateTask(task.id, {
      name: editData.name,
      category: editData.category,
      priority: editData.priority,
      estimate: editData.estimate * 60,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: task.name,
      category: task.category,
      priority: task.priority,
      estimate: task.estimate / 60,
    });
    setIsEditing(false);
  };

  const isActive = activeTaskId === task.id;

  return (
    <div
      className={`p-5 rounded-xl border-2 transition ${
        task.completed
          ? "bg-gray-50 border-gray-200 opacity-60"
          : isActive
          ? "bg-green-50 border-green-300 shadow-md"
          : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm"
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-3 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <div className="grid grid-cols-3 gap-3">
            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData({ ...editData, priority: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {pri}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={editData.estimate}
              onChange={(e) =>
                setEditData({ ...editData, estimate: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Est. min"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => completeTask(task.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                task.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 hover:border-green-500"
              }`}
            >
              {task.completed && <Check className="w-4 h-4 text-white" />}
            </button>
            <div className="flex-1">
              <p
                className={`font-semibold text-lg ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {task.name}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {task.category}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {formatTime(task.time)}
                </span>
                {task.estimate > 0 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Est: {formatTime(task.estimate)}
                    {task.time > task.estimate && !task.completed && (
                      <span className="text-red-600 font-medium ml-1">
                        (Over!)
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!task.completed && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => (isActive ? pauseTask() : startTask(task.id))}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 font-medium ${
                    isActive
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isActive ? (
                    <>
                      <PauseCircle className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Start
                    </>
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
