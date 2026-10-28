import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecureImage } from '../SecureImage';
import api from '../../utils/httpClient';

vi.mock('../../utils/httpClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('SecureImage Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('deve exibir fallback quando houver erro no carregamento da imagem', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Erro 404'));

    render(
      <SecureImage
        src="/uploads/profiles/foto-inexistente.jpg"
        alt="Foto"
        fallback={<span data-testid="fallback">Avatar</span>}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });

  it('deve renderizar a imagem com a URL do blob quando o download for bem-sucedido', async () => {
    const mockBlob = new Blob(['fake image data'], { type: 'image/png' });
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockBlob });

    render(
      <SecureImage
        src="/uploads/profiles/foto-sucesso.png"
        alt="Foto de Perfil"
      />
    );

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'blob:mock-url');
    });
  });

  it('deve abrir modal de zoom no centro da tela (portal em document.body) ao clicar em imagem com zoomable', async () => {
    const mockBlob = new Blob(['fake image data'], { type: 'image/png' });
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockBlob });

    // Renderiza dentro de um container simulando um elemento com transform
    render(
      <div style={{ transform: 'translateY(-50%)', position: 'relative' }}>
        <SecureImage
          src="/uploads/profiles/foto-zoom.png"
          alt="Foto com Zoom"
          zoomable={true}
        />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    const img = screen.getByRole('img');
    fireEvent.click(img);

    // O overlay deve ser renderizado e ser filho direto de document.body (graças ao createPortal)
    const overlay = screen.getByTestId('zoom-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay.parentElement).toBe(document.body);

    // Deve conter os estilos de centralização na tela cheia
    expect(overlay).toHaveStyle({
      position: 'fixed',
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    // Deve conter a imagem em zoom
    expect(screen.getByAltText('Zoomed')).toBeInTheDocument();

    // Deve fechar ao clicar no botão de fechar
    const closeBtn = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('zoom-overlay')).not.toBeInTheDocument();
  });
});
