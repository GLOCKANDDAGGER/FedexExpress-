import React from 'react';

interface FedExLogoProps {
  variant?: 'express' | 'ground' | 'freight' | 'office' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FedExLogo: React.FC<FedExLogoProps> = ({
  variant = 'express',
  className = '',
  size = 'md',
}) => {
  // Variant colors for the "Ex"
  const getExColor = () => {
    if (variant === 'white') return '#FFFFFF';
    switch (variant) {
      case 'ground':
        return '#008A00'; // FedEx Ground Green
      case 'freight':
        return '#DD1E25'; // FedEx Freight Red
      case 'office':
        return '#00A3E0'; // FedEx Office Cyan
      case 'express':
      default:
        return '#FF6200'; // FedEx Express Orange
    }
  };

  const getFedColor = () => {
    if (variant === 'white') return '#FFFFFF';
    return '#4D148C'; // Official FedEx Purple
  };

  const sizeClasses = {
    sm: 'text-xl tracking-tighter',
    md: 'text-2xl tracking-tighter',
    lg: 'text-3xl tracking-tighter',
    xl: 'text-4xl tracking-tighter',
  };

  return (
    <div
      className={`font-black inline-flex items-center select-none font-sans leading-none ${sizeClasses[size]} ${className}`}
      aria-label="FedEx"
    >
      <span style={{ color: getFedColor() }} className="font-black">
        Fed
      </span>
      <span style={{ color: getExColor() }} className="font-black relative">
        Ex
      </span>
    </div>
  );
};
