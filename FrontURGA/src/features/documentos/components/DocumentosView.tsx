import { FileText } from 'lucide-react';
import type { DocumentInfo, DocumentViewerState } from '../types/documentos.types';
import { DocumentCard } from './DocumentCard';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface DocumentosViewProps {
  documents: readonly DocumentInfo[];
  viewerState: DocumentViewerState;
  onSelectDocument: (doc: DocumentInfo) => void;
  onCloseViewer: () => void;
}

/**
 * Componente puramente de apresentação (Presentational Component)
 * Responsável apenas pela renderização do layout e dispatch de eventos.
 */
export function DocumentosView({
  documents,
  viewerState,
  onSelectDocument,
  onCloseViewer,
}: DocumentosViewProps) {
  return (
    <div className="doc-container">
      <header className="doc-header">
        <h2 className="doc-header-title">
          <FileText size={28} color="#09090b" className="doc-title-icon" />
          <span>Documentos</span>
        </h2>
        <p className="doc-header-subtitle">
          Visualize e faça o download dos manuais e normativas do URGA.
        </p>
      </header>

      <section className="doc-grid" aria-label="Lista de manuais e normativas">
        {documents.map((doc) => (
          <DocumentCard key={doc.filename} document={doc} onSelect={onSelectDocument} />
        ))}
      </section>

      <DocumentPreviewModal state={viewerState} onClose={onCloseViewer} />
    </div>
  );
}
