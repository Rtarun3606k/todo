import { auth } from "@/app/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/todos",
    "/add-todo",
    "/settings",
    "/home",
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    return Response.redirect(new URL("/auth", req.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && nextUrl.pathname.startsWith("/auth")) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
