export interface DashboardMetricItem {
  _id: string;
  count: number;
}

/** Resposta de GET /forms/dashboard. */
export interface DashboardMetrics {
  apoiosPrestados: number;
  apoiosSolicitados: number;
  totalValorEstimado: number;
  delegaciasMaisSolicitam: DashboardMetricItem[];
  tiposMaisApreendidos: DashboardMetricItem[];
  resultadosMaisComuns: DashboardMetricItem[];
}

/** Dados consolidados que a tela de dashboard consome. */
export interface DashboardData {
  metrics: DashboardMetrics;
  userName: string | null;
}
