"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      document.cookie = `admin_token=securetoken; path=/`;
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-neutral-950 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=" password: yoursecretpassword"
          className="w-full border p-2 mb-4 rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
