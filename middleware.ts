import {
  auth,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher([
  "/cart",
  "/checkout",
  "account",
  "profile",
  "settings",
  "/orders",
  "/products/:slug",
  "wishlist",
]);
export default clerkMiddleware(async (auth, req) => {
  const isBot = req.headers.get("user-agent")?.includes("bot");
  console.log(req.nextUrl.pathname);
  console.log(isPrivateRoute(req), isPrivateRoute);
  const token = req.cookies.get("admin_token")?.value;

  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/admin-login", req.url));
  }

  if (isPrivateRoute(req) && !req.nextUrl.pathname.startsWith("/api")) {
    console.log("Middleware triggered:", req.nextUrl.pathname);
    await auth.protect();
  } else if (
    req.nextUrl.pathname.startsWith("https://checkout.stripe.com") &&
    isBot
  ) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/admin/:path",

    "/admin",
  ],
};
