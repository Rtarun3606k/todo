"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl);
      }
    };
    checkSession();
  }, [router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Use automatic redirect - this will handle the OAuth flow completely
      await signIn("google", {
        callbackUrl,
      });

      const register = await fetch(`/api/user`);

      // setIsLoading(false);
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {/* Sign In Form */}
        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center space-x-2">
                <FiAlertCircle className="text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </span>
              </div>
            )}

            {/* Success Message (if redirecting) */}
            {isLoading && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center space-x-2">
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Signing in successfully...
                </span>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <FiLoader className="animate-spin h-5 w-5" />
              ) : (
                <FcGoogle className="h-5 w-5" />
              )}
              <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
            </button>

            {/* Alternative Sign In Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Secure authentication
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing in, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-blue-500 text-2xl mb-2">🔒</div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Secure
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                OAuth 2.0 protected
              </p>
            </div>

            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-green-500 text-2xl mb-2">⚡</div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Fast
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                One-click sign in
              </p>
            </div>

            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-purple-500 text-2xl mb-2">🎯</div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Simple
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                No passwords needed
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
