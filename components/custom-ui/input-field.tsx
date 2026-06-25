import React from 'react';

interface InputProps {
  type?: string;
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}
export default function InputField({
  type = 'text',
  id,
  value,
  onChange,
  className = '',
  placeholder = '',
  required = false,
}: InputProps) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full px-4 py-3 bg-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
      placeholder={placeholder}
      required={required}
    />
  );
}
