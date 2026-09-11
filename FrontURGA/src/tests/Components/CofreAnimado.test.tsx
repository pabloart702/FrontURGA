import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CofreAnimado } from '../../components/CofreAnimado';

describe('CofreAnimado Component', () => {
    it('deve renderizar o cofre na tela', () => {
        render(<CofreAnimado />);
        const cofreElement = screen.getByRole('img', { name: /cofre/i });
        expect(cofreElement).toBeInTheDocument();
    });
});
