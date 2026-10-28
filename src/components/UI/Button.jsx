import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'start',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium min-h-[44px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-wide";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-xl gap-2",
    lg: "text-base px-7 py-3 rounded-xl gap-2.5 font-medium"
  };

  const variantStyles = {
    primary: "bg-[#C5A46D] text-white hover:bg-[#B3925B] active:scale-[0.98] shadow-xs hover:shadow-md",
    secondary: "bg-[#F3EEE5] text-[#262626] hover:bg-[#EAE2D3] border border-[#E8E2D8] active:scale-[0.98]",
    outline: "border border-[#C5A46D] text-[#262626] hover:bg-[#FAF8F3] hover:border-[#B3925B] active:scale-[0.98]",
    ghost: "text-[#262626] hover:bg-[#F3EEE5] active:bg-[#EAE2D3]",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-[0.98] shadow-xs hover:shadow-md font-medium",
    dark: "bg-[#262626] text-white hover:bg-[#1A1A1A] active:scale-[0.98] shadow-xs"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'start' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'end' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;
