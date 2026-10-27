import { useState, useEffect } from 'react';
import api from '../utils/httpClient';

export interface UseSecureImageReturn {
  objectUrl: string | null;
  loading: boolean;
  error: boolean;
}

export function useSecureImage(src: string): UseSecureImageReturn {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        console.error('Erro ao carregar imagem segura:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchImage();

    return () => {
      isMounted = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [src]);

  return { objectUrl, loading, error };
}
