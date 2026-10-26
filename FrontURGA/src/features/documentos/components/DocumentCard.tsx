import { FileText } from 'lucide-react';
import type { DocumentInfo } from '../types/documentos.types';

interface DocumentCardProps {
  document: DocumentInfo;
  onSelect: (doc: DocumentInfo) => void;
}

export function DocumentCard({ document, onSelect }: DocumentCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="doc-card"
      onClick={() => onSelect(document)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(document);
        }
      }}
      aria-label={`Visualizar documento ${document.title}`}
    >
      <div className="doc-icon-wrapper" aria-hidden="true">
        <FileText size={32} />
      </div>
      <h3 className="doc-title">{document.title}</h3>
      <span className="doc-meta">{document.date}</span>
    </div>
  );
}
