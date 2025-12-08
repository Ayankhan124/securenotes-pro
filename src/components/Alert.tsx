// src/components/Alert.tsx
import React from "react";

type AlertVariant = "error" | "info" | "success";

type AlertProps = {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
};

const baseClasses =
  "text-xs rounded-md border px-3 py-2 flex items-start gap-2";

const stylesByVariant: Record<AlertVariant, string> = {
  error: "bg-red-50 border-red-100 text-red-700",
  info: "bg-sky-50 border-sky-100 text-sky-700",
  success: "bg-emerald-50 border-emerald-100 text-emerald-700",
};

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  children,
  className = "",
}) => {
  const styles = stylesByVariant[variant] ?? stylesByVariant.info;

  return (
    <div className={`${baseClasses} ${styles} ${className}`}>
      <span className="mt-[2px] text-xs">
        {variant === "error" && "⚠️"}
        {variant === "info" && "ℹ️"}
        {variant === "success" && "✅"}
      </span>
      <div>{children}</div>
    </div>
  );
};
