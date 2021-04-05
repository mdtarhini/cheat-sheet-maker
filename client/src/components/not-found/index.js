import Logo from "../navbar/Logo";
import { Link } from "react-router-dom";
import { HOME_PATH, NEW_SHEET_PATH } from "../../routes/paths";

const cellRows = [
  <Link to={HOME_PATH} className="underline">
    Go to home page and browse sheets
  </Link>,
  <Link to={NEW_SHEET_PATH} className="underline ">
    Make a new sheet
  </Link>,
  <a
    href="https://github.com/mdtarhini/cheat-sheet-maker"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    Check out this website's source code on github
  </a>,
];
const NotFound = () => {
  return (
    <main className="bg-gray-50 w-screen h-screen flex flex-col space-y-4 md:space-y-16 items-center px-2 py-10">
      <Logo large />
      <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col">
        <div className="w-full rounded-t-xl p-4 flex justify-center items-center bg-blue-500 text-white font-bold text-lg md:text-xl">
          404 Page not found
        </div>
        {cellRows.map((row, index) => {
          return (
            <div
              key={index}
              className={` flex md:text-lg px-2 py-4 
              ${index % 2 === 0 ? "bg-blue-200" : "bg-blue-100"}
              ${index === cellRows.length - 1 ? "rounded-b-xl" : ""}`}
            >
              {row}
            </div>
          );
        })}
      </div>
    </main>
  );
};
export default NotFound;
