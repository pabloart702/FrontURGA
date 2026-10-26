import { OFFICIAL_DOCUMENTS } from '../constants/documents';
import { useDocumentViewer } from '../hooks/useDocumentViewer';
import { DocumentosView } from './DocumentosView';
import './Documentos.css';

/**
 * Container component: orquestra o hook de visualização de documentos e injeta na View.
 */
export function DocumentosContainer() {
  const { state, openDocument, closeDocument } = useDocumentViewer();

  return (
    <DocumentosView
      documents={OFFICIAL_DOCUMENTS}
      viewerState={state}
      onSelectDocument={openDocument}
      onCloseViewer={closeDocument}
    />
  );
}
