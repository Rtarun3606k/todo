"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import TodoCard from "@/app/components/TodoCard";
import ClientOnly from "@/app/components/ClientOnly";
import SyncStatusIndicator from "@/app/components/SyncStatusIndicator";
import TodoModal from "@/app/components/TodoModal";
import TodoDashboard from "@/app/components/TodoDashboard";
import { useSyncStatus, useTodoSync } from "@/hooks/useSync";

export default function TodoApp() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragInfo, setDragInfo] = useState(null);
  const [error, setError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Use sync hooks
  const syncStatus = useSyncStatus();
  const { syncing, updateTodo, deleteTodo, reorderTodos, clearError } =
    useTodoSync();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay before drag starts
        tolerance: 5, // 5px tolerance for movement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch todos from database
  useEffect(() => {
    if (session?.user) {
      fetchTodos();
      // Also create/sync user in database after authentication
      syncUserToDatabase();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  const syncUserToDatabase = async () => {
    try {
      const response = await fetch("/api/auth/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("User synced to database");
      }
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos || []);
        setLastSyncTime(new Date());
      } else {
        setError("Failed to fetch todos");
        console.error("Failed to fetch todos");
      }
    } catch (error) {
      setError("Error connecting to server");
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncTodoOrder = async (reorderedTodos) => {
    try {
      const todoIds = reorderedTodos.map((todo) => todo._id);
      await reorderTodos(todoIds);
      console.log("Todo order synced successfully");
      setError(null);
      return true;
    } catch (error) {
      console.error("Error syncing todo order:", error);
      setError("Error syncing changes");
      return false;
    }
  };

  // Enhanced todo update function with sync
  const handleUpdateTodo = async (todoId, updates) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === todoId
          ? { ...todo, ...updates, lastModified: new Date().toISOString() }
          : todo
      )
    );

    try {
      await updateTodo(todoId, updates);
      setError(null);
      return true;
    } catch (error) {
      console.error("Error updating todo:", error);
      await fetchTodos(); // Refresh to get correct state
      setError("Error updating todo");
      return false;
    }
  };

  // Enhanced delete function with sync
  const handleDeleteTodo = async (todoId) => {
    if (!confirm("Are you sure you want to delete this todo?")) {
      return false;
    }

    // Optimistic update - remove from UI
    const originalTodos = [...todos];
    setTodos((prev) => prev.filter((todo) => todo._id !== todoId));

    try {
      await deleteTodo(todoId);
      setError(null);
      return true;
    } catch (error) {
      console.error("Error deleting todo:", error);
      setTodos(originalTodos); // Revert
      setError("Error deleting todo");
      return false;
    }
  };

  // New CRUD functions for the modal
  const handleOpenAddModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    setModalLoading(false);
  };

  const handleSaveTodo = async (todoData) => {
    setModalLoading(true);

    try {
      if (editingTodo) {
        // Update existing todo
        const success = await handleUpdateTodo(editingTodo._id, todoData);
        if (success) {
          handleCloseModal();
          await fetchTodos(); // Refresh to get latest data
        }
      } else {
        // Create new todo
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todoData),
        });

        if (response.ok) {
          handleCloseModal();
          await fetchTodos(); // Refresh to get latest data
          setError(null);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to create todo");
        }
      }
    } catch (error) {
      console.error("Error saving todo:", error);
      setError("Error saving todo");
    } finally {
      setModalLoading(false);
    }
  };

  function handleDragStart(event) {
    const { active } = event;
    const draggedTodo = todos.find((todo) => todo._id === active.id);
    setDragInfo({
      id: active.id,
      name: draggedTodo?.title || draggedTodo?.name,
      startTime: Date.now(),
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setDragInfo(null);
      return;
    }

    setTodos((items) => {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return items;
      }

      const reorderedTodos = arrayMove(items, oldIndex, newIndex);

      // Sync with database
      syncTodoOrder(reorderedTodos);

      console.log("Reordering:", {
        from: oldIndex,
        to: newIndex,
        item: items[oldIndex]?.title || items[oldIndex]?.name,
      });

      return reorderedTodos;
    });

    setDragInfo(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to TodoApp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Organize your tasks, boost your productivity, and achieve your goals
            with our modern todo application.
          </p>
          <a
            href="/auth"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In to Get Started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Dashboard */}
        <TodoDashboard
          todos={todos}
          onRefresh={fetchTodos}
          onAddTodo={handleOpenAddModal}
          loading={loading}
          error={error}
        />

        {/* Enhanced sync status indicators */}
        <div className="mb-6 flex items-center justify-center">
          <SyncStatusIndicator
            showDetails={syncStatus.pendingOperations > 0 || error}
          />
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No todos yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first todo to get started organizing your tasks!
              </p>
              <button
                onClick={handleOpenAddModal}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Create First Todo
              </button>
            </div>
          </div>
        ) : (
          <ClientOnly
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className={`${todo.color} p-4 rounded-lg shadow-md`}
                  >
                    <h2 className="text-xl font-semibold mb-2 text-white">
                      {todo.title || todo.name}
                    </h2>
                    <p className="text-white/90 mb-3">{todo.content}</p>
                  </div>
                ))}
              </div>
            }
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={todos.map((todo) => todo._id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {todos.map((todo) => (
                    <TodoCard
                      key={todo._id}
                      id={todo._id}
                      name={todo.title || todo.name}
                      content={todo.content}
                      modifiedDate={todo.lastModified || todo.modifiedDate}
                      color={todo.color}
                      sortId={todo.sortId}
                      completed={todo.completed}
                      priority={todo.priority}
                      category={todo.category}
                      dueDate={todo.dueDate}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={handleOpenEditModal}
                      onRefresh={fetchTodos}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {dragInfo && (
              <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-none">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
                  <span>Dragging: {dragInfo.name}</span>
                </div>
              </div>
            )}
          </ClientOnly>
        )}

        {/* Quick Actions */}
        {todos.length > 0 && (
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
            <button
              onClick={fetchTodos}
              disabled={loading || syncing}
              className="bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Refresh todos"
            >
              <svg
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <a
              href="/add-todo"
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              title="Add new todo"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Todo Modal */}
        <TodoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTodo}
          todo={editingTodo}
          loading={modalLoading}
        />
      </div>
    </div>
  );
}
