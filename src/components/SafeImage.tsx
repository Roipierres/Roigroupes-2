import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackType?: 'icon' | 'screenshot';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackTitle = 'RoiGroupes',
  fallbackType = 'screenshot',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const generateSvgFallback = () => {
    const cleanTitle = (fallbackTitle || 'RoiGroupes App').replace(/["'<>&]/g, '');
    const initial = cleanTitle.charAt(0).toUpperCase() || 'R';

    if (fallbackType === 'icon') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)" rx="60"/><rect x="10" y="10" width="280" height="280" fill="none" stroke="#f59e0b" stroke-width="4" stroke-opacity="0.4" rx="52"/><circle cx="150" cy="150" r="80" fill="#f59e0b" fill-opacity="0.15"/><text x="150" y="175" font-family="sans-serif" font-size="110" font-weight="900" fill="#f59e0b" text-anchor="middle">${initial}</text></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#020617"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><rect width="800" height="500" fill="url(#bg)"/><rect x="20" y="20" width="760" height="460" rx="32" fill="none" stroke="#f59e0b" stroke-width="3" stroke-opacity="0.3"/><circle cx="400" cy="200" r="70" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-width="2"/><text x="400" y="215" font-family="sans-serif" font-size="50" font-weight="900" fill="#f59e0b" text-anchor="middle">RG</text><text x="400" y="320" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${cleanTitle}</text><text x="400" y="360" font-family="sans-serif" font-size="16" font-weight="600" fill="#94a3b8" text-anchor="middle">RoiGroupes Certified Application</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const currentSrc = (hasError || !src) ? generateSvgFallback() : src;

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt || fallbackTitle}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasError) setHasError(true);
      }}
    />
  );
};
