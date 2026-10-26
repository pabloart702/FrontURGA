import api from '../../../api/axios';

export const documentosApi = {
  /**
   * Baixa o arquivo PDF do backend em formato binário Blob.
   */
  fetchDocumentBlob: async (filename: string): Promise<Blob> => {
    const encodedFilename = encodeURIComponent(filename);
    const response = await api.get<Blob>(`/documentos/${encodedFilename}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
