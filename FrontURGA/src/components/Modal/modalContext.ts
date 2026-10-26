import { createContext, useContext } from 'react';

export interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModalContext(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Componentes de Modal.* devem ser usados dentro de <Modal>.');
  }
  return context;
}
