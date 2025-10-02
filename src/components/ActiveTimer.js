import React from "react";
import { PauseCircle } from "lucide-react";
import { formatTime, getPriorityColor } from "../utils/helpers";

const ActiveTimer = ({ task, time, pauseTask }) => {
  if (!task) return null;

  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-green-700 font-medium mb-1">
            Currently Active
          </p>
          <p className="text-2xl font-bold text-gray-800 mb-2">{task.name}</p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-white rounded text-xs font-medium">
              {task.category}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold text-green-600 mb-3">
            {formatTime(time)}
          </p>
          <button
            onClick={pauseTask}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium"
          >
            <PauseCircle className="w-5 h-5" />
            Pause Timer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveTimer;
