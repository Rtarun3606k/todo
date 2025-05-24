"use client";

import ThemeSwitch from "@/app/components/ThemesSwitching";
import React from "react";

const page = () => {
  const test = async () => {
    console.log("Test function executed");
    const request = await fetch("/api/test");
    if (!request.ok) {
      console.error("Failed to fetch test data", request);
      return;
    }
    const data = await request.json();
    console.log("Test data:", data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Theme Switching Test</h1>
        <ThemeSwitch />
        <p className="mt-4">
          This text should change color when you switch themes!
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          onClick={() => {
            test();
          }}
        >
          click me
        </button>
      </div>
    </div>
  );
};

export default page;
