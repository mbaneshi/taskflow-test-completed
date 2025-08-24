import React from "react";

const Card = ({ 
  children, 
  className = "", 
  variant = "default",
  size = "md",
  header,
  footer,
  icon,
  loading = false,
  hoverable = false,
  clickable = false,
  rounded = "lg",
  bgColor = "white",
  padding,
  responsive = false,
  ...props 
}) => {
  // Base classes
  const baseClasses = "bg-white rounded-lg shadow-md transition-all duration-200";
  
  // Variant classes
  const variantClasses = {
    default: "bg-white shadow-md",
    outlined: "bg-white border border-gray-200 shadow-none",
    elevated: "bg-white shadow-lg",
    flat: "bg-white shadow-none"
  };
  
  // Size classes
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  
  // Border radius classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full"
  };
  
  // Background color classes
  const bgColorClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    blue: "bg-blue-50",
    green: "bg-green-50",
    red: "bg-red-50"
  };
  
  // Responsive classes
  const responsiveClasses = responsive ? "sm:p-4 md:p-6 lg:p-8" : "";
  
  // Interactive classes
  const interactiveClasses = [
    hoverable && "hover:shadow-lg transition-shadow",
    clickable && "cursor-pointer hover:bg-gray-50"
  ].filter(Boolean).join(" ");
  
  // Combine all classes
  const cardClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    bgColorClasses[bgColor],
    responsiveClasses,
    interactiveClasses,
    className
  ].filter(Boolean).join(" ");
  
  // Custom padding override
  const finalClasses = padding ? cardClasses.replace(/p-\d+/, padding) : cardClasses;
  
  // Loading skeleton
  if (loading) {
    return (
      <div className={finalClasses} {...props}>
        <div data-testid="card-skeleton" className="animate-pulse">
          {header && (
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
          )}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          {footer && (
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className={finalClasses} {...props}>
      {/* Header */}
      {header && (
        <div className="text-xl font-semibold mb-4">
          {icon && <span className="mr-2">{icon}</span>}
          {header}
        </div>
      )}
      
      {/* Content with icon if no header */}
      {!header && icon && (
        <div className="flex items-center mb-2">
          <span className="mr-2">{icon}</span>
        </div>
      )}
      
      {/* Content */}
      {children}
      
      {/* Footer */}
      {footer && (
        <div className="text-sm text-gray-500 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
