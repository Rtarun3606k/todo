"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  FiHome,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiPlus,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiCheckSquare,
} from "react-icons/fi";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "/home", icon: FiHome, label: "Home" },
    // { href: "/todos", icon: FiCheckSquare, label: "Todos" },
    { href: "/add-todo", icon: FiPlus, label: "Add Todo" },
    { href: "/profile", icon: FiUser, label: "Profile" },
  ];

  const ThemeToggle = () => {
    if (!mounted) return <div className="w-8 h-8"></div>;

    return (
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    );
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FiCheckSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TodoApp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Theme Toggle, Auth, Profile */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                {/* Profile Image */}
                <Link href="/profile" className="flex items-center space-x-2">
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    alt={session.user?.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user?.name}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                <FiLogIn size={18} />
                <span>Login with Google</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {session ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Image
                        src={session.user?.image || "/default-avatar.png"}
                        alt={session.user?.name || "User"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{session.user?.name}</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FiLogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn("google")}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                  >
                    <FiLogIn size={20} />
                    <span>Login with Google</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
