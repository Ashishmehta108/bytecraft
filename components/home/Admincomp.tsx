"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { AnimatedBeamDemo } from "../Techstackcomp";

type AdminStatus = "idle" | "prompt" | "checking" | "authorized" | "denied";

interface AdminCheckProps {
  onRedirect?: (url: string) => void;
  redirectDelay?: number;
  checkDelay?: number;
  adminPassword?: string;
}

const AdminCheck: React.FC<AdminCheckProps> = ({
  onRedirect,
  redirectDelay = 1500,
  checkDelay = 800,
  adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
}) => {
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("idle");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setAdminStatus("checking");
    setError("");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, checkDelay));

    if (password === adminPassword) {
      // Set admin cookie
      document.cookie = "admin_token=securetoken; path=/";
      setAdminStatus("authorized");
    } else {
      setAdminStatus("denied");
      setError("Invalid password");
    }
  };

  const resetToPrompt = (): void => {
    setPassword("");
    setError("");
    setAdminStatus("prompt");
  };

  useEffect(() => {
    if (adminStatus === "authorized") {
      const timer = setTimeout(() => {
        if (onRedirect) {
          onRedirect("/admin");
        } else {
          // Default redirect behavior
          if (typeof window !== "undefined" && window.location) {
            window.location.href = "/admin";
          }
        }
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [adminStatus, redirectDelay, onRedirect]);

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const contentVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="flex  items-center justify-evenly h-[500px] bg-background p-4">
      <div className="text-3xl font-semibold text-foreground max-w-md ">
    Login using password , yoursecretpassword

      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl p-8 w-full max-w-sm"
      >
        <AnimatePresence mode="wait">
          {/* Initial State - Ask if admin */}
          {adminStatus === "idle" && (
            <motion.div
              key="idle"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg
                  className="w-8 h-8 text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </motion.div>

              <h2 className="text-2xl font-semibold text-zinc-900 mb-3">
                Are you an admin?
              </h2>

              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Click below to access the admin dashboard.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAdminStatus("prompt")}
                className="w-full bg-indigo-600 hover:bg-indigo-500  cursor-pointer text-white py-3 px-6 rounded-xl font-medium text-sm transition-colors duration-200"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Yes, Login
              </motion.button>
            </motion.div>
          )}

          {/* Password Prompt State */}
          {(adminStatus === "prompt" || adminStatus === "denied") && (
            <motion.form
              key="prompt"
              onSubmit={handleLogin}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <svg
                  className="w-8 h-8 text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </motion.div>

              <h2 className="text-2xl font-semibold text-zinc-900 mb-6">
                Admin Login
              </h2>

              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                />
              </div>

              {error && (
                <motion.p
                  className="text-red-500 text-sm mb-4"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {error}
                </motion.p>
              )}

              <div className="space-y-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-600  cursor-pointer hover:bg-indigo-500 text-white py-3 px-6 rounded-xl font-medium text-sm transition-colors duration-200"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  Login
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setAdminStatus("idle")}
                  className="w-full text-zinc-500  cursor-pointer hover:text-zinc-700 py-2 text-sm font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Checking State */}
          {adminStatus === "checking" && (
            <motion.div
              key="checking"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <motion.div
                  className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              <h2 className="text-2xl font-semibold text-zinc-900 mb-3">
                Verifying Access
              </h2>

              <p className="text-zinc-500 text-sm leading-relaxed">
                Checking your credentials...
              </p>
            </motion.div>
          )}

          {/* Success State */}
          {adminStatus === "authorized" && (
            <motion.div
              key="authorized"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
              >
                <svg
                  className="w-8 h-8 text-zinc-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </svg>
              </motion.div>

              <motion.h2
                className="text-2xl font-semibold text-zinc-900 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Access Granted
              </motion.h2>

              <motion.p
                className="text-zinc-500 text-sm leading-relaxed mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Redirecting to admin dashboard...
              </motion.p>

              {/* Loading dots */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-zinc-400 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminCheck;
