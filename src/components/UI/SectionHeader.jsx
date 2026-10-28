import React from 'react';

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = '',
  action,
  as = 'h2'
}) => {
  const HeadingTag = as;
  return (
    <div className={`mb-8 sm:mb-12 ${centered ? 'text-center mx-auto max-w-2xl' : 'text-start'} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium text-[#9E7F47] mb-3 px-3.5 py-1 bg-[#F3EEE5] border border-[#E8E2D8] rounded-full">
          {eyebrow}
        </span>
      )}
      <HeadingTag className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#262626] font-normal tracking-tight leading-tight">
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-[#77716A] leading-relaxed">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default SectionHeader;
