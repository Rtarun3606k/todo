"use client";

import { useState, useEffect } from "react";
import {
  FiX,
  FiSave,
  FiCalendar,
  FiFlag,
  FiTag,
  FiFileText,
} from "react-icons/fi";

const TodoModal = ({
  isOpen,
  onClose,
  onSave,
  todo = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    category: "general",
    color: "bg-blue-500",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});

  const colors = [
    { value: "bg-blue-500", label: "Blue", preview: "bg-blue-500" },
    { value: "bg-green-500", label: "Green", preview: "bg-green-500" },
    { value: "bg-red-500", label: "Red", preview: "bg-red-500" },
    { value: "bg-purple-500", label: "Purple", preview: "bg-purple-500" },
    { value: "bg-yellow-500", label: "Yellow", preview: "bg-yellow-500" },
    { value: "bg-pink-500", label: "Pink", preview: "bg-pink-500" },
    { value: "bg-indigo-500", label: "Indigo", preview: "bg-indigo-500" },
    { value: "bg-orange-500", label: "Orange", preview: "bg-orange-500" },
    { value: "bg-teal-500", label: "Teal", preview: "bg-teal-500" },
    { value: "bg-gray-500", label: "Gray", preview: "bg-gray-500" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600", icon: "🟢" },
    { value: "medium", label: "Medium", color: "text-yellow-600", icon: "🟡" },
    { value: "high", label: "High", color: "text-red-600", icon: "🔴" },
  ];

  const categories = [
    "general",
    "work",
    "personal",
    "health",
    "finance",
    "learning",
    "shopping",
    "travel",
    "family",
    "other",
  ];

  // Initialize form data when todo prop changes
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || todo.name || "",
        content: todo.content || "",
        priority: todo.priority || "medium",
        category: todo.category || "general",
        color: todo.color || "bg-blue-500",
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        priority: "medium",
        category: "general",
        color: "bg-blue-500",
        dueDate: "",
      });
    }
    setErrors({});
  }, [todo, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const todoData = {
      ...formData,
      dueDate: formData.dueDate || null,
    };

    await onSave(todoData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {todo ? "Edit Todo" : "Create New Todo"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiFileText className="mr-2" />
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter todo title..."
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiFileText className="mr-2" />
                Description
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add a description (optional)..."
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiFlag className="mr-2" />
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={loading}
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.icon} {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiTag className="mr-2" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiCalendar className="mr-2" />
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.dueDate ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Color Theme
              </label>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleInputChange("color", color.value)}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      formData.color === color.value
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    disabled={loading}
                  >
                    <div
                      className={`w-full h-8 rounded ${color.preview}`}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">
                      {color.label}
                    </span>
                    {formData.color === color.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Preview
              </label>
              <div className={`${formData.color} p-4 rounded-lg shadow-md`}>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {formData.title || "Todo Title"}
                </h3>
                <p className="text-white/90 text-sm mb-3">
                  {formData.content || "Todo description will appear here..."}
                </p>
                <div className="flex items-center justify-between text-white/80 text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <FiFlag className="mr-1" />
                      {formData.priority}
                    </span>
                    <span className="flex items-center">
                      <FiTag className="mr-1" />
                      {formData.category}
                    </span>
                  </div>
                  {formData.dueDate && (
                    <span className="flex items-center">
                      <FiCalendar className="mr-1" />
                      {new Date(formData.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {todo ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {todo ? "Update Todo" : "Create Todo"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
