// Sync Manager Utility for Todo App
// Handles offline/online synchronization and conflict resolution

class SyncManager {
  constructor() {
    this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
    this.pendingOperations = [];
    this.syncInProgress = false;
    this.eventListeners = new Map();

    // Listen for online/offline events
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline.bind(this));
      window.addEventListener("offline", this.handleOffline.bind(this));
    }
  }

  // Event system for sync status updates
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach((callback) => callback(data));
    }
  }

  handleOnline() {
    this.isOnline = true;
    this.emit("online", { isOnline: true });
    this.processPendingOperations();
  }

  handleOffline() {
    this.isOnline = false;
    this.emit("offline", { isOnline: false });
  }

  // Queue operation for later sync when offline
  queueOperation(operation) {
    const timestamp = Date.now();
    const queuedOperation = {
      ...operation,
      timestamp,
      id: `${operation.type}_${operation.todoId || "new"}_${timestamp}`,
    };

    this.pendingOperations.push(queuedOperation);
    this.emit("operationQueued", queuedOperation);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.processPendingOperations();
    }

    return queuedOperation.id;
  }

  // Process all pending operations
  async processPendingOperations() {
    if (
      this.syncInProgress ||
      !this.isOnline ||
      this.pendingOperations.length === 0
    ) {
      return;
    }

    this.syncInProgress = true;
    this.emit("syncStart", { operationCount: this.pendingOperations.length });

    try {
      const operations = [...this.pendingOperations];
      this.pendingOperations = [];

      for (const operation of operations) {
        try {
          await this.processOperation(operation);
          this.emit("operationSynced", operation);
        } catch (error) {
          console.error("Failed to sync operation:", operation, error);
          // Re-queue failed operations
          this.pendingOperations.push(operation);
          this.emit("operationFailed", { operation, error });
        }
      }

      this.emit("syncComplete", {
        successCount: operations.length - this.pendingOperations.length,
        failedCount: this.pendingOperations.length,
      });
    } finally {
      this.syncInProgress = false;
    }
  }

  // Process individual operation
  async processOperation(operation) {
    const { type, todoId, data } = operation;

    switch (type) {
      case "create":
        return await this.syncCreate(data);
      case "update":
        return await this.syncUpdate(todoId, data);
      case "delete":
        return await this.syncDelete(todoId);
      case "reorder":
        return await this.syncReorder(data.todoIds);
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  // Sync individual operations
  async syncCreate(todoData) {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.statusText}`);
    }

    return await response.json();
  }

  async syncUpdate(todoId, updates) {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.statusText}`);
    }

    return await response.json();
  }

  async syncDelete(todoId) {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.statusText}`);
    }

    return await response.json();
  }

  async syncReorder(todoIds) {
    const response = await fetch("/api/todos/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reorder todos: ${response.statusText}`);
    }

    return await response.json();
  }

  // Conflict resolution strategies
  resolveConflict(localData, serverData, strategy = "server_wins") {
    switch (strategy) {
      case "server_wins":
        return serverData;
      case "client_wins":
        return localData;
      case "last_modified_wins":
        const localTime = new Date(localData.lastModified || 0);
        const serverTime = new Date(serverData.lastModified || 0);
        return localTime > serverTime ? localData : serverData;
      case "merge":
        return this.mergeData(localData, serverData);
      default:
        return serverData;
    }
  }

  // Intelligent data merging
  mergeData(localData, serverData) {
    const merged = { ...serverData };

    // Prefer local changes for user-input fields if they're newer
    const localTime = new Date(localData.lastModified || 0);
    const serverTime = new Date(serverData.lastModified || 0);

    if (localTime > serverTime) {
      // Keep local changes for content fields
      if (localData.title !== undefined) merged.title = localData.title;
      if (localData.content !== undefined) merged.content = localData.content;
      if (localData.priority !== undefined)
        merged.priority = localData.priority;
      if (localData.category !== undefined)
        merged.category = localData.category;
      if (localData.dueDate !== undefined) merged.dueDate = localData.dueDate;
      if (localData.tags !== undefined) merged.tags = localData.tags;
    }

    return merged;
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      pendingOperations: this.pendingOperations.length,
      syncInProgress: this.syncInProgress,
      operations: this.pendingOperations.map((op) => ({
        id: op.id,
        type: op.type,
        timestamp: op.timestamp,
      })),
    };
  }

  // Clear all pending operations (use with caution)
  clearPendingOperations() {
    this.pendingOperations = [];
    this.emit("operationsCleared");
  }

  // Manual sync trigger
  async forcSync() {
    if (this.isOnline) {
      await this.processPendingOperations();
    } else {
      throw new Error("Cannot sync while offline");
    }
  }
}

// Create singleton instance
const syncManager = new SyncManager();

export default syncManager;

// Export utility functions for easier usage
export const queueTodoOperation = (type, todoId, data) => {
  return syncManager.queueOperation({ type, todoId, data });
};

export const getSyncStatus = () => syncManager.getSyncStatus();

export const onSyncEvent = (event, callback) => syncManager.on(event, callback);

export const forcSync = () => syncManager.forcSync();
