import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "md";
};

export function Button({ variant = "default", size = "md", className = "", ...props }: ButtonProps) {
  const base = "rounded px-4 py-2 font-medium focus:outline-none";
  const variants = {
    default: "bg-[#2F4F4F] text-white",
    outline: "border border-[#2F4F4F] text-[#2F4F4F] bg-transparent"
  };
  const sizes = {
    sm: "text-sm",
    md: "text-base"
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
