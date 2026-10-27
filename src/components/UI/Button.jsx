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
  const baseStyles = "inline-flex items-center justify-center font-medium min-h-[44px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D9A38F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2.5 rounded-xl gap-2",
    lg: "text-base px-6 py-3 rounded-xl gap-2.5"
  };

  const variantStyles = {
    primary: "bg-[#D9A38F] text-white hover:bg-[#c9917d] active:scale-[0.98] shadow-sm",
    secondary: "bg-[#F4E4DE] text-[#3A3A3A] hover:bg-[#ebd6cf] active:scale-[0.98]",
    outline: "border border-[#D9A38F] text-[#3A3A3A] hover:bg-[#FBF3F0] active:scale-[0.98]",
    ghost: "text-[#3A3A3A] hover:bg-[#FBF3F0] active:bg-[#F4E4DE]",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-[0.98] shadow-sm font-semibold",
    dark: "bg-[#3A3A3A] text-white hover:bg-[#282828] active:scale-[0.98]"
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
