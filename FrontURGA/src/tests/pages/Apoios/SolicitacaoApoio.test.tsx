import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { SolicitacaoApoio } from '../../../pages/Apoios/SolicitacaoApoio';
import * as AuthContext from '../../../contexts/AuthContext';
import { formsService } from '../../../services/forms';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../../services/forms', () => ({
  formsService: {
    createForm: vi.fn(),
  }
}));

// Mock do window.alert
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('SolicitacaoApoio Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { departamento: 'TI', role: 'Administrador' },
      login: vi.fn(),
      token: 'fake',
      logout: vi.fn(),
      isAuthenticated: true,
    } as any);
  });

  it('deve renderizar o formulário corretamente', () => {
    const { container } = render(
      <MemoryRouter>
        <SolicitacaoApoio />
      </MemoryRouter>
    );

    expect(screen.getByText('Nova Solicitação de Apoio')).toBeInTheDocument();
    expect(container.querySelector('input[name="operacao"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar formulário/i })).toBeInTheDocument();
  });

  it('deve permitir preencher e submeter o formulário com sucesso', async () => {
    vi.mocked(formsService.createForm).mockResolvedValueOnce({} as any);

    const { container } = render(
      <MemoryRouter>
        <SolicitacaoApoio />
      </MemoryRouter>
    );

    const deptInput = container.querySelector('input[name="departamento"]') as HTMLInputElement;
    const opInput = container.querySelector('input[name="operacao"]') as HTMLInputElement;
    const dataInput = container.querySelector('input[name="data_operacao"]') as HTMLInputElement;
    const procInput = container.querySelector('input[name="numero_processo"]') as HTMLInputElement;
    const medInput = container.querySelector('select[name="medida_cautelar"]') as HTMLSelectElement;
    const cautInput = container.querySelector('input[name="numero_cautelar"]') as HTMLInputElement;
    const valorInput = container.querySelector('input[name="valor_estimado"]') as HTMLInputElement;
    const descInput = container.querySelector('textarea[name="descricao_operacao"]') as HTMLTextAreaElement;

    fireEvent.change(deptInput, { target: { value: 'DEGEPOL' } });
    fireEvent.change(opInput, { target: { value: 'Operação Teste' } });
    fireEvent.change(dataInput, { target: { value: '12122026' } }); 
    fireEvent.change(procInput, { target: { value: '123' } });
    fireEvent.change(medInput, { target: { value: 'Bloqueio' } });
    fireEvent.change(cautInput, { target: { value: '321' } });
    fireEvent.change(valorInput, { target: { value: '1000' } });
    fireEvent.change(descInput, { target: { value: 'Teste descrição' } });

    // Checkbox click
    const apreensaoCheckbox = screen.getByLabelText('Apreensão');
    fireEvent.click(apreensaoCheckbox);

    const form = screen.getByRole('button', { name: /salvar formulário/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(formsService.createForm).toHaveBeenCalledTimes(1);
      expect(formsService.createForm).toHaveBeenCalledWith(expect.objectContaining({
        departamento: 'DEGEPOL',
        operacao: 'Operação Teste',
        data_operacao: '12/12/2026',
        valor_estimado: 10,
        descricao_operacao: 'Teste descrição',
        medida_cautelar: 'Bloqueio',
        numero_cautelar: '321',
        numero_processo: '123',
        tipos_apreendidos: [],
        resultados: ['Apreensão']
      }));
      expect(mockAlert).toHaveBeenCalledWith('Formulário cadastrado com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/apoios');
    });
  });

  it('deve exibir erro caso falhe a submissão', async () => {
    vi.mocked(formsService.createForm).mockRejectedValueOnce({
      response: { data: { mensagem: 'Erro simulado' } }
    });

    const { container } = render(
      <MemoryRouter>
        <SolicitacaoApoio />
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('input[name="departamento"]')!, { target: { value: 'DEGEPOL' } });
    fireEvent.change(container.querySelector('input[name="operacao"]')!, { target: { value: 'Operação Teste' } });
    fireEvent.change(container.querySelector('input[name="data_operacao"]')!, { target: { value: '12/12/2026' } });
    fireEvent.change(container.querySelector('input[name="numero_processo"]')!, { target: { value: '123' } });
    fireEvent.change(container.querySelector('select[name="medida_cautelar"]')!, { target: { value: 'Bloqueio' } });
    fireEvent.change(container.querySelector('input[name="numero_cautelar"]')!, { target: { value: '321' } });
    fireEvent.change(container.querySelector('input[name="valor_estimado"]')!, { target: { value: '1000' } });
    fireEvent.change(container.querySelector('textarea[name="descricao_operacao"]')!, { target: { value: 'Teste' } });

    const form = screen.getByRole('button', { name: /salvar formulário/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar formulário. Verifique os dados e tente novamente.')).toBeInTheDocument();
    });
  });
});
