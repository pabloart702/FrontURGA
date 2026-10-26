import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import type { AsyncState } from '../../../types/async';
import { asyncError, asyncLoading, asyncSuccess } from '../../../types/async';
import { logger } from '../../../utils/logger';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardData } from '../types/dashboard.types';

const LOAD_ERROR_MESSAGE = 'Não foi possível carregar os dados do dashboard.';

/**
 * Carrega as métricas do dashboard e o nome do usuário logado.
 * Falha ao buscar o nome não impede a exibição das métricas.
 */
export function useDashboard(): AsyncState<DashboardData> {
  const { user } = useAuth();
  const userId = user?.id;
  const [state, setState] = useState<AsyncState<DashboardData>>(asyncLoading);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const [metrics, userName] = await Promise.all([
          dashboardApi.getMetrics(),
          userId ? dashboardApi.getUserName().catch(() => null) : Promise.resolve(null),
        ]);
        if (!ignore) setState(asyncSuccess({ metrics, userName }));
      } catch (error) {
        logger.error('Erro ao buscar métricas:', error);
        if (!ignore) setState(asyncError(LOAD_ERROR_MESSAGE));
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [userId]);

  return state;
}
