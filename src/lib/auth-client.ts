/**
 * auth-client.ts
 *
 * Re-exports the useAuth hook from AuthContext as the canonical way for
 * components to access the current user session. This replaces next-auth's
 * `useSession` / `getServerSession` approach with a plain React context.
 *
 * Usage in components:
 *   import { useAuth } from "@lib/auth-client";
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */
export { useAuth } from "@stores/useAuthStore";

import type { UserInfo } from "@appTypes/index";

export function getUserSession(): UserInfo | null {
  try {
    const raw = localStorage.getItem("_session_user");
    if (!raw) return null;
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}
