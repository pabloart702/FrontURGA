import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardContainer } from '../components/DashboardContainer';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardMetrics } from '../types/dashboard.types';
import * as AuthHook from '../../../hooks/useAuth';
import type { AuthContextType } from '../../../providers/authContext';

vi.mock('../api/dashboardApi', () => ({
  dashboardApi: {
    getMetrics: vi.fn(),
    getUserName: vi.fn(),
  },
}));

const metrics: DashboardMetrics = {
  apoiosSolicitados: 12,
  apoiosPrestados: 7,
  totalValorEstimado: 1500,
  delegaciasMaisSolicitam: [],
  tiposMaisApreendidos: [],
  resultadosMaisComuns: [],
};

const authValue: AuthContextType = {
  user: { id: '1', role: 'Administrador', departamento: 'TI' },
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
};

describe('DashboardContainer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthHook, 'useAuth').mockReturnValue(authValue);
  });

  it('exibe o estado de carregamento inicialmente', () => {
    vi.mocked(dashboardApi.getMetrics).mockReturnValue(new Promise(() => {}));
    vi.mocked(dashboardApi.getUserName).mockResolvedValue('Maria');

    render(<DashboardContainer />);

    expect(screen.getByText('Carregando estatísticas...')).toBeInTheDocument();
  });

  it('exibe métricas e nome do usuário em caso de sucesso', async () => {
    vi.mocked(dashboardApi.getMetrics).mockResolvedValue(metrics);
    vi.mocked(dashboardApi.getUserName).mockResolvedValue('Maria');

    render(<DashboardContainer />);

    expect(await screen.findByText('Bem-vindo, Maria.')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?1\.500,00/)).toBeInTheDocument();
    expect(screen.getAllByText('Nenhum dado disponível.')).toHaveLength(3);
  });

  it('continua exibindo as métricas se a busca do nome falhar', async () => {
    vi.mocked(dashboardApi.getMetrics).mockResolvedValue(metrics);
    vi.mocked(dashboardApi.getUserName).mockRejectedValue(new Error('falhou'));

    render(<DashboardContainer />);

    expect(await screen.findByText('Bem-vindo, Usuário.')).toBeInTheDocument();
  });

  it('exibe mensagem de erro se a busca das métricas falhar', async () => {
    vi.mocked(dashboardApi.getMetrics).mockRejectedValue(new Error('falhou'));
    vi.mocked(dashboardApi.getUserName).mockResolvedValue('Maria');

    render(<DashboardContainer />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os dados do dashboard.',
    );
  });
});
