"use client";
import { useState, useEffect, useCallback } from "react";
import syncManager, { onSyncEvent, getSyncStatus } from "@/utils/syncManager";

export const useSyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Update sync status when events occur
    const updateStatus = () => setSyncStatus(getSyncStatus());

    onSyncEvent("online", updateStatus);
    onSyncEvent("offline", updateStatus);
    onSyncEvent("operationQueued", updateStatus);
    onSyncEvent("syncStart", updateStatus);
    onSyncEvent("syncComplete", (data) => {
      updateStatus();
      setLastSyncTime(new Date());
    });
    onSyncEvent("operationSynced", updateStatus);
    onSyncEvent("operationFailed", updateStatus);

    // Initial status update
    updateStatus();
  }, []);

  return {
    ...syncStatus,
    lastSyncTime,
  };
};

export const useTodoSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Generic todo operation with sync handling
  const performOperation = useCallback(
    async (operation, fallbackData = null) => {
      setSyncing(true);
      setError(null);

      try {
        // If online, try direct API call
        if (navigator.onLine) {
          const response = await operation();
          if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
          }
          return await response.json();
        } else {
          // If offline, queue operation and return fallback
          if (fallbackData) {
            // Queue for later sync
            syncManager.queueOperation(fallbackData);
            return { success: true, offline: true, data: fallbackData };
          } else {
            throw new Error("Cannot perform operation while offline");
          }
        }
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setSyncing(false);
      }
    },
    []
  );

  // Specific operations
  const createTodo = useCallback(
    async (todoData) => {
      return performOperation(
        () =>
          fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todoData),
          }),
        {
          type: "create",
          data: todoData,
        }
      );
    },
    [performOperation]
  );

  const updateTodo = useCallback(
    async (todoId, updates) => {
      return performOperation(
        () =>
          fetch(`/api/todos/${todoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          }),
        {
          type: "update",
          todoId,
          data: updates,
        }
      );
    },
    [performOperation]
  );

  const deleteTodo = useCallback(
    async (todoId) => {
      return performOperation(
        () =>
          fetch(`/api/todos/${todoId}`, {
            method: "DELETE",
          }),
        {
          type: "delete",
          todoId,
        }
      );
    },
    [performOperation]
  );

  const reorderTodos = useCallback(
    async (todoIds) => {
      return performOperation(
        () =>
          fetch("/api/todos/reorder", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todoIds }),
          }),
        {
          type: "reorder",
          data: { todoIds },
        }
      );
    },
    [performOperation]
  );

  return {
    syncing,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    clearError: () => setError(null),
  };
};

export const useOfflineQueue = () => {
  const [queueStatus, setQueueStatus] = useState(getSyncStatus());

  useEffect(() => {
    const updateQueueStatus = () => setQueueStatus(getSyncStatus());

    onSyncEvent("operationQueued", updateQueueStatus);
    onSyncEvent("operationSynced", updateQueueStatus);
    onSyncEvent("operationFailed", updateQueueStatus);
    onSyncEvent("operationsCleared", updateQueueStatus);

    updateQueueStatus();
  }, []);

  const clearQueue = useCallback(() => {
    syncManager.clearPendingOperations();
  }, []);

  const forceSync = useCallback(async () => {
    try {
      await syncManager.forcSync();
    } catch (error) {
      console.error("Force sync failed:", error);
      throw error;
    }
  }, []);

  return {
    pendingOperations: queueStatus.pendingOperations,
    operations: queueStatus.operations,
    clearQueue,
    forceSync,
  };
};
