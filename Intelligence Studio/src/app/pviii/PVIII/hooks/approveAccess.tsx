import React from "react";
import { useApproverAccess } from "../Api/useApproveAccess";

type ApproverGuardProps = {
  children: React.ReactNode;
  minLevel?: number; 
};

export function ApproverGuard({ children, minLevel = 1 }: ApproverGuardProps) {
  const { loading, hasAccess, lvl } = useApproverAccess();

  if (loading) return <div>Cargando...</div>;

  const hasLevelRole = typeof lvl === "number" && lvl >= minLevel;

  const canEnter = hasAccess || hasLevelRole;

  if (!canEnter) {
    return (
      <div style={{ padding: 16 }}>
        <h3>Restricted access</h3>
        <p>You do not have any assigned approvals and you do not have the required security level.</p>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Required level: {minLevel}+ | Your level: {lvl ?? "N/A"}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
