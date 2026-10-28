import { useState } from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useSecureImage } from '../hooks/useSecureImage';

interface SecureImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: ReactNode;
  zoomable?: boolean;
}

export function SecureImage({ src, fallback, zoomable = false, ...props }: SecureImageProps) {
  const { objectUrl, loading, error } = useSecureImage(src);
  const [isZoomed, setIsZoomed] = useState(false);

  if (loading) {
    return (
      <div
        className="secure-image-placeholder animate-pulse bg-gray-200 rounded-full"
        style={{ width: props.width || 40, height: props.height || 40, ...props.style }}
      />
    );
  }

  if (error || !objectUrl) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        className="secure-image-fallback bg-gray-300 flex items-center justify-center text-gray-500 rounded-full"
        style={{ width: props.width || 40, height: props.height || 40, ...props.style }}
      >
        !
      </div>
    );
  }

  return (
    <>
      <img
        src={objectUrl}
        {...props}
        onClick={(e) => {
          if (zoomable) {
            e.stopPropagation();
            setIsZoomed(true);
          }
          if (props.onClick) props.onClick(e);
        }}
        style={{ ...props.style, cursor: zoomable ? 'zoom-in' : props.style?.cursor }}
      />

      {isZoomed && zoomable && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm secure-image-zoom-overlay"
            data-testid="zoom-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-gray-300"
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                color: 'white',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              title="Fechar"
              aria-label="Fechar zoom"
            >
              <X size={32} />
            </button>
            <img
              src={objectUrl}
              alt="Zoomed"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </>
  );
}
