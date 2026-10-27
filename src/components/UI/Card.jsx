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
      className={`bg-white rounded-2xl border border-[#F4E4DE] p-5 sm:p-6 transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:border-[#D9A38F]/50 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
