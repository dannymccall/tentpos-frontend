import React from "react";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "@/lib/permissions";


interface Props {
  code: string;
  children: React.ReactElement<any>; // 👈 fix: allow any props
  mode?: "hide" | "disable";
  message?: string;
}

export function PermissionGate({
  code,
  children,
  mode = "hide",
  message = "You don't have permission",
}: Props) {
  const { permissions, businessProfile } = useAuth();

  const allowed = hasPermission(permissions, code) || businessProfile?.appRole === "owner";


  if (allowed) return children;

  if (mode === "disable") {
    return React.cloneElement(children, {
      ...children.props,
      disabled: true,
      title: message,
      className: `${children.props.className || ""} opacity-50 cursor-not-allowed`,
    });
  }

  return null;
}
