import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { ModalContext, useModalContext } from './modalContext';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Componente composto para Modais utilizando a tag nativa `<dialog>`,
 * com Context API interna para evitar prop drilling.
 */
export function Modal({ isOpen, onClose, children, className = '', ariaLabel }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        dialog.setAttribute('open', '');
      }
    } else {
      if (typeof dialog.close === 'function') {
        if (dialog.open) {
          dialog.close();
        }
      } else {
        dialog.removeAttribute('open');
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    // Fecha apenas se o clique foi diretamente no backdrop do dialog
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContext.Provider value={{ isOpen, onClose, titleId }}>
      <dialog
        ref={dialogRef}
        className={`app-modal ${className}`.trim()}
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
        onClick={handleBackdropClick}
        onCancel={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        {children}
      </dialog>
    </ModalContext.Provider>
  );
}

function ModalHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`app-modal-header ${className}`.trim()}>{children}</div>;
}

function ModalTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { titleId } = useModalContext();
  return (
    <h3 id={titleId} className={`app-modal-title ${className}`.trim()}>
      {children}
    </h3>
  );
}

function ModalCloseButton({ className = '', title = 'Fechar' }: { className?: string; title?: string }) {
  const { onClose } = useModalContext();
  return (
    <button
      type="button"
      className={`app-modal-close-btn ${className}`.trim()}
      onClick={onClose}
      title={title}
      aria-label={title}
    >
      <X size={20} />
    </button>
  );
}

function ModalBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`app-modal-body ${className}`.trim()}>{children}</div>;
}

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.CloseButton = ModalCloseButton;
Modal.Body = ModalBody;
