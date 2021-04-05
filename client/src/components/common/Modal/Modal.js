import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ children }) => {
  const renderModal = () => {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen py-4 px-4 sm:block sm:p-0">
          <div className="fixed inset-0 ">
            <div className="absolute inset-0 bg-gray-500  opacity-75"></div>
          </div>
          <div className="w-full h-full flex items-center justify-center pt-20">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const domEl = document.getElementById("modal-root");
  if (!domEl) return null;
  return ReactDOM.createPortal(<div>{renderModal()}</div>, domEl);
};

export default Modal;
