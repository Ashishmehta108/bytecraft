import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/global/Container";
import { FavoriteProvider } from "@/components/FavoriteContext";
import AiChat from "@/components/ai/AiChat";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "@/components/UserContext";
import { CartProvider } from "@/components/CartContext";
import Providers from "../providers";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Furniture Store",
  description: "A nifty store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ClerkProvider>
            <UserProvider>
              <FavoriteProvider>
                <CartProvider>
                  <Navbar />
                  <Container className="py-20">
                    {children}
                    <AiChat />
                  </Container>
                </CartProvider>
              </FavoriteProvider>
            </UserProvider>
          </ClerkProvider>
        </Providers>
      </body>
    </html>
  );
}
