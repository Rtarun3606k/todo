"use client";
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FiCheckCircle,
  FiCircle,
  FiEdit3,
  FiTrash2,
  FiCalendar,
  FiFlag,
  FiTag,
} from "react-icons/fi";

const TodoCard = ({
  id,
  name,
  content,
  modifiedDate,
  color,
  sortId,
  completed = false,
  priority = "medium",
  category = "general",
  dueDate = null,
  onUpdate,
  onDelete,
  onEdit,
  onRefresh,
}) => {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const toggleComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;

    setIsUpdating(true);
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    const success = await onUpdate(id, { completed: newCompleted });
    if (!success) {
      // Revert on error
      setIsCompleted(!newCompleted);
    }
    setIsUpdating(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;

    if (onEdit) {
      onEdit({
        _id: id,
        title: name,
        content: content,
        priority: priority,
        category: category,
        color: color,
        dueDate: dueDate,
        completed: isCompleted,
      });
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUpdating) return;

    setIsUpdating(true);
    const success = await onDelete(id);
    if (!success) {
      setIsUpdating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        ${color} text-white shadow-lg rounded-xl p-5 border border-white/20 
        transition-all duration-300 hover:shadow-xl hover:scale-105 
        group relative
        ${isCompleted ? "opacity-75" : ""}
        ${isDragging ? "z-50 rotate-3" : ""}
      `}
      suppressHydrationWarning
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-white/20 rounded"
        title="Drag to reorder"
      >
        <svg
          className="w-4 h-4 text-white/70"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
        </svg>
      </div>
      {/* Header with completion toggle */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <button
            onClick={toggleComplete}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
            disabled={isUpdating}
            className="flex-shrink-0 hover:scale-110 transition-transform relative z-10"
          >
            {isCompleted ? (
              <FiCheckCircle className="w-5 h-5 text-green-300" />
            ) : (
              <FiCircle className="w-5 h-5 text-white/70 hover:text-white" />
            )}
          </button>

          <h2
            className={`text-lg font-semibold leading-tight ${
              isCompleted ? "line-through text-white/70" : ""
            }`}
          >
            {name}
          </h2>
        </div>

        {/* Priority indicator */}
        <div
          className={`flex items-center space-x-1 ${getPriorityColor(
            priority
          )}`}
        >
          <FiFlag className="w-4 h-4" />
          <span className="text-xs font-medium uppercase">{priority}</span>
        </div>
      </div>

      {/* Content */}
      {content && (
        <p
          className={`text-white/90 mb-3 text-sm leading-relaxed ${
            isCompleted ? "line-through text-white/60" : ""
          }`}
        >
          {content}
        </p>
      )}

      {/* Metadata */}
      <div className="space-y-2 text-xs text-white/80">
        {/* Category */}
        {category && category !== "general" && (
          <div className="flex items-center space-x-1">
            <FiTag className="w-3 h-3" />
            <span className="capitalize">{category}</span>
          </div>
        )}

        {/* Due date */}
        {dueDate && (
          <div
            className={`flex items-center space-x-1 ${
              isOverdue ? "text-red-300" : ""
            }`}
          >
            <FiCalendar className="w-3 h-3" />
            <span>Due: {formatDate(dueDate)}</span>
            {isOverdue && <span className="font-semibold">(Overdue)</span>}
          </div>
        )}

        {/* Modified date */}
        <div className="flex items-center space-x-1">
          <span>Modified: {formatDate(modifiedDate)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
            #{sortId}
          </span>
          {isCompleted && (
            <span className="text-xs font-medium bg-green-500/30 px-2 py-1 rounded-full">
              ✓ Complete
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
            disabled={isUpdating}
            className="p-1 hover:bg-white/20 rounded transition-colors disabled:opacity-50 relative z-10"
            title="Edit todo"
          >
            <FiEdit3 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
            onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
            disabled={isUpdating}
            className="p-1 hover:bg-red-500/30 rounded transition-colors disabled:opacity-50 relative z-10"
            title="Delete todo"
          >
            <FiTrash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default TodoCard;
