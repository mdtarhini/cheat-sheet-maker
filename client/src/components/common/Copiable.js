import { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";

import Button from "./Button";
const Copiable = ({
  text = "copied",
  classNames,
  buttonText,
  isCompact = false,
  label,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    if (!copySuccess) {
      try {
        navigator.clipboard.writeText(text).then(() => {
          setCopySuccess(true);
        });
      } catch {}
    }
  };

  useEffect(() => {
    let timeOutId;
    if (copySuccess) {
      timeOutId = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeOutId);
    };
  }, [copySuccess]);

  if (isCompact) {
    return (
      <div className={classNames.container}>
        <Button type="none" className={classNames.button} onClick={handleCopy}>
          {copySuccess ? <AiOutlineCheck /> : buttonText}
        </Button>
        {label && <span className={classNames.label}>{label}</span>}
      </div>
    );
  }
  return (
    <div className={classNames.container}>
      <p className={classNames.text}>{text}</p>
      <Button type="text" className={classNames.button} onClick={handleCopy}>
        {copySuccess ? <AiOutlineCheck /> : buttonText}
      </Button>
    </div>
  );
};
export default Copiable;
