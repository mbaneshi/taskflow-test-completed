import React from "react";

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  type = "button", 
  disabled = false,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  rounded = false,
  "aria-label": ariaLabel,
  ...props
}) => {
  // Base classes
  const baseClasses = "font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  // State classes
  const stateClasses = disabled 
    ? "bg-gray-400 cursor-not-allowed opacity-50" 
    : loading 
    ? "opacity-75 cursor-wait" 
    : variantClasses[variant];
  
  // Layout classes
  const layoutClasses = [
    fullWidth && "w-full",
    rounded && "rounded-full",
    !rounded && "rounded-md"
  ].filter(Boolean).join(" ");
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    stateClasses,
    layoutClasses,
    className
  ].filter(Boolean).join(" ");
  
  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick && !disabled && !loading) {
        onClick(e);
      }
    }
  };
  
  // Handle click
  const handleClick = (e) => {
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };
  
  return (
    <button
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && (
          <span 
            data-testid="loading-spinner" 
            className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          />
        )}
        {icon && !loading && <span>{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Button;
