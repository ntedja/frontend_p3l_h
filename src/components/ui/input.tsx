import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export function Input({ icon, className = "", ...props }: InputProps) {
  const paddingLeft = icon ? "pl-10" : "pl-4";

  return (
    <div className="relative w-full">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
      <input
        {...props}
        className={`w-full border rounded-md py-2 ${paddingLeft} pr-4 ${className}`}
      />
    </div>
  );
}
