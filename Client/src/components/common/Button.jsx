import React from "react";

const Button = ({
  children,
  type = "button",      
  variant = "primary",
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
}) => {
  const baseStyles =
    "rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-200 flex items-center justify-center";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}   // ✅ YE SABSE IMPORTANT LINE HAI
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? disabledStyles : ""}
        ${className}
        px-6 py-3
      `}
    >
      {children}
    </button>
  );
};

export default Button;
