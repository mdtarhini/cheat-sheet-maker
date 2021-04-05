import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
const Input = ({
  name,
  id,
  required,
  inputType,
  onChange,
  value,
  placeholder,
  extra,
}) => {
  const [type, setType] = useState("text");
  const showAndHidePassword = (event) => {
    event.preventDefault();
    if (inputType === "password") {
      setType((currentType) => {
        return currentType === "text" ? "password" : "text";
      });
    }
  };
  useEffect(() => {
    setType(inputType);
  }, [inputType]);
  const className = `w-full h-12 px-2 pr-10 rounded-md  placeholder-gray-400  bg-white text-lg focus-yellow hover:bg-gray-50 ${extra}`;
  return (
    <div className="relative flex items-center w-full">
      <input
        required={required}
        autoComplete="off"
        id={id}
        type={type ? type : "text"}
        onChange={onChange}
        value={value}
        name={name}
        className={className}
        placeholder={placeholder}
      />
      {inputType === "password" && (
        <div
          className="absolute right-1 text-lg p-1 rounded-full hover:bg-blue-50 text-gray-700"
          onClick={showAndHidePassword}
        >
          {type === "password" ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </div>
      )}
    </div>
  );
};
export default Input;
