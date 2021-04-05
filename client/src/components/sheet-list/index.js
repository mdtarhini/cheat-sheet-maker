//react
import { connect } from "react-redux";
import { getSheets, onSortByValueChange } from "../../actions/sheets";
//redux
import { useEffect } from "react";
//components
import Button from "../common/Button";
import Card from "./Card";
import Heading from "../common/Heading";
import Loader from "../common/Loader";
import Select from "../common/Select";
//icons
import { AiOutlineWarning, AiOutlineCloseCircle } from "react-icons/ai";
//router
import { withRouter } from "react-router-dom";
import { FAVORITES_PATH, USER_PATH } from "../../routes/paths";
//others
import { filterAnObject } from "../../helpers";

const SheetList = ({
  getSheets,
  sheets,
  listTitle,
  onSortByValueChange,
  match,
  auth,
  ongoingOnServer,
}) => {
  const { errMsg, data, sortBy, thereIsMoreOnTheServer } = sheets;

  let filteredData;
  switch (match.path) {
    case `${USER_PATH}/:id`:
      filteredData = filterAnObject(
        data,
        (sheet) => sheet.authorId === match.params.id && sheet.published
      );
      break;
    case FAVORITES_PATH:
      filteredData = filterAnObject(
        data,
        (sheet) => sheet.favorites.includes(auth?.user?._id) && sheet.published
      );
      break;
    default:
      filteredData = filterAnObject(data, (sheet) => sheet.published);
  }
  filteredData = Object.keys(filteredData)
    .sort((a, b) => {
      switch (sortBy) {
        case "most-popular":
          return (
            filteredData[b].favorites.length - filteredData[a].favorites.length
          );
        case "most-recent":
        default:
          return (
            new Date(filteredData[b].publishedAt) -
            new Date(filteredData[a].publishedAt)
          );
      }
    })
    .reduce((accObj, sheetId) => {
      return { ...accObj, [sheetId]: data[sheetId] };
    }, {});

  useEffect(() => {
    getSheets({
      onlyIfCondition: true,
      match,
    });
  }, [getSheets, match]);

  const Toolbar = () => {
    const options = [
      { value: "most-recent", label: "Most recent" },
      { value: "most-popular", label: "Most popular" },
    ];

    return (
      <div className="w-full flex items-center flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <Heading level={2} text={listTitle} />
        {Object.keys(filteredData).length > 1 && (
          <div className="w-full md:w-64 flex items-center shadow-md h-10">
            <div className="flex-shrink-0 text-sm  h-full bg-gray-50 px-2 flex items-center rounded-l-md font-semibold text-blue-500">
              <label htmlFor="sortByOptions">Sort by</label>
            </div>

            <Select
              value={sortBy}
              id="sortByOptions"
              options={options}
              searchable={false}
              onValueChange={(value) => onSortByValueChange({ value, match })}
              buttonClassName="rounded-r-md "
            />
          </div>
        )}
      </div>
    );
  };

  const MainContent = () => {
    return (
      <div className="flex flex-col space-y-6">
        <div className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-content-between">
          {Object.keys(filteredData).map((sheetId) => {
            return <Card key={sheetId} sheet={filteredData[sheetId]} />;
          })}
        </div>
        <div className="w-full flex items-center justify-center pt-16">
          {thereIsMoreOnTheServer && (
            <Button
              type="open"
              className="rounded-full px-6"
              loading={ongoingOnServer["getting-more-sheets"]}
              onClick={() => {
                getSheets({ onlyIfCondition: false, match });
              }}
            >
              {ongoingOnServer["getting-more-sheets"]
                ? "Loading"
                : "Load more sheets"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const NoContent = () => {
    return (
      <div className="mt-16  w-full flex flex-col justify-center items-center text-blue-500 text-xl opacity-70">
        <AiOutlineWarning className="text-5xl" />
        <span className="">No sheets yet</span>
      </div>
    );
  };
  const ErrorContent = () => {
    return (
      <div className="mt-16  w-full flex flex-col justify-center items-center text-red-400 text-xl opacity-70">
        <AiOutlineCloseCircle className="text-5xl" />
        <span className="">{errMsg}</span>
      </div>
    );
  };

  return (
    <section>
      {Toolbar()}
      {Object.keys(filteredData).length === 0 &&
      ongoingOnServer["getting-first-sheets"] ? (
        <div className="p-24">
          <Loader />
        </div>
      ) : errMsg ? (
        ErrorContent()
      ) : Object.keys(filteredData).length === 0 ? (
        NoContent()
      ) : (
        MainContent()
      )}
    </section>
  );
};
const mapStateToProps = (state) => {
  return {
    sheets: state.sheets,
    auth: state.auth,
    ongoingOnServer: state.ongoingOnServer,
  };
};

export default connect(mapStateToProps, {
  getSheets,
  onSortByValueChange,
})(withRouter(SheetList));
