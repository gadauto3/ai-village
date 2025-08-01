import React from 'react';
import ModalPopup from './ModalPopup';
import ModalPopupCelebrate from './ModalPopupCelebrate';
import ModalPopupEndGame from './ModalPopupEndGame';

// Component responsible for rendering all modal types
const ModalManager = ({ 
  modalState, 
  onCloseCelebrateModal,
  onCloseEndGameModal,
  onCloseNameModal,
  onCloseGenericModal,
}) => {
  return (
    <>
      {/* Celebrate Modal */}
      {modalState.isCelebrateModalShowing && (
        <ModalPopupCelebrate
          closeModal={onCloseCelebrateModal}
        />
      )}

      {/* Name Input Modal */}
      {modalState.isNameModalShowing && (
        <ModalPopup
          isVisible={modalState.isNameModalShowing}
          closeModal={onCloseNameModal}
          config={modalState.modalConfig}
        />
      )}

      {/* Generic Modal */}
      {modalState.isGenericModalShowing && (
        <ModalPopup
          isVisible={modalState.isGenericModalShowing}
          closeModal={onCloseGenericModal}
          config={modalState.modalConfig}
        />
      )}

      {/* End Game Modal */}
      {modalState.isEndGameModalShowing && (
        <ModalPopupEndGame
          closeModal={onCloseEndGameModal}
        />
      )}
    </>
  );
};

export default React.memo(ModalManager);