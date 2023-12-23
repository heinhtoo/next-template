import { withAuth } from "next-auth/middleware";
import { Role } from "@prisma/client";

const SuperAdminPaths = ["/configurations"];
const AdminPaths = [
  "/content",
  "/changePassword",
  "/users",
  "/testimonial",
  "/response",
  "/messages",
];

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  /* matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/test"], */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/assets",
    "/messages",
    "/.well-known",
  ],
};

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        if (SuperAdminPaths.find((z) => pathname.includes(z))) {
          return token?.role === Role.SuperAdmin;
        }
        if (AdminPaths.find((z) => pathname.includes(z))) {
          return token?.role === Role.SuperAdmin || token?.role === Role.Admin;
        }
        return true;
      },
    },
  }
);
