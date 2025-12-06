import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
};

export default function Button({ variant = "primary", className, children, ...rest }: Props) {
  const base = "px-5 py-2.5 rounded-md font-medium focus:outline-none transition-shadow inline-flex items-center gap-2";
  const variants: Record<string,string> = {
    primary: "bg-primary text-white hover:shadow-lg",
    outline: "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50",
    ghost: "text-primary bg-transparent hover:underline"
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
