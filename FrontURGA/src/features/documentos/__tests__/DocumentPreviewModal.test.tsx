import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import type { DocumentViewerState } from '../types/documentos.types';

describe('DocumentPreviewModal', () => {
  const mockDoc = {
    title: 'Cartilha URGA',
    filename: 'Cartilha URGA.pdf',
    date: '2025',
  };

  const mockSuccessState: DocumentViewerState = {
    status: 'success',
    doc: mockDoc,
    blobUrl: 'blob:https://urga.onrender.com/mock-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não deve renderizar nada quando o status for idle', () => {
    const { container } = render(
      <DocumentPreviewModal state={{ status: 'idle' }} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve exibir indicador de carregamento quando o status for loading', () => {
    render(
      <DocumentPreviewModal
        state={{ status: 'loading', doc: mockDoc }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('Carregando documento seguro...')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando o status for error', () => {
    render(
      <DocumentPreviewModal
        state={{ status: 'error', doc: mockDoc, message: 'Falha no download' }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Falha no download')).toBeInTheDocument();
  });

  it('deve renderizar iframe no desktop', () => {
    render(<DocumentPreviewModal state={mockSuccessState} onClose={vi.fn()} />);

    // Verifica renderização do iframe
    const iframe = screen.getByTitle('Cartilha URGA');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'blob:https://urga.onrender.com/mock-id');
  });

  it('deve exibir interface nativa de download no mobile e permitir alternar para visualização embutida', () => {
    const userAgentSpy = vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Linux; Android 14; Mobile; rv:124.0) Gecko/124.0 Firefox/124.0',
    );
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<DocumentPreviewModal state={mockSuccessState} onClose={vi.fn()} />);

    // Não deve renderizar iframe por padrão no mobile
    expect(screen.queryByTitle('Cartilha URGA')).not.toBeInTheDocument();

    // Deve renderizar cartão com botão mobile
    const mobileBtn = screen.getByRole('button', { name: /baixar e abrir documento no celular/i });
    expect(mobileBtn).toBeInTheDocument();
    expect(screen.getByText(/Baixe o arquivo para poder visualizar/i)).toBeInTheDocument();

    // Dispara o download mobile
    fireEvent.click(mobileBtn);
    expect(clickSpy).toHaveBeenCalled();
    expect(screen.getByText('Download Iniciado!')).toBeInTheDocument();

    // Permite forçar iframe se o usuário desejar
    const toggleIframeBtn = screen.getByRole('button', { name: /tentar visualização embutida no navegador/i });
    fireEvent.click(toggleIframeBtn);

    expect(screen.getByTitle('Cartilha URGA')).toBeInTheDocument();
    expect(screen.getByText('Visualização embutida forçada')).toBeInTheDocument();

    // Permite voltar ao modo recomendado
    const returnBtn = screen.getByRole('button', { name: /voltar ao modo recomendado/i });
    fireEvent.click(returnBtn);

    expect(screen.queryByTitle('Cartilha URGA')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /baixar e abrir documento no celular/i })).toBeInTheDocument();

    clickSpy.mockRestore();
    userAgentSpy.mockRestore();
  });
});
