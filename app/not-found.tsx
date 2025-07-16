"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-[400px] items-center from-neutral-50 to-neutral-200 justify-center dark:bg-gradient-to-br dark:from-neutral-900 dark:to-black p-6">
      <Card className="w-full max-w-md text-center shadow-none border-white dark:bg-neutral-900 text-white animate-fade-in rounded-2xl">
        <CardContent className="p-8 flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
          <h2 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="mb-6 dark:text-neutral-400 text-neutral-700 text-lg">
            Sorry, the page you’re looking for doesn’t exist.
          </p>
          <Button asChild className="text-lg px-6 py-4">
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
