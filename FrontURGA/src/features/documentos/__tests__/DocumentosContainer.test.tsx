import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { documentosApi } from '../api/documentosApi';
import { DocumentosContainer } from '../components/DocumentosContainer';

vi.mock('../api/documentosApi', () => ({
  documentosApi: {
    fetchDocumentBlob: vi.fn(),
  },
}));

describe('DocumentosContainer', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-pdf-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    globalThis.URL.createObjectURL = originalCreateObjectURL;
    globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('deve renderizar a lista de documentos oficiais', () => {
    render(<DocumentosContainer />);

    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByText('Cartilha URGA')).toBeInTheDocument();
    expect(screen.getByText('Destinação de Ativos')).toBeInTheDocument();
    expect(screen.getByText('Manual de Fluxos')).toBeInTheDocument();
    expect(screen.getByText('Portaria 37-2024')).toBeInTheDocument();
  });

  it('deve carregar e exibir o documento selecionado no modal', async () => {
    const mockBlob = new Blob(['%PDF-1.4 mock content'], { type: 'application/pdf' });
    vi.mocked(documentosApi.fetchDocumentBlob).mockResolvedValue(mockBlob);

    render(<DocumentosContainer />);

    const cartilhaCard = screen.getByRole('button', { name: /visualizar documento cartilha urga/i });
    fireEvent.click(cartilhaCard);

    expect(documentosApi.fetchDocumentBlob).toHaveBeenCalledWith('Cartilha URGA.pdf');

    await waitFor(() => {
      const iframe = screen.getByTitle('Cartilha URGA');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('blob:mock-pdf-url'));
    });
  });

  it('deve fechar o modal e revogar o blobUrl ao clicar no botão de fechar', async () => {
    const mockBlob = new Blob(['%PDF-1.4 mock content'], { type: 'application/pdf' });
    vi.mocked(documentosApi.fetchDocumentBlob).mockResolvedValue(mockBlob);

    render(<DocumentosContainer />);

    fireEvent.click(screen.getByRole('button', { name: /visualizar documento cartilha urga/i }));

    await waitFor(() => {
      expect(screen.getByTitle('Cartilha URGA')).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeBtn);

    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(
      expect.stringContaining('blob:mock-pdf-url'),
    );
    expect(screen.queryByTitle('Cartilha URGA')).not.toBeInTheDocument();
  });

  it('deve exibir mensagem de erro caso o download falhe', async () => {
    vi.mocked(documentosApi.fetchDocumentBlob).mockRejectedValue(new Error('Network error'));

    render(<DocumentosContainer />);

    fireEvent.click(screen.getByRole('button', { name: /visualizar documento cartilha urga/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Erro ao carregar o documento/i)).toBeInTheDocument();
    });
  });
});
