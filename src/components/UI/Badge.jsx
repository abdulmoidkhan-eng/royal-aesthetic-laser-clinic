import React from 'react';

export const Badge = ({
  children,
  variant = 'blush',
  className = ''
}) => {
  const styles = {
    blush: 'bg-[#FAF8F3] text-[#9E7F47] border border-[#E8E2D8] font-medium',
    solid: 'bg-[#C5A46D] text-white font-medium',
    dark: 'bg-[#262626] text-white font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    outline: 'border border-[#C5A46D] text-[#77716A]'
  };

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
