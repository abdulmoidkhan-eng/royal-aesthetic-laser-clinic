import React from 'react';

export const Badge = ({
  children,
  variant = 'blush',
  className = ''
}) => {
  const styles = {
    blush: 'bg-[#FBF3F0] text-[#D9A38F] border border-[#F4E4DE]',
    solid: 'bg-[#D9A38F] text-white',
    dark: 'bg-[#3A3A3A] text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    outline: 'border border-[#D9A38F] text-[#6B5B55]'
  };

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
