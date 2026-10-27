import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecuperometroContainer } from '../components/RecuperometroContainer';

describe('RecuperometroContainer', () => {
  it('deve renderizar a tela de recuperação de ativos em construção', () => {
    render(<RecuperometroContainer />);

    expect(screen.getByRole('heading', { level: 2, name: 'Recuperômetro' })).toBeInTheDocument();
    expect(
      screen.getByText(/painel estatístico de recuperação de ativos\. esta página está em construção\./i)
    ).toBeInTheDocument();
  });
});
