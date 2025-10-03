import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { formatTime, getPriorityColor } from "../utils/helpers";

const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter((task) => {
      if (task.dueDate === dateStr) return true;
      const taskDate = new Date(task.createdAt).toISOString().split("T")[0];
      return taskDate === dateStr;
    });
  };

  const getTimeSpentOnDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const dateTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt).toISOString().split("T")[0];
      return taskDate === dateStr;
    });
    return dateTasks.reduce((acc, task) => acc + task.time, 0);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-white rounded-lg transition"
        >
          <ChevronLeft className="w-6 h-6 text-indigo-600" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          <p className="text-sm text-gray-600">Click on a date to view tasks</p>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-white rounded-lg transition"
        >
          <ChevronRight className="w-6 h-6 text-indigo-600" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 text-sm py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Actual days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(year, month, day);
              const dayTasks = getTasksForDate(date);
              const timeSpent = getTimeSpentOnDate(date);
              const hasDueTasks = dayTasks.some(
                (t) => t.dueDate === date.toISOString().split("T")[0]
              );
              const hasOverdueTasks = dayTasks.some(
                (t) =>
                  t.dueDate === date.toISOString().split("T")[0] &&
                  new Date(t.dueDate) < new Date() &&
                  !t.completed
              );

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square p-2 rounded-lg border-2 transition hover:shadow-md relative ${
                    isToday(day)
                      ? "border-indigo-500 bg-indigo-50"
                      : selectedDate &&
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === month
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-800">
                    {day}
                  </div>

                  {/* Task indicators */}
                  {dayTasks.length > 0 && (
                    <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-1">
                      {hasOverdueTasks && (
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      )}
                      {hasDueTasks && !hasOverdueTasks && (
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      )}
                      {dayTasks.length > 0 && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  )}

                  {/* Time spent indicator */}
                  {timeSpent > 0 && (
                    <div className="absolute top-1 right-1">
                      <div className="text-xs bg-green-100 text-green-700 px-1 rounded">
                        {Math.round(timeSpent / 60)}m
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Legend:</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Overdue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span>Due Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Has Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  15m
                </div>
                <span>Time Spent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-800">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a Date"}
            </h3>
          </div>

          {selectedDate ? (
            <div className="space-y-4">
              {/* Stats for selected date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Tasks</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {selectedDateTasks.length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round(getTimeSpentOnDate(selectedDate) / 60)}m
                  </p>
                </div>
              </div>

              {/* Task list for selected date */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedDateTasks.length > 0 ? (
                  selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p
                          className={`font-semibold text-sm ${
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {task.name}
                        </p>
                        {task.completed && (
                          <span className="text-green-600 text-xs">✓</span>
                        )}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                          {task.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        {task.time > 0 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(task.time)}
                          </span>
                        )}
                      </div>
                      {task.dueDate ===
                        selectedDate.toISOString().split("T")[0] && (
                        <div className="mt-2 text-xs text-orange-600 font-medium">
                          📅 Due on this date
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks for this date</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Click on a calendar date to view tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
