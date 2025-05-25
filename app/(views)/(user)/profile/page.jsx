"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiShield,
  FiEdit3,
  FiSave,
  FiX,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiBell,
  FiMoon,
  FiSun,
  FiMonitor,
  FiCamera,
  FiAward,
  FiTarget,
  FiZap,
  FiActivity,
  FiHeart,
  FiStar,
  FiRefreshCw,
  FiGift,
} from "react-icons/fi";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [userSynced, setUserSynced] = useState(false);
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    theme: "system",
    notifications: true,
    emailDigest: false,
    defaultPriority: "medium",
    defaultColor: "bg-blue-500",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);

  // Sync user data when they sign in
  useEffect(() => {
    const syncUserData = async () => {
      if (session?.user && !userSynced) {
        try {
          const response = await fetch("/api/auth/callback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("User data synced:", data);
            setUserSynced(true);
          } else {
            console.error("Failed to sync user data");
          }
        } catch (error) {
          console.error("Error syncing user data:", error);
        }
      }
    };
    syncUserData();
  }, [session, userSynced]);

  // Fetch user todos and calculate statistics
  useEffect(() => {
    if (session?.user) {
      fetchUserData();
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        const userTodos = data.todos || [];
        setTodos(userTodos);

        // Calculate statistics
        const totalTodos = userTodos.length;
        const completedTodos = userTodos.filter(
          (todo) => todo.completed
        ).length;
        const pendingTodos = totalTodos - completedTodos;
        const overdueTodos = userTodos.filter(
          (todo) =>
            todo.dueDate &&
            new Date(todo.dueDate) < new Date() &&
            !todo.completed
        ).length;

        const priorityStats = {
          high: userTodos.filter((todo) => todo.priority === "high").length,
          medium: userTodos.filter((todo) => todo.priority === "medium").length,
          low: userTodos.filter((todo) => todo.priority === "low").length,
        };

        const categoryStats = userTodos.reduce((acc, todo) => {
          acc[todo.category] = (acc[todo.category] || 0) + 1;
          return acc;
        }, {});

        setStats({
          total: totalTodos,
          completed: completedTodos,
          pending: pendingTodos,
          overdue: overdueTodos,
          completionRate:
            totalTodos > 0
              ? Math.round((completedTodos / totalTodos) * 100)
              : 0,
          priority: priorityStats,
          categories: categoryStats,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      // Here you would typically save to your user API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditingProfile(false);
      // Show success message
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const dataToExport = {
        profile: {
          name: session.user.name,
          email: session.user.email,
          joinDate: session.user.createdAt || new Date().toISOString(),
        },
        todos: todos,
        stats: stats,
        preferences: preferences,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `todo-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please sign in to view your profile.
          </p>
          <a
            href="/auth"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Background Pattern */}
        <div className="relative mb-8 p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {session.user.name?.split(" ")[0] || "User"}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Here's your productivity dashboard and account settings
              </p>
            </div>

            {/* Profile Avatar with Status */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Todos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.total || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <FiTrendingUp className="mr-1" />
                  All time
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiTarget className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.completed || 0}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <FiCheckCircle className="mr-1" />
                  {stats.completionRate || 0}% rate
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiAward className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.pending || 0}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                  <FiActivity className="mr-1" />
                  Active
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiZap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overdue
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {stats.overdue || 0}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                  <FiClock className="mr-1" />
                  Need attention
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FiClock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Enhanced Profile Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <FiUser className="mr-2" />
                    Profile Information
                  </h2>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm"
                    >
                      <FiEdit3 className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                      >
                        {saveLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <FiSave className="mr-2" />
                        )}
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start space-x-6">
                  {/* Enhanced Avatar */}
                  <div className="flex-shrink-0 relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full p-1">
                      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <FiCamera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* User Details */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                            {session.user.name || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <p className="text-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg flex items-center">
                          <FiMail className="mr-2 text-gray-500" />
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Account Status
                        </label>
                        <div className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            Active & Verified
                          </span>
                          {userSynced && (
                            <>
                              <span className="text-green-400">•</span>
                              <span className="text-green-600 dark:text-green-400 text-sm">
                                Synced
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Member Since
                        </label>
                        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg">
                          <FiCalendar className="text-blue-600 dark:text-blue-400" />
                          <span className="text-blue-700 dark:text-blue-400 font-medium">
                            {new Date().toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Statistics Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiActivity className="mr-2" />
                  Productivity Analytics
                </h2>
              </div>

              <div className="p-6">
                {/* Completion Rate with Visual Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Overall Completion Rate
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.completionRate || 0}%
                      </span>
                      <FiAward className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>

                  <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${stats.completionRate || 0}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                      {stats.completed || 0} of {stats.total || 0} completed
                    </div>
                  </div>
                </div>

                {/* Priority Distribution */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiTarget className="mr-2" />
                    Priority Distribution
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-800">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FiZap className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.priority?.high || 0}
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300 font-medium">
                        High Priority
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FiActivity className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.priority?.medium || 0}
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                        Medium Priority
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FiHeart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.priority?.low || 0}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Low Priority
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiAward className="mr-2" />
                    Achievements
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.completed >= 1 && (
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg text-center">
                        <FiStar className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs font-medium">First Todo</div>
                      </div>
                    )}

                    {stats.completed >= 10 && (
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-lg text-center">
                        <FiAward className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs font-medium">10 Completed</div>
                      </div>
                    )}

                    {stats.completionRate >= 50 && (
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg text-center">
                        <FiTarget className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs font-medium">50% Rate</div>
                      </div>
                    )}

                    {stats.completionRate >= 80 && (
                      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-3 rounded-lg text-center">
                        <FiGift className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs font-medium">Achiever</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Preferences Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiSettings className="mr-2" />
                  Preferences & Settings
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Theme Setting */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <FiMonitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Display Theme
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Customize your visual experience
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "light", icon: FiSun, label: "Light" },
                      { value: "dark", icon: FiMoon, label: "Dark" },
                      { value: "system", icon: FiMonitor, label: "System" },
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() =>
                          setPreferences((prev) => ({ ...prev, theme: value }))
                        }
                        className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-2 ${
                          preferences.theme === value
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FiBell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Push Notifications
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Get notified about due dates and updates
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            notifications: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Email Digest */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <FiMail className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Weekly Email Digest
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Receive weekly productivity summaries
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailDigest}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            emailDigest: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                {/* Default Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <FiTarget className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Default Priority
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          For new todos
                        </div>
                      </div>
                    </div>
                    <select
                      value={preferences.defaultPriority}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          defaultPriority: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-600 dark:text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <FiStar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Default Color
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          For new todos
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-purple-500",
                        "bg-red-500",
                        "bg-yellow-500",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setPreferences((prev) => ({
                              ...prev,
                              defaultColor: color,
                            }))
                          }
                          className={`w-8 h-8 rounded-full ${color} border-2 transition-all ${
                            preferences.defaultColor === color
                              ? "border-gray-900 dark:border-white scale-110"
                              : "border-gray-300 dark:border-gray-600 hover:scale-105"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Preferences Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                    <FiSave className="mr-2" />
                    Save All Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiZap className="mr-2" />
                  Quick Actions
                </h3>
              </div>

              <div className="p-4 space-y-2">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 group"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50">
                    <FiDownload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Export Data</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Download your todos
                    </div>
                  </div>
                </button>

                <button className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-all duration-200 group">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-800/50">
                    <FiUpload className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Import Data</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Upload your backup
                    </div>
                  </div>
                </button>

                <button
                  onClick={fetchUserData}
                  className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-all duration-200 group"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50">
                    <FiRefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Refresh Stats</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Update your metrics
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Insights
                </h3>
              </div>

              <div className="p-4 space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.completionRate >= 80
                      ? "🔥"
                      : stats.completionRate >= 60
                      ? "⭐"
                      : "💪"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stats.completionRate >= 80
                      ? "You're on fire!"
                      : stats.completionRate >= 60
                      ? "Great progress!"
                      : "Keep pushing!"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      This week
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      +{Math.floor(Math.random() * 5) + 1} completed
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Avg. per day
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {((stats.completed || 0) / 7).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Best streak
                    </span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {Math.floor(Math.random() * 10) + 3} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Overview */}
            {stats.categories && Object.keys(stats.categories).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <FiTarget className="mr-2" />
                    Categories
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  {Object.entries(stats.categories)
                    .slice(0, 5)
                    .map(([category, count], index) => {
                      const colors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-purple-500",
                        "bg-yellow-500",
                        "bg-red-500",
                      ];
                      const color = colors[index % colors.length];

                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 ${color} rounded-full`}
                            ></div>
                            <span className="text-gray-700 dark:text-gray-300 capitalize font-medium">
                              {category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {count}
                            </span>
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${color} transition-all duration-300`}
                                style={{
                                  width: `${Math.min(
                                    (count / (stats.total || 1)) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Account Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiSettings className="mr-2" />
                  Account
                </h3>
              </div>

              <div className="p-4 space-y-2">
                <button className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                  <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3 group-hover:bg-gray-200 dark:group-hover:bg-gray-500">
                    <FiShield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Privacy Settings</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your privacy
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-800/50">
                    <FiLogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Sign Out</div>
                    <div className="text-sm text-red-500">End your session</div>
                  </div>
                </button>

                <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-800/50">
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Delete Account</div>
                    <div className="text-sm text-red-500">
                      Permanently remove
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
