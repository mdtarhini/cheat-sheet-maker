import { Link } from "react-router-dom";
import { HOME_PATH } from "../../routes/paths";
const Logo = ({ large = false }) => {
  return (
    <Link
      to={HOME_PATH}
      className={`group font-bold font-mono  grid grid-cols-5  text-blue-500 cursor-pointer text-2xl w-28 focus-yellow 
      ${large ? "md:text-6xl md:w-64" : ""}`}
    >
      {["c", "h", "e", "a", "t", "s", "h", "e", "e", "t"].map((char, index) => {
        return (
          <div
            className={`
            border-blue-300 flex justify-center transition duration-300 ease-in-out group-hover:border-opacity-0
            ${
              index % 5 === 0
                ? "border-l-0"
                : large
                ? "border-l md:border-l-4"
                : "border-l"
            } 
            ${
              index >= 5
                ? "border-b-0"
                : large
                ? "border-b md:border-b-4"
                : "border-b"
            } 
            `}
            key={index}
          >
            {char}
          </div>
        );
      })}
    </Link>
  );
};
export default Logo;
