import { render, screen, waitFor } from '@testing-library/react';
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
});
