import { Plus, X, Calendar, FileText, Tag as TagIcon, Clock } from "lucide-react";
import { categories, priorities } from "../utils/helpers";

/**
 * TaskFormB - A/B Test Variant
 *
 * Changes from original (TaskForm.js):
 * 1. LARGER DATE PICKER ICON with highlighted button - users were missing the date picker
 *    and typing dates manually (analysis showed +1-3s delay)
 * 2. QUICK TAG BUTTONS - pre-defined tag suggestions to reduce typing time
 * 3. DATE QUICK SELECT - Today/Tomorrow/Next Week buttons for faster date selection
 *
 * These changes address findings from KLM analysis showing 31% slower than optimal
 * due to manual date entry and slow tag input.
 */

const suggestedTags = ["Urgent", "Important", "Meeting", "Client", "Personal", "Review"];

const TaskFormB = ({
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
  newDueDate,
  setNewDueDate,
  newNotes,
  setNewNotes,
  newTags,
  setNewTags,
  addTask,
}) => {

  // Quick date selection helpers
  const setQuickDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    setNewDueDate(date.toISOString().split('T')[0]);
  };

  // Quick tag toggle
  const toggleTag = (tag) => {
    const currentTags = newTags ? newTags.split(',').map(t => t.trim()).filter(t => t) : [];
    if (currentTags.includes(tag)) {
      setNewTags(currentTags.filter(t => t !== tag).join(', '));
    } else {
      setNewTags([...currentTags, tag].join(', '));
    }
  };

  const isTagSelected = (tag) => {
    const currentTags = newTags ? newTags.split(',').map(t => t.trim()) : [];
    return currentTags.includes(tag);
  };

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
        {/* Task Name */}
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

        {/* Category, Priority, Estimate */}
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
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
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

        {/* Due Date - IMPROVED: Larger icon, quick select buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <div className="flex gap-3">
            {/* Large calendar button */}
            <button
              type="button"
              onClick={() => document.getElementById('dueDateInputB').showPicker?.() || document.getElementById('dueDateInputB').focus()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition border-2 border-indigo-300 font-medium"
            >
              <Calendar className="w-6 h-6" />
              Pick Date
            </button>
            <input
              id="dueDateInputB"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          {/* Quick date buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(7)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Next Week
            </button>
          </div>
        </div>

        {/* Tags - IMPROVED: Quick tag buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            Tags
          </label>
          {/* Quick tag buttons */}
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  isTagSelected(tag)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Or type custom tags (comma separated)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Notes
          </label>
          <textarea
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="Add any additional notes or details..."
            rows="3"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition resize-none"
          />
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

export default TaskFormB;
