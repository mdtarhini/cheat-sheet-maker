import {
  AiOutlineCloseCircle,
  AiOutlineCheckCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";
const Alert = ({ type, text }) => {
  const options = {
    info: {
      className: "bg-blue-100 border-blue-400 ",
      icon: <AiOutlineInfoCircle className="text-blue-500" />,
    },
    success: {
      className: "bg-yellow-green border-green-400 ",
      icon: <AiOutlineCheckCircle className="text-green-500" />,
    },
    warning: {
      className: "bg-yellow-100 border-yellow-400 ",
      icon: <AiOutlineWarning className="text-yellow-500" />,
    },
    error: {
      className: "bg-red-100 border-red-400 ",
      icon: <AiOutlineCloseCircle className="text-red-500" />,
    },
  };

  return (
    <div
      className={`w-full border p-3 md:p-7 flex items-center space-x-2 md:space-x-6 
      ${type ? options[type].className : ""}`}
    >
      <div className="flex-shrink-0 text-2xl md:text-4xl">
        {options[type].icon}
      </div>
      <p className="md:text-lg">{text}</p>
    </div>
  );
};
export default Alert;
