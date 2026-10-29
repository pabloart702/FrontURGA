import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Check, Download, FileText, RefreshCw } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import type { DocumentViewerState } from '../types/documentos.types';

interface DocumentPreviewModalProps {
  state: DocumentViewerState;
  onClose: () => void;
}

/**
 * Detecta se o ambiente atual é um dispositivo móvel ou tela reduzida
 * que não suporta visualização de PDF integrada em iframes.
 */
function checkIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || isTouchMac || isSmallScreen;
}

/**
 * Modal composto para visualização e download de PDFs seguros.
 * No desktop, renderiza iframe com o leitor nativo do navegador.
 * No mobile (Android/iOS), oferece abertura direta e download seguro
 * contornando a ausência de visualizador PDF em iframes nos navegadores móveis.
 */
export function DocumentPreviewModal({ state, onClose }: DocumentPreviewModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [forceShowIframe, setForceShowIframe] = useState(false);
  const [isMobile, setIsMobile] = useState(() => checkIsMobile());
  const [prevDocKey, setPrevDocKey] = useState<string | null>(null);

  const currentDocKey = state.status === 'idle' ? null : state.doc.filename;

  if (currentDocKey !== prevDocKey) {
    setPrevDocKey(currentDocKey);
    setDownloaded(false);
    setForceShowIframe(false);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = useCallback(() => {
    if (state.status !== 'success') return;
    const link = document.createElement('a');
    link.href = state.blobUrl;
    link.download = state.doc.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  }, [state]);

  if (state.status === 'idle') {
    return null;
  }

  const { doc } = state;
  const showMobileView = isMobile && !forceShowIframe;

  return (
    <Modal isOpen onClose={onClose} className="doc-preview-modal" ariaLabel={doc.title}>
      <Modal.Header>
        <Modal.Title>{doc.title}</Modal.Title>
        <div className="doc-modal-actions">
          {state.status === 'success' && (
            <button
              type="button"
              className="doc-header-action-btn"
              onClick={handleDownload}
              title="Baixar documento PDF"
              aria-label="Baixar documento PDF"
            >
              <Download size={18} />
              <span className="doc-header-btn-text">Baixar</span>
            </button>
          )}
          <Modal.CloseButton title="Fechar" />
        </div>
      </Modal.Header>
      <Modal.Body className="doc-preview-body">
        {state.status === 'loading' && (
          <div className="doc-preview-status">
            <div className="loading-spinner" aria-hidden="true" />
            <span>Carregando documento seguro...</span>
          </div>
        )}

        {state.status === 'success' && showMobileView && (
          <div className="doc-mobile-preview">
            <div className="doc-mobile-icon-wrapper" aria-hidden="true">
              <FileText size={44} />
            </div>
            <h4 className="doc-mobile-title">{doc.title}</h4>
            <div className="doc-mobile-badge">
              <span>PDF Oficial</span>
              <span>•</span>
              <span>{doc.date}</span>
            </div>
            <p className="doc-mobile-description">
              Dispositivos móveis utilizam o leitor nativo do sistema para visualização completa com zoom e alta resolução.
            </p>

            <button
              type="button"
              className={`doc-mobile-download-btn ${downloaded ? 'downloaded' : ''}`}
              onClick={handleDownload}
              aria-label="Baixar e abrir documento no celular"
            >
              {downloaded ? (
                <>
                  <Check size={20} />
                  <span>Download Iniciado!</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Baixar / Abrir Documento</span>
                </>
              )}
            </button>

            {downloaded && (
              <p className="doc-mobile-feedback" role="status">
                Arquivo salvo! Toque na barra de notificações do celular para abrir.
              </p>
            )}

            <button
              type="button"
              className="doc-mobile-toggle-btn"
              onClick={() => setForceShowIframe(true)}
            >
              <RefreshCw size={13} />
              <span>Tentar visualização embutida no navegador</span>
            </button>
          </div>
        )}

        {state.status === 'success' && !showMobileView && (
          <>
            {isMobile && forceShowIframe && (
              <div className="doc-iframe-mobile-bar">
                <span>Visualização embutida forçada</span>
                <button
                  type="button"
                  className="doc-iframe-return-btn"
                  onClick={() => setForceShowIframe(false)}
                >
                  Voltar ao modo recomendado
                </button>
              </div>
            )}
            <iframe
              src={state.blobUrl}
              title={doc.title}
              className="doc-preview-iframe"
            />
          </>
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

