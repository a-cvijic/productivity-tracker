import React, { useState } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Trophy,
  Target,
  Clock,
  Award,
} from "lucide-react";
import {
  formatTime,
  getPriorityColor,
  categories,
  priorities,
} from "../utils/helpers";

const AnalyticsPage = ({ tasks, settings }) => {
  const [dateRange, setDateRange] = useState("all"); // all, week, month, custom
  const [leaderboardView, setLeaderboardView] = useState("time"); // time, fastest, overdue

  // Filter tasks by date range
  const getFilteredTasks = () => {
    const now = new Date();
    if (dateRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return tasks.filter((t) => new Date(t.createdAt) >= weekAgo);
    }
    if (dateRange === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return tasks.filter((t) => new Date(t.createdAt) >= monthAgo);
    }
    return tasks;
  };

  const filteredTasks = getFilteredTasks();
  const totalTime = filteredTasks.reduce((acc, t) => acc + t.time, 0);
  const completedTasks = filteredTasks.filter((t) => t.completed).length;
  const activeTime = filteredTasks
    .filter((t) => !t.completed)
    .reduce((acc, t) => acc + t.time, 0);
  const overdueTasks = filteredTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
  ).length;

  const categoryStats = categories
    .map((cat) => ({
      name: cat,
      count: filteredTasks.filter((t) => t.category === cat).length,
      time: filteredTasks
        .filter((t) => t.category === cat)
        .reduce((acc, t) => acc + t.time, 0),
      completed: filteredTasks.filter((t) => t.category === cat && t.completed)
        .length,
    }))
    .filter((s) => s.count > 0);

  // Calculate daily goal progress
  const dailyGoalProgress = Math.min(
    Math.round((totalTime / 60 / settings.dailyGoal) * 100),
    100
  );

  // Leaderboard data
  const getLeaderboardData = () => {
    if (leaderboardView === "time") {
      return [...filteredTasks].sort((a, b) => b.time - a.time).slice(0, 5);
    }
    if (leaderboardView === "fastest") {
      return [...filteredTasks]
        .filter((t) => t.completed && t.estimate > 0 && t.time <= t.estimate)
        .sort((a, b) => a.time / a.estimate - b.time / b.estimate)
        .slice(0, 5);
    }
    if (leaderboardView === "overdue") {
      return [...filteredTasks]
        .filter((t) => t.estimate > 0 && t.time > t.estimate)
        .sort((a, b) => b.time - b.estimate - (a.time - a.estimate))
        .slice(0, 5);
    }
    return [];
  };

  const leaderboardData = getLeaderboardData();

  // Productivity score (0-100)
  const productivityScore =
    filteredTasks.length > 0
      ? Math.round(
          (completedTasks / filteredTasks.length) * 40 + // 40% completion rate
            dailyGoalProgress * 0.3 + // 30% goal achievement
            (filteredTasks.filter(
              (t) => t.estimate > 0 && t.time <= t.estimate && t.completed
            ).length /
              Math.max(filteredTasks.filter((t) => t.estimate > 0).length, 1)) *
              30 // 30% on-time completion
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-800">Date Range:</span>
        </div>
        <div className="flex gap-2">
          {["all", "week", "month"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                dateRange === range
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {range === "all"
                ? "All Time"
                : range === "week"
                ? "Last 7 Days"
                : "Last 30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Productivity Score Card */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Productivity Score
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Based on completion rate, goal achievement, and efficiency
            </p>
            <div className="flex items-end gap-4">
              <div className="text-6xl font-bold text-purple-600">
                {productivityScore}
              </div>
              <div className="text-2xl text-gray-500 mb-2">/100</div>
            </div>
          </div>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${
                  2 * Math.PI * 56 * (1 - productivityScore / 100)
                }`}
                className="text-purple-600 transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">
                {productivityScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Overall Performance */}
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
                {filteredTasks.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <span className="text-gray-700 font-medium">Completion Rate</span>
              <span className="text-2xl font-bold text-green-600">
                {filteredTasks.length > 0
                  ? Math.round((completedTasks / filteredTasks.length) * 100)
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
                {filteredTasks.length > 0
                  ? formatTime(Math.round(totalTime / filteredTasks.length))
                  : "00:00:00"}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Daily Goal Progress
            </h2>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 70 * (1 - dailyGoalProgress / 100)
                  }`}
                  className={`transition-all duration-1000 ${
                    dailyGoalProgress >= 100
                      ? "text-green-600"
                      : dailyGoalProgress >= 75
                      ? "text-blue-600"
                      : dailyGoalProgress >= 50
                      ? "text-yellow-600"
                      : "text-orange-600"
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">
                  {dailyGoalProgress}%
                </span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Time Logged Today</span>
              <span className="font-bold text-green-600">
                {Math.round(totalTime / 60)} min
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Daily Goal</span>
              <span className="font-bold text-gray-800">
                {settings.dailyGoal} min
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className="font-bold text-orange-600">
                {Math.max(0, settings.dailyGoal - Math.round(totalTime / 60))}{" "}
                min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown with Visual Bars */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <PieChart className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Category Breakdown
          </h2>
        </div>
        <div className="space-y-3">
          {categoryStats.length > 0 ? (
            categoryStats.map((stat, index) => {
              const percentage =
                filteredTasks.length > 0
                  ? (stat.count / filteredTasks.length) * 100
                  : 0;
              const colors = [
                "from-purple-500 to-pink-500",
                "from-blue-500 to-cyan-500",
                "from-green-500 to-emerald-500",
                "from-orange-500 to-red-500",
                "from-indigo-500 to-purple-500",
              ];
              return (
                <div
                  key={stat.name}
                  className="p-4 bg-white rounded-lg hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">
                        {stat.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {stat.count} tasks
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      {(stat.time / 3600).toFixed(1)}h
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        colors[index % colors.length]
                      } rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {stat.completed} completed (
                    {stat.count > 0
                      ? Math.round((stat.completed / stat.count) * 100)
                      : 0}
                    %)
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No category data yet. Create some tasks to see analytics!</p>
            </div>
          )}
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
            const count = filteredTasks.filter(
              (t) => t.priority === priority
            ).length;
            const timeSpent = filteredTasks
              .filter((t) => t.priority === priority)
              .reduce((acc, t) => acc + t.time, 0);
            const completed = filteredTasks.filter(
              (t) => t.priority === priority && t.completed
            ).length;
            return (
              <div
                key={priority}
                className="p-4 bg-white rounded-lg text-center hover:shadow-lg transition"
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
                <div className="mt-2 text-xs text-green-600 font-medium">
                  {count > 0 ? Math.round((completed / count) * 100) : 0}% done
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Leaderboard */}
      <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Task Leaderboard
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLeaderboardView("time")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                leaderboardView === "time"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              Most Time
            </button>
            <button
              onClick={() => setLeaderboardView("fastest")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                leaderboardView === "fastest"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-green-100"
              }`}
            >
              Fastest
            </button>
            <button
              onClick={() => setLeaderboardView("overdue")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                leaderboardView === "overdue"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-red-100"
              }`}
            >
              Over Time
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {leaderboardData.length > 0 ? (
            leaderboardData.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-md transition"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? "bg-yellow-400 text-yellow-900"
                      : index === 1
                      ? "bg-gray-300 text-gray-700"
                      : index === 2
                      ? "bg-orange-400 text-orange-900"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{task.name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                      {task.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">
                    {formatTime(task.time)}
                  </p>
                  {leaderboardView === "fastest" && task.estimate > 0 && (
                    <p className="text-xs text-green-600">
                      {Math.round((task.time / task.estimate) * 100)}% of
                      estimate
                    </p>
                  )}
                  {leaderboardView === "overdue" && task.estimate > 0 && (
                    <p className="text-xs text-red-600">
                      +{formatTime(task.time - task.estimate)} over
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tasks available for this leaderboard view.</p>
            </div>
          )}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Productivity Insights
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg hover:shadow-md transition">
            <p className="text-sm text-gray-600 mb-2">Tasks Over Estimate</p>
            <p className="text-3xl font-bold text-red-600">
              {
                filteredTasks.filter(
                  (t) => t.estimate > 0 && t.time > t.estimate
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">Need better planning</p>
          </div>
          <div className="p-4 bg-white rounded-lg hover:shadow-md transition">
            <p className="text-sm text-gray-600 mb-2">Tasks Under Estimate</p>
            <p className="text-3xl font-bold text-green-600">
              {
                filteredTasks.filter(
                  (t) => t.estimate > 0 && t.time <= t.estimate && t.completed
                ).length
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">Great time management!</p>
          </div>
          <div className="p-4 bg-white rounded-lg hover:shadow-md transition">
            <p className="text-sm text-gray-600 mb-2">Overdue Tasks</p>
            <p className="text-3xl font-bold text-orange-600">{overdueTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Action needed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
