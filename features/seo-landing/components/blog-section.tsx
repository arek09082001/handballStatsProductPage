'use client';

import React from 'react';

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  content: React.ReactNode;
  backgroundColor?: 'white' | 'light' | 'dark';
  className?: string;
}

export default function BlogSection({
  title,
  subtitle,
  content,
  backgroundColor = 'white',
  className = '',
}: BlogSectionProps) {
  const bgClass = {
    white: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-black text-white',
  }[backgroundColor];

  return (
    <section className={`${bgClass} py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        {(title || subtitle) && (
          <div className="mb-12 text-center md:text-left">
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] text-black dark:text-white sm:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}
        <div className="prose dark:prose-invert max-w-none text-lg leading-8 text-gray-700 dark:text-gray-300">
          {content}
        </div>
      </div>
    </section>
  );
}
