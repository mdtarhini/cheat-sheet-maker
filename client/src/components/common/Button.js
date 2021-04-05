import { AiOutlineLoading3Quarters } from "react-icons/ai";
const classNamePerType = {
  primary: "rounded-md bg-blue-500 text-white p-2 border-2 border-blue-500",
  secondary: "bg-blue-100 text-blue-500 font-bold text-sm rounded-md px-4 py-2",
  text: "text-blue-500 p-2 ",
  open: "p-2 rounded-md border-2 border-blue-500 text-blue-500",
  none: "",
};

const transitionClassNamePerType = {
  primary: "transition duration-300 ease-in-out transform hover:bg-blue-400",
  secondary:
    "transition duration-300 ease-in-out transform hover:bg-blue-500 hover:text-white",
  text: "transition duration-300 ease-in-out hover:text-blue-700",
  open:
    "transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white",
  none: "transition duration-300 ease-in-out hover:opacity-70",
};

const commonClassName =
  "flex items-center space-x-1 justify-center focus-yellow";

const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  loading = false,
  color,
  title = "",
  type = "primary",
}) => {
  // Compose a classname using the props + the default ones depending on the type
  let compClassName = `${commonClassName} ${
    classNamePerType[type]
  } ${className} ${
    disabled ? "cursor-not-allowed" : transitionClassNamePerType[type]
  }`;
  if (color) {
    compClassName = compClassName.replaceAll("blue", color);
  }
  return (
    <button
      className={compClassName}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
    >
      {loading && <AiOutlineLoading3Quarters className="animate-spin mr-1" />}
      {children}
    </button>
  );
};
export default Button;
