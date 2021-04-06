//custom hooks
import { useModal } from "../common/Modal/useModal";
import { useMenuToggler } from "../../custom-hooks/";
//components
import Button from "../common/Button";
//redux
import { connect } from "react-redux";
import { updateSheet, deleteSheet } from "../../actions/sheet-maker";
//router
import { withRouter } from "react-router-dom";
import history from "../../history";
import { SHEET_SETTINGS_PATH, HOME_PATH } from "../../routes/paths";
//icons
import {
  AiOutlineMenu,
  AiOutlineCheck,
  AiFillSetting,
  AiFillEye,
  AiFillSave,
  AiOutlineClose,
  AiFillDelete,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
const Header = ({
  sheetId,
  sheetMaker,
  ongoingOnServer,
  updateSheet,
  deleteSheet,
  location,
}) => {
  const { cells, title, published } = sheetMaker;

  const [expanded, toggleExpanded, headerRef] = useMenuToggler();
  const [RenderDeleteModal, showDeleteModal] = useModal();

  const ActionBar = () => {
    const actions = [
      {
        id: "settings",
        label: "Settings",
        color: "gray",
        func: () => {
          history.push(`${SHEET_SETTINGS_PATH}/${sheetId}`);
        },
        icon: <AiFillSetting />,
      },
      {
        id: "save",
        label: "Save and quit",
        color: "gray",
        func: () => {
          updateSheet(
            sheetId,
            { cells },
            location?.state?.prevPathname || HOME_PATH
          );
        },
        icon: <AiFillSave />,
      },

      {
        id: "preview",
        label: "Sheet Preview",
        color: "gray",
        func: () => {
          updateSheet(sheetId, { cells }, `/sheet-preview/${sheetId}`);
        },
        icon: <AiFillEye />,
      },
      !published
        ? {
            id: "publish",
            label: "Publish",
            color: "green",
            func: () => {
              updateSheet(sheetId, { cells, published: true }, "/");
            },
            icon: <AiOutlineCheck />,
          }
        : {
            id: "unpublish",
            label: "Unpublish",
            color: "yellow",
            func: () => {
              updateSheet(
                sheetId,
                { cells, published: false },
                location?.state?.prevPathname || HOME_PATH
              );
            },
            icon: <AiOutlineClose />,
          },
      {
        id: "delete",
        label: "Delete",
        color: "red",
        func: () => {
          showDeleteModal();
        },
        icon: <AiFillDelete />,
      },
    ];
    if (ongoingOnServer["saving-sheet"]) {
      return (
        <p className="text-blue-500 font-semibold">
          <AiOutlineLoading3Quarters className="animate-spin inline-flex" />{" "}
          {"  "} saving...
        </p>
      );
    }
    return (
      <ul className="w-full flex-shrink-0 flex flex-col items-center md:flex-row  md:justify-start space-y-2 md:space-y-0 md:space-x-2">
        {actions.map((action) => {
          if (!action) return null;
          return (
            <li key={action.id}>
              <Button
                className="w-40 md:w-auto h-9 md:h-auto px-1.5 py-0.5 text-sm font-semibold"
                type="primary"
                color={action.color}
                onClick={action.func}
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    );
  };

  const expander = () => {
    return (
      <Button
        className="text-xl text-blue-500"
        type="text"
        onClick={toggleExpanded}
      >
        <span className="sr-only">Expand menu bar</span>
        <AiOutlineMenu />
      </Button>
    );
  };
  const expandedHeader = () => {
    return (
      <div
        className="absolute z-10 md:hidden top-10 left-0 w-full bg-blue-100 shadow-xl px-3"
        ref={headerRef}
      >
        <div className="my-4">{ActionBar()}</div>
      </div>
    );
  };
  return (
    <div className="bg-blue-100 h-8 md:h-auto flex items-center justify-between md:flex-wrap py-5 px-2 md:px-6  relative">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-700 md:my-2">
        {title}
      </h1>
      <div className="hidden md:block">{ActionBar()}</div>
      <div className="block md:hidden">{expander()}</div>
      {expanded && expandedHeader()}

      <RenderDeleteModal
        onOk={() =>
          deleteSheet(sheetId, location?.state?.prevPathname || HOME_PATH)
        }
        icon={<AiFillDelete />}
        loading={ongoingOnServer["deleting-sheet"]}
        title={<span>Are you sure you want to delete this sheet ? </span>}
        okText={"Yes"}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    sheetMaker: state.sheetMaker,
    auth: state.auth,
    ongoingOnServer: state.ongoingOnServer,
  };
};
export default connect(mapStateToProps, { updateSheet, deleteSheet })(
  withRouter(Header)
);
