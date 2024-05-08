import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import ModalControls from '../types/modal-controls';


type ModalProps = {
    children: ReactNode;
    modalControls: ModalControls;
    header: string | ReactNode;
    isFullscreen?: boolean;
    onModalClosed?: () => void;
};

function Modal({
    children,
    modalControls,
    header,
    isFullscreen = false,
    onModalClosed,
}: ModalProps) {
    const { isVisible, closeModal } = modalControls;

    const onBackdropClicked = () => {
        onModalClosed?.();
        closeModal();
    };

    return isVisible
        ? ReactDOM.createPortal(
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isVisible ? 'visible' : 'invisible'
                    }`}
                onClick={onBackdropClicked}
            >
                <div
                    className={`relative p-0 ${isFullscreen ? 'w-full h-full' : 'max-w-lg max-h-3/4'} bg-white rounded shadow-lg`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="font-bold text-lg border-b-2">{header}</div>
                    <div className="overflow-auto">
                        {children}
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;
}

export default Modal;
