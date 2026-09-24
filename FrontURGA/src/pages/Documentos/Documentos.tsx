import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import api from '../../api/axios';
import { logger } from '../../utils/logger';
import './Documentos.css';

interface DocumentInfo {
  title: string;
  filename: string;
  date: string;
}

export function Documentos() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentInfo | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const openDocument = async (doc: DocumentInfo) => {
    setSelectedDoc(doc);
    setIsLoadingPdf(true);
    setPdfBlobUrl(null);

    const safeFilename = doc.filename.replace(/[^\p{L}0-9._\- ]/gu, '');
    if (safeFilename !== doc.filename) {
      logger.error('Nome de arquivo inválido detectado');
      setIsLoadingPdf(false);
      setSelectedDoc(null);
      return;
    }

    const encodedFilename = encodeURIComponent(doc.filename);

    try {
      const response = await api.get(`/api/documentos/${encodedFilename}`, {
        responseType: 'blob' // Necessário para arquivos binários
      });

      const file = new File([response.data], doc.filename, { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(file) + '#' + encodeURIComponent(doc.filename);
      setPdfBlobUrl(blobUrl);
    } catch (error) {
      logger.error('Erro ao buscar o documento:', error);
      alert('Erro ao carregar o documento. Pode ter havido um problema de conexão ou o limite de requisições foi excedido.');
      setSelectedDoc(null);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const closeModal = () => {
    setSelectedDoc(null);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  const documents: DocumentInfo[] = [
    { title: 'Cartilha URGA', filename: 'Cartilha URGA.pdf', date: '2025' },
    { title: 'Destinação de Ativos', filename: 'Destinação de Ativos.pdf', date: '2024' },
    { title: 'Manual de Fluxos', filename: 'Manual de fluxos URGA.pdf', date: 'Atualizado' },
    { title: 'Portaria 37-2024', filename: 'Portaria 37-2024-gdgpcrn.pdf', date: '2024' }
  ];

  return (
    <div className="doc-container">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#09090b', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={28} color="#09090b" />
          Documentos
        </h2>
        <p style={{ color: '#71717a', fontSize: '15px', margin: 0 }}>
          Visualize e faça o download dos manuais e normativas do URGA.
        </p>
      </div>

      <div className="doc-grid">
        {documents.map((doc, idx) => (
          <div key={idx} className="doc-card" onClick={() => openDocument(doc)}>
            <div className="doc-icon-wrapper">
              <FileText size={32} />
            </div>
            <h3 className="doc-title">{doc.title}</h3>
            <span className="doc-meta">{doc.date}</span>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedDoc && (
        <div className="pdf-modal-overlay" onClick={closeModal}>
          <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <div className="pdf-modal-actions">
                <button
                  className="pdf-action-btn close-btn"
                  onClick={closeModal}
                  title="Fechar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="pdf-iframe-container">
              {isLoadingPdf ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', flexDirection: 'column', gap: '16px' }}>
                  <div className="loading-spinner"></div>
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>Carregando documento seguro...</span>
                </div>
              ) : pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  title={selectedDoc.title}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
