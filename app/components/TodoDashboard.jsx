"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiList,
  FiGrid,
} from "react-icons/fi";

const TodoDashboard = ({ todos, onRefresh, onAddTodo, loading, error }) => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("position");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Filter and search todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && todo.completed) ||
      (filterStatus === "pending" && !todo.completed) ||
      (filterStatus === "overdue" &&
        todo.dueDate &&
        new Date(todo.dueDate) < new Date() &&
        !todo.completed);

    const matchesPriority =
      filterPriority === "all" || todo.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || todo.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sort todos
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case "position":
        return (a.position || 0) - (b.position || 0);
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "created":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "updated":
        return (
          new Date(b.lastModified || b.updatedAt) -
          new Date(a.lastModified || a.updatedAt)
        );
      default:
        return 0;
    }
  });

  // Get unique categories
  const categories = [...new Set(todos.map((todo) => todo.category))];

  // Statistics
  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    pending: todos.filter((todo) => !todo.completed).length,
    overdue: todos.filter(
      (todo) =>
        todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
    ).length,
    high: todos.filter((todo) => todo.priority === "high").length,
    medium: todos.filter((todo) => todo.priority === "medium").length,
    low: todos.filter((todo) => todo.priority === "low").length,
  };

  return (
    <div className="mb-8">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Todo Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {session?.user?.name}! Here's your productivity
              overview.
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              onClick={onAddTodo}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Todo
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Completed
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.pending}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Pending
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.overdue}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Overdue
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.high}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              High Priority
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.medium}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              Medium Priority
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.low}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Low Priority
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="position">Position</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedTodos.length} of {todos.length} todos
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      </div>

      {/* Export filtered todos data for parent component */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dashboardData = ${JSON.stringify({
            filteredTodos: sortedTodos,
            viewMode,
            stats,
          })}`,
        }}
      />
    </div>
  );
};

export default TodoDashboard;
