"use client";
import React from "react";
import { useSyncStatus, useOfflineQueue } from "@/hooks/useSync";
import {
  FiWifi,
  FiWifiOff,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiX,
} from "react-icons/fi";

const SyncStatusIndicator = ({ className = "", showDetails = false }) => {
  const { isOnline, syncInProgress, pendingOperations, lastSyncTime } =
    useSyncStatus();
  const { operations, forceSync, clearQueue } = useOfflineQueue();

  const getStatusIcon = () => {
    if (!isOnline) return <FiWifiOff className="w-4 h-4 text-red-500" />;
    if (syncInProgress)
      return <FiRefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    if (pendingOperations > 0)
      return <FiClock className="w-4 h-4 text-yellow-500" />;
    return <FiCheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (syncInProgress) return "Syncing...";
    if (pendingOperations > 0) return `${pendingOperations} pending`;
    return "Synced";
  };

  const getStatusColor = () => {
    if (!isOnline) return "bg-red-100 text-red-800 border-red-200";
    if (syncInProgress) return "bg-blue-100 text-blue-800 border-blue-200";
    if (pendingOperations > 0)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const handleForceSync = async () => {
    if (isOnline && pendingOperations > 0) {
      try {
        await forceSync();
      } catch (error) {
        console.error("Force sync failed:", error);
      }
    }
  };

  if (!showDetails) {
    return (
      <div
        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm ${getStatusColor()} ${className}`}
      >
        {getStatusIcon()}
        <span className="font-medium">{getStatusText()}</span>
        {lastSyncTime && isOnline && pendingOperations === 0 && (
          <span className="text-xs opacity-75">
            {lastSyncTime.toLocaleTimeString()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-semibold">{getStatusText()}</span>
        </div>

        <div className="flex items-center space-x-2">
          {isOnline && pendingOperations > 0 && (
            <button
              onClick={handleForceSync}
              disabled={syncInProgress}
              className="text-xs px-2 py-1 bg-white/50 rounded hover:bg-white/70 transition-colors disabled:opacity-50"
              title="Force sync now"
            >
              <FiRefreshCw
                className={`w-3 h-3 ${syncInProgress ? "animate-spin" : ""}`}
              />
            </button>
          )}

          {pendingOperations > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs px-2 py-1 bg-red-500/20 text-red-700 rounded hover:bg-red-500/30 transition-colors"
              title="Clear pending operations"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center space-x-2 text-sm mb-2">
        {isOnline ? (
          <>
            <FiWifi className="w-3 h-3 text-green-600" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <FiWifiOff className="w-3 h-3 text-red-600" />
            <span>Offline - Changes will sync when connection is restored</span>
          </>
        )}
      </div>

      {/* Last Sync Time */}
      {lastSyncTime && (
        <div className="text-xs opacity-75 mb-2">
          Last synced: {lastSyncTime.toLocaleString()}
        </div>
      )}

      {/* Pending Operations */}
      {operations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-current/20">
          <div className="text-sm font-medium mb-2">Pending Operations:</div>
          <div className="space-y-1">
            {operations.slice(0, 5).map((op) => (
              <div
                key={op.id}
                className="text-xs flex items-center justify-between"
              >
                <span className="capitalize">{op.type}</span>
                <span className="opacity-75">
                  {new Date(op.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {operations.length > 5 && (
              <div className="text-xs opacity-75">
                +{operations.length - 5} more operations
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      {!isOnline && (
        <div className="mt-3 pt-3 border-t border-current/20">
          <div className="text-xs opacity-75">
            <FiAlertCircle className="w-3 h-3 inline mr-1" />
            You can continue working offline. Your changes will be saved and
            synced when you're back online.
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;
