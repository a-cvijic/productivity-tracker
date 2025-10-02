export const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

export const getPriorityColor = (priority) => {
  const colors = {
    Low: "bg-blue-100 text-blue-700 border-blue-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    High: "bg-orange-100 text-orange-700 border-orange-300",
    Urgent: "bg-red-100 text-red-700 border-red-300",
  };
  return colors[priority] || colors["Medium"];
};

export const categories = ["Work", "Personal", "Study", "Health", "Other"];
export const priorities = ["Low", "Medium", "High", "Urgent"];
