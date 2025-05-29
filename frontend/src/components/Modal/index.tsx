import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import { IconCross } from '@src/common/assets/icons';
import { useOnEventOutside } from '@src/common/hooks';
import ImageNext from '@src/components/ImageNext';

interface IModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  layoutClassName?: string;
  overlayClassName?: string;
  crossClassName?: string;
  clickOutsideEnabled?: boolean;
  withoutClose?: boolean;
};

const Modal: FC<IModalProps> = ({
  id,
  isOpen,
  onClose,
  children,
  overlayClassName,
  layoutClassName,
  crossClassName,
  clickOutsideEnabled = true,
  withoutClose
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  const ref = useRef(null);
  const closeButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsBrowser(true);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = 'auto';
      setIsBrowser(false);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleCloseClick = (): void => {
    onClose();
  };

  const handleOutsideClick = (): void => {
    clickOutsideEnabled && onClose();
  };

  useOnEventOutside(ref, handleOutsideClick, 'mousedown');

  const modalContent = isOpen ? (
    <div
      id={id ? ('modal-div-' + id) : 'modal-div'}
      className={cn(
        'flex h-screen p-4 items-center justify-center bg-pmdGrayDark bg-opacity-70',
        overlayClassName
      )}
    >
      <div
        ref={ref}
        className={cn('w-max mx-auto flex flex-col justify-center align-middle relative rounded bg-white', layoutClassName)}
      >
        {!withoutClose &&
          <a
            ref={closeButtonRef}
            id={id ? ('modal-a-' + id) : 'modal-a'}
            title='Close'
            onClick={handleCloseClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCloseClick();
              }
            }}
            tabIndex={0}
          >
            <ImageNext
              src={IconCross}
              className={cn(
                'absolute top-[12px] right-[16px] z-[60] rounded-md cursor-pointer hover:opacity-70',
                crossClassName,
              )}
            />
          </a>
        }
        {children}
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById('modal-root') as HTMLElement
    );
  };

  return null;
};

export default Modal;
