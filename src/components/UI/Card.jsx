import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E8E2D8] p-5 sm:p-6 transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-lg hover:border-[#C5A46D] hover:-translate-y-1' : 'shadow-xs'
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
