import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  FileJson,
  FileText,
  File,
  CheckCircle,
} from "lucide-react";
import { formatTime } from "../utils/helpers";

const ExportModal = ({ isOpen, onClose, tasks }) => {
  const [exportFormat, setExportFormat] = useState("json");
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [includeTime, setIncludeTime] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [step, setStep] = useState(1); // Multi-step process

  // Browsee: Track when export modal is opened
  useEffect(() => {
    if (isOpen) {
      window._browsee?.('logEvent', 'open_export_modal', { variant: 'A' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTasks = includeCompleted
    ? tasks
    : tasks.filter((t) => !t.completed);

  const exportToJSON = () => {
    const data = filteredTasks.map((task) => ({
      name: task.name,
      category: task.category,
      priority: task.priority,
      ...(includeTime && {
        timeSpent: formatTime(task.time),
        estimate: formatTime(task.estimate),
      }),
      ...(includeNotes && { notes: task.notes }),
      completed: task.completed,
      dueDate: task.dueDate,
      tags: task.tags,
      createdAt: task.createdAt,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `productivity-tracker-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToTXT = () => {
    let text = "=== PRODUCTIVITY TRACKER EXPORT ===\n\n";
    text += `Export Date: ${new Date().toLocaleString()}\n`;
    text += `Total Tasks: ${filteredTasks.length}\n`;
    text += `Completed: ${filteredTasks.filter((t) => t.completed).length}\n\n`;
    text += "=".repeat(50) + "\n\n";

    filteredTasks.forEach((task, index) => {
      text += `${index + 1}. ${task.name}\n`;
      text += `   Category: ${task.category}\n`;
      text += `   Priority: ${task.priority}\n`;
      text += `   Status: ${task.completed ? "Completed ✓" : "In Progress"}\n`;
      if (includeTime) {
        text += `   Time Spent: ${formatTime(task.time)}\n`;
        if (task.estimate > 0) {
          text += `   Estimate: ${formatTime(task.estimate)}\n`;
        }
      }
      if (task.dueDate) {
        text += `   Due Date: ${new Date(task.dueDate).toLocaleDateString()}\n`;
      }
      if (task.tags && task.tags.length > 0) {
        text += `   Tags: ${task.tags.join(", ")}\n`;
      }
      if (includeNotes && task.notes) {
        text += `   Notes: ${task.notes}\n`;
      }
      text += "\n";
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `productivity-tracker-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Create a simple HTML document that can be printed as PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Productivity Tracker Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #4f46e5; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
          .task { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .task-title { font-size: 18px; font-weight: bold; color: #1f2937; }
          .task-meta { color: #6b7280; font-size: 14px; margin: 5px 0; }
          .completed { background-color: #d1fae5; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
          .priority-high { background-color: #fee2e2; color: #991b1b; }
          .priority-medium { background-color: #fef3c7; color: #92400e; }
          .priority-low { background-color: #dbeafe; color: #1e40af; }
        </style>
      </head>
      <body>
        <h1>📊 Productivity Tracker Export</h1>
        <p><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Tasks:</strong> ${
          filteredTasks.length
        } | <strong>Completed:</strong> ${
      filteredTasks.filter((t) => t.completed).length
    }</p>
        <hr>
        ${filteredTasks
          .map(
            (task, index) => `
          <div class="task ${task.completed ? "completed" : ""}">
            <div class="task-title">${index + 1}. ${task.name}</div>
            <div class="task-meta">
              <span class="badge">${task.category}</span>
              <span class="badge priority-${task.priority.toLowerCase()}">${
              task.priority
            }</span>
              ${
                task.completed
                  ? '<span class="badge" style="background-color: #10b981; color: white;">✓ Completed</span>'
                  : ""
              }
            </div>
            ${
              includeTime
                ? `<div class="task-meta">⏱️ Time: ${formatTime(task.time)}${
                    task.estimate > 0
                      ? ` / Est: ${formatTime(task.estimate)}`
                      : ""
                  }</div>`
                : ""
            }
            ${
              task.dueDate
                ? `<div class="task-meta">📅 Due: ${new Date(
                    task.dueDate
                  ).toLocaleDateString()}</div>`
                : ""
            }
            ${
              task.tags && task.tags.length > 0
                ? `<div class="task-meta">🏷️ ${task.tags
                    .map((t) => "#" + t)
                    .join(" ")}</div>`
                : ""
            }
            ${
              includeNotes && task.notes
                ? `<div class="task-meta" style="margin-top: 10px;"><strong>Notes:</strong> ${task.notes}</div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleExport = () => {
    if (exportFormat === "json") exportToJSON();
    if (exportFormat === "txt") exportToTXT();
    if (exportFormat === "pdf") exportToPDF();

    // Browsee: Track successful export
    window._browsee?.('logEvent', 'complete_export', { variant: 'A', format: exportFormat });

    setStep(3); // Show success step
    setTimeout(() => {
      onClose();
      setStep(1); // Reset for next time
    }, 2000);
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Download className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-800">Export Tasks</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 ${
                step >= 2 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 2
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <div
              className={`w-16 h-1 ${
                step >= 3 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 3
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              ✓
            </div>
          </div>
        </div>

        {/* Step 1: Choose Format */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4">
              Step 1: Choose Export Format
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setExportFormat("json")}
                className={`p-6 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                  exportFormat === "json"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <FileJson className="w-12 h-12 text-indigo-600" />
                <span className="font-semibold">JSON</span>
                <span className="text-xs text-gray-500 text-center">
                  Structured data format
                </span>
              </button>

              <button
                onClick={() => setExportFormat("txt")}
                className={`p-6 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                  exportFormat === "txt"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <FileText className="w-12 h-12 text-green-600" />
                <span className="font-semibold">TXT</span>
                <span className="text-xs text-gray-500 text-center">
                  Plain text file
                </span>
              </button>

              <button
                onClick={() => setExportFormat("pdf")}
                className={`p-6 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                  exportFormat === "pdf"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <File className="w-12 h-12 text-red-600" />
                <span className="font-semibold">PDF</span>
                <span className="text-xs text-gray-500 text-center">
                  Print-ready document
                </span>
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Configure Options */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4">
              Step 2: Configure Export Options
            </h4>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-800">
                    Include Completed Tasks
                  </p>
                  <p className="text-sm text-gray-500">
                    Export both active and completed tasks
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeCompleted}
                  onChange={(e) => setIncludeCompleted(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-800">Include Time Data</p>
                  <p className="text-sm text-gray-500">
                    Export time spent and estimates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeTime}
                  onChange={(e) => setIncludeTime(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-800">Include Notes</p>
                  <p className="text-sm text-gray-500">
                    Export task notes and descriptions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
              </label>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-6">
              <p className="text-sm text-blue-800">
                <strong>Preview:</strong> {filteredTasks.length} tasks will be
                exported
              </p>
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              Export Successful!
            </h4>
            <p className="text-gray-600">Your file has been downloaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;
