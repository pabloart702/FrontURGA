import { useState, useEffect } from 'react';
import api from '../api/axios';

import { X } from 'lucide-react';

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: React.ReactNode;
  zoomable?: boolean;
}

export function SecureImage({ src, fallback, zoomable = false, ...props }: SecureImageProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    let currentObjectUrl: string | null = null;
    let isMounted = true;

    const fetchImage = async () => {
      setLoading(true);
      setError(false);
      try {
        if (!src) {
          setError(true);
          setLoading(false);
          return;
        }

        const response = await api.get(src, { responseType: 'blob' });

        const blob = response.data;
        if (isMounted) {
          currentObjectUrl = URL.createObjectURL(blob);
          setObjectUrl(currentObjectUrl);
        }
      } catch (err) {
        console.error("Erro ao carregar imagem segura:", err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [src]);

  if (loading) {
    return <div className="secure-image-placeholder animate-pulse bg-gray-200 rounded-full" style={{ width: props.width || 40, height: props.height || 40, ...props.style }}></div>;
  }

  if (error || !objectUrl) {
    if (fallback) return <>{fallback}</>;
    // Default fallback if none provided
    return <div className="secure-image-fallback bg-gray-300 flex items-center justify-center text-gray-500 rounded-full" style={{ width: props.width || 40, height: props.height || 40, ...props.style }}>!</div>;
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

      {isZoomed && zoomable && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(false);
          }}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300"
            style={{ position: 'absolute', top: '24px', right: '24px', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X size={32} />
          </button>
          <img
            src={objectUrl}
            alt="Zoomed"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
