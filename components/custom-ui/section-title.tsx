import React from 'react';

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent'>
      {title}
    </h2>
  );
}

export default React.memo(SectionTitle);
