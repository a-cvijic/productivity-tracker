import React from "react";
import { BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";
import {
  formatTime,
  getPriorityColor,
  categories,
  priorities,
} from "../utils/helpers";

const AnalyticsPage = ({ tasks, settings }) => {
  const totalTime = tasks.reduce((acc, t) => acc + t.time, 0);
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTime = tasks
    .filter((t) => !t.completed)
    .reduce((acc, t) => acc + t.time, 0);

  const categoryStats = categories
    .map((cat) => ({
      name: cat,
      count: tasks.filter((t) => t.category === cat).length,
      time: tasks
        .filter((t) => t.category === cat)
        .reduce((acc, t) => acc + t.time, 0),
      completed: tasks.filter((t) => t.category === cat && t.completed).length,
    }))
    .filter((s) => s.count > 0);

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Overall Performance
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <span className="text-gray-700 font-medium">
                Total Tasks Created
              </span>
              <span className="text-2xl font-bold text-indigo-600">
                {tasks.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <span className="text-gray-700 font-medium">Completion Rate</span>
              <span className="text-2xl font-bold text-green-600">
                {tasks.length > 0
                  ? Math.round((completedTasks / tasks.length) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <span className="text-gray-700 font-medium">
                Total Hours Logged
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {(totalTime / 3600).toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <span className="text-gray-700 font-medium">
                Avg. Time per Task
              </span>
              <span className="text-2xl font-bold text-orange-600">
                {tasks.length > 0
                  ? formatTime(Math.round(totalTime / tasks.length))
                  : "00:00:00"}
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Category Breakdown
            </h2>
          </div>
          <div className="space-y-3">
            {categoryStats.length > 0 ? (
              categoryStats.map((stat) => (
                <div key={stat.name} className="p-4 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">
                      {stat.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {stat.count} tasks
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex-1 mr-4">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{
                            width: `${
                              tasks.length > 0
                                ? (stat.count / tasks.length) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      {(stat.time / 3600).toFixed(1)}h
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {stat.completed} completed (
                    {stat.count > 0
                      ? Math.round((stat.completed / stat.count) * 100)
                      : 0}
                    %)
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No category data yet. Create some tasks to see analytics!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Priority Distribution
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {priorities.map((priority) => {
            const count = tasks.filter((t) => t.priority === priority).length;
            const timeSpent = tasks
              .filter((t) => t.priority === priority)
              .reduce((acc, t) => acc + t.time, 0);
            return (
              <div
                key={priority}
                className="p-4 bg-white rounded-lg text-center"
              >
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getPriorityColor(
                    priority
                  )}`}
                >
                  {priority}
                </div>
                <p className="text-3xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(timeSpent / 3600).toFixed(1)} hours
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Productivity Insights
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Tasks Over Estimate</p>
            <p className="text-3xl font-bold text-red-600">
              {
                tasks.filter((t) => t.estimate > 0 && t.time > t.estimate)
                  .length
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">Need better planning</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Tasks Under Estimate</p>
            <p className="text-3xl font-bold text-green-600">
              {
                tasks.filter(
                  (t) => t.estimate > 0 && t.time <= t.estimate && t.completed
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">Great time management!</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Daily Goal Progress</p>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round((totalTime / 60 / settings.dailyGoal) * 100)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(totalTime / 60)} / {settings.dailyGoal} min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
