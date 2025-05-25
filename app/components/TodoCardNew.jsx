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
    e.stopPropagation(); // Prevent drag from starting

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
    e.stopPropagation();
    if (onEdit) {
      onEdit({
        _id: id,
        title: name,
        content,
        priority,
        category,
        color,
        dueDate,
        completed: isCompleted,
      });
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (onDelete) {
      await onDelete(id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-300";
      case "medium":
        return "text-yellow-300";
      case "low":
        return "text-green-300";
      default:
        return "text-white/70";
    }
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        ${color} text-white shadow-lg rounded-xl p-5 border border-white/20 
        transition-all duration-300 hover:shadow-xl hover:scale-105 
        cursor-grab active:cursor-grabbing group
        ${isCompleted ? "opacity-75" : ""}
        ${isDragging ? "z-50 rotate-3" : ""}
      `}
      suppressHydrationWarning
    >
      {/* Header with completion toggle */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <button
            onClick={toggleComplete}
            disabled={isUpdating}
            className="flex-shrink-0 hover:scale-110 transition-transform"
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
        <p className="text-white/90 text-sm mb-3 leading-relaxed">{content}</p>
      )}

      {/* Metadata */}
      <div className="space-y-2">
        {/* Category */}
        <div className="flex items-center text-white/80 text-xs">
          <FiTag className="w-3 h-3 mr-1" />
          <span className="capitalize">{category}</span>
        </div>

        {/* Due date */}
        {dueDate && (
          <div
            className={`flex items-center text-xs ${
              isOverdue ? "text-red-300" : "text-white/80"
            }`}
          >
            <FiCalendar className="w-3 h-3 mr-1" />
            <span>
              {isOverdue ? "Overdue: " : "Due: "}
              {new Date(dueDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
        <div className="text-xs text-white/60">
          {modifiedDate
            ? `Updated ${new Date(modifiedDate).toLocaleDateString()}`
            : ""}
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Edit todo"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-white/20 hover:bg-red-500/50 rounded-lg transition-colors"
            title="Delete todo"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default TodoCard;
