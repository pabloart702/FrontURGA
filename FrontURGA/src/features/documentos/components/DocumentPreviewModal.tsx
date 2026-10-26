import { AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import type { DocumentViewerState } from '../types/documentos.types';

interface DocumentPreviewModalProps {
  state: DocumentViewerState;
  onClose: () => void;
}

/**
 * Modal composto para pré-visualização de PDFs seguros em iframe com estados discriminados.
 */
export function DocumentPreviewModal({ state, onClose }: DocumentPreviewModalProps) {
  if (state.status === 'idle') {
    return null;
  }

  const { doc } = state;

  return (
    <Modal isOpen onClose={onClose} className="doc-preview-modal" ariaLabel={doc.title}>
      <Modal.Header>
        <Modal.Title>{doc.title}</Modal.Title>
        <Modal.CloseButton title="Fechar" />
      </Modal.Header>
      <Modal.Body className="doc-preview-body">
        {state.status === 'loading' && (
          <div className="doc-preview-status">
            <div className="loading-spinner" aria-hidden="true" />
            <span>Carregando documento seguro...</span>
          </div>
        )}
        {state.status === 'success' && (
          <iframe
            src={state.blobUrl}
            title={doc.title}
            className="doc-preview-iframe"
          />
        )}
        {state.status === 'error' && (
          <div className="doc-preview-status" role="alert">
            <AlertCircle size={40} color="#ef4444" />
            <p className="doc-preview-error">{state.message}</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
