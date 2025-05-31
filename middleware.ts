import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/", 
    "/api/webhook",
    // Add support for images and static files
    "/(.*).(svg|jpg|jpeg|png|gif|ico|css|js)",
    "/logo.svg",
    // Treat sign-in and sign-up pages as public
    "/sign-in",
    "/sign-up"
  ],
  afterAuth(auth, req) {
    // If the user is not signed in and the route is not public, redirect to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    
    // If the user is signed in but doesn't have an organization selected,
    // and they're trying to access the organization routes, redirect to select-org
    if (auth.userId && !auth.orgId && req.nextUrl.pathname.includes("/organization/")) {
      const selectOrgUrl = new URL("/select-org", req.url);
      return NextResponse.redirect(selectOrgUrl);
    }

    // If the user is signed in with an org and trying to access the home page, redirect to org page
    if (auth.userId && auth.orgId && req.nextUrl.pathname === "/") {
      const orgUrl = new URL(`/organization/${auth.orgId}`, req.url);
      return NextResponse.redirect(orgUrl);
    }

    return NextResponse.next();
  }
});

// Stop Middleware from running on static files or API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory (public files like logo.svg)
     * - .svg, .jpg, .png, .gif etc. (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.gif).*)'
  ],
}; 