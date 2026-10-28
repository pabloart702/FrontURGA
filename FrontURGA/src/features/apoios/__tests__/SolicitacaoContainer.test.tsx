import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { SolicitacaoContainer } from '../components/SolicitacaoContainer';
import * as AuthContext from '../../../hooks/useAuth';
import { apoiosApi } from '../api/apoiosApi';
import type { User, Form } from '../../../types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../api/apoiosApi', () => ({
  apoiosApi: {
    createForm: vi.fn(),
  },
}));

const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('SolicitacaoContainer Component', () => {
  const mockNavigate = vi.fn();
  const mockUser: User = {
    id: '1',
    nome: 'Admin',
    email: 'admin@teste.com',
    cpf: '12345678900',
    matricula: '001',
    cargo: 'Delegado',
    role: 'Administrador',
    departamento: 'DEGEPOL',
    status: 'Ativo',
  };

  const createdMockForm: Form = {
    id: '10',
    departamento: 'DEGEPOL',
    operacao: 'Operação Teste',
    data_operacao: '12/12/2026',
    numero_processo: '123',
    medida_cautelar: 'Bloqueio',
    numero_cautelar: '321',
    valor_estimado: 10,
    descricao_operacao: 'Teste descrição',
    resultados: ['Apreensão'],
    tipos_apreendidos: [],
    status: 'pendente',
    criador: '1',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('deve renderizar o formulário corretamente', () => {
    const { container } = render(
      <MemoryRouter>
        <SolicitacaoContainer />
      </MemoryRouter>
    );

    expect(screen.getByText('Nova Solicitação de Apoio')).toBeInTheDocument();
    expect(container.querySelector('input[name="operacao"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar formulário/i })).toBeInTheDocument();
  });

  it('deve permitir preencher e submeter o formulário com sucesso', async () => {
    vi.mocked(apoiosApi.createForm).mockResolvedValueOnce(createdMockForm);

    const { container } = render(
      <MemoryRouter>
        <SolicitacaoContainer />
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

    const apreensaoCheckbox = screen.getByLabelText('Apreensão');
    fireEvent.click(apreensaoCheckbox);

    const form = screen.getByRole('button', { name: /salvar formulário/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(apoiosApi.createForm).toHaveBeenCalledTimes(1);
      expect(apoiosApi.createForm).toHaveBeenCalledWith(
        expect.objectContaining({
          departamento: 'DEGEPOL',
          operacao: 'Operação Teste',
          data_operacao: '12/12/2026',
          valor_estimado: 10,
          descricao_operacao: 'Teste descrição',
          medida_cautelar: 'Bloqueio',
          numero_cautelar: '321',
          numero_processo: '123',
          tipos_apreendidos: [],
          resultados: ['Apreensão'],
        })
      );
      expect(mockAlert).toHaveBeenCalledWith('Formulário cadastrado com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/apoios');
    });
  });

  it('deve exibir erro caso falhe a submissão', async () => {
    vi.mocked(apoiosApi.createForm).mockRejectedValueOnce({
      response: { data: { message: 'Erro ao criar formulário' } },
    });

    const { container } = render(
      <MemoryRouter>
        <SolicitacaoContainer />
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('input[name="departamento"]')!, {
      target: { value: 'DEGEPOL' },
    });
    fireEvent.change(container.querySelector('input[name="operacao"]')!, {
      target: { value: 'Operação Teste' },
    });
    fireEvent.change(container.querySelector('input[name="data_operacao"]')!, {
      target: { value: '12/12/2026' },
    });
    fireEvent.change(container.querySelector('input[name="numero_processo"]')!, {
      target: { value: '123' },
    });
    fireEvent.change(container.querySelector('select[name="medida_cautelar"]')!, {
      target: { value: 'Bloqueio' },
    });
    fireEvent.change(container.querySelector('input[name="numero_cautelar"]')!, {
      target: { value: '321' },
    });
    fireEvent.change(container.querySelector('input[name="valor_estimado"]')!, {
      target: { value: '1000' },
    });
    fireEvent.change(container.querySelector('textarea[name="descricao_operacao"]')!, {
      target: { value: 'Teste' },
    });

    const form = screen.getByRole('button', { name: /salvar formulário/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar formulário')).toBeInTheDocument();
    });
  });

  it('deve limpar a mensagem de erro atomicamente ao tentar submeter novamente (Discriminated Union)', async () => {
    vi.mocked(apoiosApi.createForm).mockRejectedValueOnce(new Error('Erro inicial'));

    const { container } = render(
      <MemoryRouter>
        <SolicitacaoContainer />
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('input[name="departamento"]')!, {
      target: { value: 'DEGEPOL' },
    });
    fireEvent.change(container.querySelector('input[name="operacao"]')!, {
      target: { value: 'Operação Resubmissao' },
    });
    fireEvent.change(container.querySelector('input[name="data_operacao"]')!, {
      target: { value: '15/10/2026' },
    });
    fireEvent.change(container.querySelector('select[name="medida_cautelar"]')!, {
      target: { value: 'Bloqueio' },
    });
    fireEvent.change(container.querySelector('input[name="valor_estimado"]')!, {
      target: { value: '500' },
    });
    fireEvent.change(container.querySelector('textarea[name="descricao_operacao"]')!, {
      target: { value: 'Desc' },
    });

    const form = screen.getByRole('button', { name: /salvar formulário/i }).closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/erro ao criar formulário/i)).toBeInTheDocument();
    });

    // Simula uma segunda tentativa com requisição em andamento
    let resolvePromise: (value: Form) => void;
    const pendingPromise = new Promise<Form>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(apoiosApi.createForm).mockReturnValueOnce(pendingPromise);

    fireEvent.submit(form);

    // Imediatamente ao submeter novamente, o erro DEVE desaparecer atomicamente (estado loading)
    expect(screen.queryByText(/erro ao criar formulário/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvando\.\.\./i })).toBeDisabled();

    // Conclui a promise pendente
    resolvePromise!(createdMockForm);
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Formulário cadastrado com sucesso!');
    });
  });

  it('deve validar obrigatoriedade de data válida ou seleção de "Não informar data"', async () => {
    const { container } = render(
      <MemoryRouter>
        <SolicitacaoContainer />
      </MemoryRouter>
    );

    fireEvent.change(container.querySelector('input[name="departamento"]')!, {
      target: { value: 'DEGEPOL' },
    });
    fireEvent.change(container.querySelector('input[name="operacao"]')!, {
      target: { value: 'Operação Sem Data' },
    });
    fireEvent.change(container.querySelector('select[name="medida_cautelar"]')!, {
      target: { value: 'Bloqueio' },
    });
    fireEvent.change(container.querySelector('input[name="valor_estimado"]')!, {
      target: { value: '100' },
    });
    fireEvent.change(container.querySelector('textarea[name="descricao_operacao"]')!, {
      target: { value: 'Desc' },
    });

    const form = screen.getByRole('button', { name: /salvar formulário/i }).closest('form')!;
    fireEvent.submit(form);

    // Deve exibir erro de validação da data
    expect(
      screen.getByText('Informe a data da operação ou marque a opção "Não informar data".')
    ).toBeInTheDocument();
    expect(apoiosApi.createForm).not.toHaveBeenCalled();

    // Digita data inválida
    const dateInput = container.querySelector('input[name="data_operacao"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '99/99/9999' } });
    fireEvent.submit(form);
    expect(
      screen.getByText('Data da operação com dia, mês ou ano inválido.')
    ).toBeInTheDocument();
    expect(apoiosApi.createForm).not.toHaveBeenCalled();

    // Agora marca "Não informar data"
    const semDataCheckbox = screen.getByLabelText(/não informar data/i);
    fireEvent.click(semDataCheckbox);
    expect(dateInput).toBeDisabled();

    vi.mocked(apoiosApi.createForm).mockResolvedValueOnce(createdMockForm);
    fireEvent.submit(form);

    await waitFor(() => {
      expect(apoiosApi.createForm).toHaveBeenCalledWith(
        expect.objectContaining({
          departamento: 'DEGEPOL',
          operacao: 'Operação Sem Data',
          data_operacao: undefined,
        })
      );
    });
  });

  it('deve permitir digitar a data da operação manualmente com máscara DD/MM/AAAA', () => {
    const { container } = render(
      <MemoryRouter>
        <SolicitacaoContainer />
      </MemoryRouter>
    );

    const dateTextInput = container.querySelector(
      'input[name="data_operacao"]'
    ) as HTMLInputElement;

    expect(dateTextInput).toBeInTheDocument();
    expect(dateTextInput).not.toBeDisabled();

    // Digitação de 8 dígitos numéricos simulando o usuário digitando 25102026
    fireEvent.change(dateTextInput, { target: { value: '25102026' } });
    expect(dateTextInput.value).toBe('25/10/2026');

    // Digitação parcial simulando 2 dígitos
    fireEvent.change(dateTextInput, { target: { value: '25' } });
    expect(dateTextInput.value).toBe('25');

    // Digitação parcial simulando 4 dígitos
    fireEvent.change(dateTextInput, { target: { value: '2510' } });
    expect(dateTextInput.value).toBe('25/10');
  });

  it('deve permitir abrir o seletor de data pelo botão de calendário e preencher a data', () => {
    const showPickerMock = vi.fn();
    HTMLInputElement.prototype.showPicker = showPickerMock;

    const { container } = render(
      <MemoryRouter>
        <SolicitacaoContainer />
      </MemoryRouter>
    );

    const calendarBtn = screen.getByRole('button', { name: /abrir calendário/i });
    expect(calendarBtn).toBeInTheDocument();

    fireEvent.click(calendarBtn);
    expect(showPickerMock).toHaveBeenCalled();

    // Simula a escolha de uma data pelo native picker
    const hiddenDateInput = container.querySelector('.hidden-date-picker') as HTMLInputElement;
    fireEvent.change(hiddenDateInput, { target: { value: '2026-11-15' } });

    const dateTextInput = container.querySelector(
      'input[name="data_operacao"]'
    ) as HTMLInputElement;
    expect(dateTextInput.value).toBe('15/11/2026');
  });
});
