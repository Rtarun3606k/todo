"use client";

import ThemeSwitch from "@/app/components/ThemesSwitching";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import React from "react";

const HomePage = () => {
  const { data: session, status } = useSession();
  const [userSynced, setUserSynced] = useState(false);

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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Todo App</h1>

        {session?.user && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              Hello, {session.user.name}!
            </h2>
            <p className="text-muted-foreground">Email: {session.user.email}</p>
            {userSynced && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ Account synced successfully
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Theme Settings</h3>
            <ThemeSwitch />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">
              Your personalized todo dashboard. Start creating todos and
              organize your tasks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
