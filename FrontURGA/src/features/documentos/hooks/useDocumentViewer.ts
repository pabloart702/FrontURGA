import { useCallback, useEffect, useRef, useState } from 'react';
import { getApiErrorMessage, isNetworkError } from '../../../utils/errorMessages';
import { logger } from '../../../utils/logger';
import { documentosApi } from '../api/documentosApi';
import type { DocumentInfo, DocumentViewerState } from '../types/documentos.types';

const FALLBACK_ERROR =
  'Erro ao carregar o documento. Pode ter havido um problema de conexão ou o limite de requisições foi excedido.';

export interface UseDocumentViewerReturn {
  state: DocumentViewerState;
  openDocument: (doc: DocumentInfo) => Promise<void>;
  closeDocument: () => void;
  isOpen: boolean;
}

/**
 * Hook customizado para controle de abertura, fechamento e ciclo de vida
 * de visualização de documentos PDF via Blob seguro.
 */
export function useDocumentViewer(): UseDocumentViewerReturn {
  const [state, setState] = useState<DocumentViewerState>({ status: 'idle' });
  const activeBlobUrlRef = useRef<string | null>(null);

  const cleanupBlob = useCallback(() => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
  }, []);

  const closeDocument = useCallback(() => {
    cleanupBlob();
    setState({ status: 'idle' });
  }, [cleanupBlob]);

  const openDocument = useCallback(
    async (doc: DocumentInfo) => {
      cleanupBlob();

      const safeFilename = doc.filename.replace(/[^\p{L}0-9._\- ]/gu, '');
      if (safeFilename !== doc.filename) {
        logger.error('Nome de arquivo inválido detectado:', doc.filename);
        setState({
          status: 'error',
          doc,
          message: 'Nome de arquivo com caracteres inválidos.',
        });
        return;
      }

      setState({ status: 'loading', doc });

      try {
        const blobData = await documentosApi.fetchDocumentBlob(doc.filename);
        const file = new File([blobData], doc.filename, { type: 'application/pdf' });
        const blobUrl = `${URL.createObjectURL(file)}#${encodeURIComponent(doc.filename)}`;

        activeBlobUrlRef.current = blobUrl;
        setState({ status: 'success', doc, blobUrl });
      } catch (error) {
        logger.error('Erro ao buscar o documento:', error);
        const message = isNetworkError(error)
          ? 'Erro de conexão com o servidor de documentos.'
          : getApiErrorMessage(error, FALLBACK_ERROR);

        setState({ status: 'error', doc, message });
      }
    },
    [cleanupBlob],
  );

  // Limpa o blob URL quando o componente for desmontado para evitar vazamento de memória
  useEffect(() => {
    return () => {
      cleanupBlob();
    };
  }, [cleanupBlob]);

  return {
    state,
    openDocument,
    closeDocument,
    isOpen: state.status !== 'idle',
  };
}
