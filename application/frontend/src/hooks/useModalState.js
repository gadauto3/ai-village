import { useState, useCallback } from 'react';

const useModalState = () => {
  const [isCelebrateModalShowing, setIsCelebrateModalShowing] = useState(false);
  const [isEndGameModalShowing, setIsEndGameModalShowing] = useState(false);
  const [isNameModalShowing, setIsNameModalShowing] = useState(false);
  const [isGenericModalShowing, setIsGenericModalShowing] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    textToDisplay: "Default message",
    buttonText: "Ok",
    onClose: () => {}
  });

  const showCelebrateModal = useCallback(() => {
    setIsCelebrateModalShowing(true);
  }, []);

  const hideCelebrateModal = useCallback(() => {
    setIsCelebrateModalShowing(false);
  }, []);

  const showEndGameModal = useCallback(() => {
    setIsEndGameModalShowing(true);
  }, []);

  const hideEndGameModal = useCallback(() => {
    setIsEndGameModalShowing(false);
  }, []);

  const showNameModal = useCallback((config) => {
    setModalConfig(config);
    setIsNameModalShowing(true);
  }, []);

  const hideNameModal = useCallback(() => {
    setIsNameModalShowing(false);
  }, []);

  const showGenericModal = useCallback((config) => {
    setModalConfig(config);
    setIsGenericModalShowing(true);
  }, []);

  const hideGenericModal = useCallback(() => {
    setIsGenericModalShowing(false);
  }, []);

  const hideAllModals = useCallback(() => {
    setIsCelebrateModalShowing(false);
    setIsEndGameModalShowing(false);
    setIsNameModalShowing(false);
    setIsGenericModalShowing(false);
  }, []);

  return {
    // State
    isCelebrateModalShowing,
    isEndGameModalShowing,
    isNameModalShowing,
    isGenericModalShowing,
    modalConfig,
    
    // Actions
    showCelebrateModal,
    hideCelebrateModal,
    showEndGameModal,
    hideEndGameModal,
    showNameModal,
    hideNameModal,
    showGenericModal,
    hideGenericModal,
    hideAllModals,
  };
};

export default useModalState;