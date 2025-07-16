import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // still needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin | Furniture Store",
  description: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* <aside className="w-64 bg-white shadow-lg p-4">
            <h2 className="text-lg font-bold">Admin Panel</h2>
          </aside> */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
