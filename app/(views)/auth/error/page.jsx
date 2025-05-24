"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function AuthError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const errorMessages = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "Access denied. You cancelled the authentication.",
    Verification:
      "The verification token has expired or has already been used.",
    OAuthSignin: "Error in constructing an authorization URL.",
    OAuthCallback: "Error in handling the response from an OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    EmailCreateAccount: "Could not create email provider user in the database.",
    Callback: "Error in the OAuth callback handler route.",
    OAuthAccountNotLinked:
      "Email on the account is already linked, but not with this OAuth account.",
    EmailSignin: "Sending the e-mail with the verification token failed.",
    CredentialsSignin:
      "The authorize callback returned null in the Credentials provider.",
    SessionRequired:
      "The content of this page requires you to be signed in at all times.",
    Default: "An error occurred during authentication.",
  };

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
          {error && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Error code: {error}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/auth")}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FiRefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
