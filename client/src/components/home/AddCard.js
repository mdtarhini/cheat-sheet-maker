import { Link } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { NEW_SHEET_PATH } from "../../routes/paths";
const AddCard = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-content-between">
      <div className="w-full h-32 md:h-64 p-2 md:p-4 rounded-3xl bg-white shadow-md">
        <Link
          to={NEW_SHEET_PATH}
          className="w-full h-full rounded-3xl bg-blue-100 shadow-sm text-blue-500 text-2xl flex-col font-bold flex justify-center items-center focus-yellow transition duration-300 ease-in-out hover:bg-opacity-70"
        >
          <AiOutlinePlusCircle className="text-5xl" />
          <span>Create new</span>
        </Link>
      </div>
    </div>
  );
};
export default AddCard;
