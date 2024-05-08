import { useState } from "react";
import ModalControls from "@/common/types/modal-controls";
import Modal from "@/common/components/modal";
import { mediaStates, MediaStates } from "@/common/consts/media-states";

type MediaModalProps = {
  modalControls: ModalControls;
};

function MediaModal({
  modalControls
}: MediaModalProps) {

  const [currentState, setCurrentState] = useState<MediaStates>(
    mediaStates.MEDIA_UPLOAD
  );

  const getModalHeader = () => {
    return (
      <>
        <span>
          <b>Export concepts - </b>
        </span>
        <span>This is header</span>
      </>
    );
  };

  const getStateComponent = () => {
    switch (currentState) {
      case mediaStates.MEDIA_UPLOAD:
        return (
          <MediaUpload
            performExport={performExport}
            onLogConfirmed={onLogConfirmed}
            glossaryUid={glossaryId}
          />
        )
      case mediaStates.ERROR:
        return <MediaError mediaResult={mediaResult} errorMessage={errorMessage} />;
      default:
        return <MediaError mediaResult={mediaResult} errorMessage={errorMessage} />;
    }
  };


  return (
    <Modal
      modalControls={modalControls}
      header={getModalHeader()}
      isFullscreen={false}
      onModalClosed={() => { }}
    >
      {getStateComponent()}
    </Modal>
  )
}

