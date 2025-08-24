import React, { useEffect, useRef } from "react";

const Modal = ({ 
  isOpen = false, 
  onClose, 
  title, 
  children, 
  footer,
  size = "md",
  className = "",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  backdropBlur = false,
  backdropColor,
  animated = false,
  zIndex,
  responsive = false,
  ...props 
}) => {
  const backdropRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && onClose) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen, onClose]);
  
  // Debounced close function to prevent multiple rapid calls
  const handleClose = () => {
    // If we already have a timeout, ignore this call
    if (closeTimeoutRef.current) {
      return;
    }
    
    // Call immediately
    if (onClose) {
      onClose();
    }
    
    // Set a flag to prevent rapid successive calls
    closeTimeoutRef.current = setTimeout(() => {
      closeTimeoutRef.current = null;
    }, 100);
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current && closeOnBackdropClick && onClose) {
      handleClose();
    }
  };
  
  // Handle modal content click (prevent closing)
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  
  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4"
  };
  
  // Responsive sizing
  const responsiveClasses = responsive ? "sm:max-w-md md:max-w-lg lg:max-w-2xl" : "";
  
  // Animation classes
  const animationClasses = animated ? "animate-in fade-in" : "";
  
  // Base modal classes
  const modalClasses = [
    "bg-white rounded-lg shadow-xl relative z-50",
    sizeClasses[size],
    responsiveClasses,
    animationClasses,
    className
  ].filter(Boolean).join(" ");
  
  // Backdrop classes
  const backdropClasses = [
    "fixed inset-0 flex items-center justify-center z-40",
    backdropColor || "bg-black bg-opacity-50",
    backdropBlur && "backdrop-blur-sm"
  ].filter(Boolean).join(" ");
  
  // Custom z-index
  const modalStyle = zIndex ? { zIndex } : {};
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={backdropRef}
      className={backdropClasses}
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
    >
      <div 
        className={modalClasses}
        onClick={handleModalClick}
        data-testid="modal-content"
        style={modalStyle}
        {...props}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {onClose && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-gray-200" data-testid="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
