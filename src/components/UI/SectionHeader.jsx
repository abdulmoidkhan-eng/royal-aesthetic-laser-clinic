import React from 'react';

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = '',
  action
}) => {
  return (
    <div className={`mb-8 sm:mb-12 ${centered ? 'text-center mx-auto max-w-2xl' : 'text-start'} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[#D9A38F] mb-2 px-3 py-1 bg-[#FBF3F0] rounded-full">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#3A3A3A] font-normal tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-[#6B5B55] leading-relaxed">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default SectionHeader;
