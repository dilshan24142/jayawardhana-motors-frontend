import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

/**
 * Sends signed-out users to /login.
 *
 * TEMPORARY until JM-08 (Member 2): everyone counts as signed in so pages can be built now.
 * JM-08 replaces `isSignedIn` with the AuthContext value. This is UX only; the backend enforces access.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isSignedIn = true;

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
