//components
import Button from "../common/Button";
import Share from "../share";
//custom hooks
import { useModal } from "../common/Modal/useModal";
//redux
import { connect } from "react-redux";
import { toggleFavorites } from "../../actions/sheets";
//router
import { Link, withRouter } from "react-router-dom";
import { USER_PATH, SHEET_PATH, SHEET_MAKER_PATH } from "../../routes/paths";
//icons
import { AiOutlineStar, AiFillStar, AiOutlineEdit } from "react-icons/ai";
import { VscCircleFilled } from "react-icons/vsc";
import { IoMdShareAlt } from "react-icons/io";
//others
import { getFormattedElpasedTime } from "../../helpers";

const Card = ({ sheet, auth, toggleFavorites, location }) => {
  const {
    title,
    cells,
    authorId,
    authorUsername,
    createdAt,
    publishedAt,
    favorites,
    published,
  } = sheet;

  const [RenderShareModal, showShareModal, hideShareModal] = useModal();

  const stringifyCellTitles = () => {
    return cells.map((cell) => cell.title).join(", ");
  };

  //Save the current path so it can be accessed later
  const toSheetMaker = {
    pathname: `${SHEET_MAKER_PATH}/${sheet._id}`,
    state: { prevPathname: location.pathname },
  };

  const infoBar = () => {
    return (
      <p className="truncate bg-gray-100 text-xs font-semibold text-blue-500 py-2 px-5">
        <span>
          {getFormattedElpasedTime(
            new Date(published ? publishedAt : createdAt)
          )}
        </span>
        <span>
          <VscCircleFilled className="text-xs inline" />
        </span>
        <span>
          by{" "}
          <Link
            className="underline focus-yellow"
            to={`${USER_PATH}/${authorId}`}
          >
            {authorUsername}
          </Link>
        </span>
      </p>
    );
  };
  const actionButtons = () => {
    if (published) {
      return (
        <div className="flex justify-between items-center text-lg text-gray-700 ">
          {/* Share */}
          <Button
            className="group w-1/2 h-9 bg-gray-200 rounded-bl-3xl border-r border-blue-200"
            title="share"
            type="none"
            onClick={showShareModal}
          >
            <IoMdShareAlt className="group-hover:text-blue-500" />
          </Button>
          {/* Editor */}
          {auth?.user?._id === sheet?.authorId && (
            <Link
              to={toSheetMaker}
              className="w-1/2 h-9 flex justify-center items-center bg-gray-200 border-l border-r border-blue-200 transition duration-300 ease-in-out hover:opacity-70 focus-yellow"
            >
              <span className="sr-only">Edit sheet</span>
              <AiOutlineEdit />
            </Link>
          )}
          {/* Add to favorites */}
          <Button
            className="group w-1/2 h-9 bg-gray-200 rounded-br-3xl border-l border-blue-200  space-x-0.5"
            type="none"
            title={
              !auth?.user
                ? ""
                : favorites.includes(auth?.user?._id)
                ? "remove from favorites"
                : "add to favorites"
            }
            disabled={!auth?.user}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorites(sheet._id);
            }}
          >
            {favorites.includes(auth?.user?._id) ? (
              <AiFillStar className="text-blue-500 " />
            ) : (
              <AiOutlineStar className="group-hover:text-blue-500" />
            )}
            <span className="text-xs">{favorites.length}</span>
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex justify-between items-center text-lg  text-gray-700 ">
          <p className="w-1/2 h-9 flex justify-center items-center bg-gray-200 font-semibold text-blue-500 text-xs">
            {getFormattedElpasedTime(new Date(createdAt))}
          </p>
          <Link
            to={toSheetMaker}
            className="w-1/2 h-9 flex justify-center items-center bg-gray-200 border-l border-blue-200 transition duration-300 ease-in-out hover:opacity-70 focus-yellow"
          >
            <span className="sr-only">Edit sheet</span>
            <AiOutlineEdit />
          </Link>
        </div>
      );
    }
  };
  return (
    <div
      className={`w-full rounded-3xl bg-white shadow-md text-gray-700 flex flex-col overflow-hidden relative 
      ${published ? "h-64" : "h-36"}`}
    >
      <Link
        to={published ? `${SHEET_PATH}/${sheet._id}` : toSheetMaker}
        className="flex-grow rounded-t-3xl transition duration-150 ease-in-out hover:bg-gray-50 transform  focus-yellow"
      >
        <div className="px-5 py-4">
          <h3 className="text-lg font-semibold line-clamp-2">{title} </h3>

          {published && (
            <p className="leading-relaxed font-semibold text-gray-500 text-sm mt-1 line-clamp-4 ">
              <span className=" text-blue-500 text-sm">
                {cells.length} cell{cells.length !== 1 && "s"}:{" "}
              </span>
              {stringifyCellTitles()}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-auto flex-shrink-0">
        {published && infoBar()}
        {actionButtons()}
      </div>
      <RenderShareModal>
        <Share
          hide={hideShareModal}
          sheetId={sheet?._id}
          sheetTitle={sheet?.title}
        />
      </RenderShareModal>
    </div>
  );
};
const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps, { toggleFavorites })(withRouter(Card));
