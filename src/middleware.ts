export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/((?!login|register|onboarding|api|_next/static|_next/image|favicon.ico).*)"],
};
