import React, { useState } from "react";

import Modal from "./Modal";
import GenericModal from "./GenericModal";

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  const RenderModal = ({
    children,
    text,
    title,
    okText,
    onOk,
    icon,
    loading,
  }) => (
    <React.Fragment>
      {isVisible && (
        <Modal>
          {children ? (
            children
          ) : (
            <GenericModal
              onCancel={hideModal}
              text={text}
              title={title}
              loading={loading}
              okText={okText}
              onOk={onOk}
              icon={icon}
            />
          )}
        </Modal>
      )}
    </React.Fragment>
  );

  return [RenderModal, showModal, hideModal];
};
