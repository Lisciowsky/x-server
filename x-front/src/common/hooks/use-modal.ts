import { useState } from 'react';

type ModalOptions = {
  onModalOpened?: () => void;
  onModalClosed?: () => void;
};

const useModal = ({ onModalClosed, onModalOpened }: ModalOptions) => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => {
    setIsVisible(true);
    if (onModalOpened) onModalOpened();
  };

  const closeModal = () => {
    setIsVisible(false);
    if (onModalClosed) onModalClosed();
  };

  return { isVisible, openModal, closeModal };
};

export default useModal;
