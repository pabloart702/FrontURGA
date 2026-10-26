export interface DocumentInfo {
  title: string;
  filename: string;
  date: string;
}

/**
 * Estado mutuamente exclusivo para o visualizador de documento PDF (Discriminated Union).
 */
export type DocumentViewerState =
  | { status: 'idle' }
  | { status: 'loading'; doc: DocumentInfo }
  | { status: 'success'; doc: DocumentInfo; blobUrl: string }
  | { status: 'error'; doc: DocumentInfo; message: string };
