//react
import { useEffect, useState, useRef } from "react";
//custom hooks
import { useWindowsSize } from "../../custom-hooks";
import { useModal } from "../common/Modal/useModal";
//redux
import { connect } from "react-redux";
import { getOneSheet, toggleFavorites } from "../../actions/sheets";
//components
import Layout from "../common/Layout";
import Loader from "../common/Loader";
import Alert from "../common/Alert";
import Cell from "../cell";
import Button from "../common/Button";
import Share from "../share";
//icons
import { IoIosArrowBack, IoMdShareAlt } from "react-icons/io";
import { AiFillStar, AiOutlineStar, AiOutlineEdit } from "react-icons/ai";
//router
import { Link } from "react-router-dom";
import history from "../../history";
import {
  SHEET_PREVIEW_PATH,
  SHEET_MAKER_PATH,
  USER_PATH,
} from "../../routes/paths";
//others
import {
  cellThemeOptions,
  cellCornerOptions,
  cellBorderOptions,
} from "../../sheet-settings-constants";

const Sheet = ({
  match,
  sheets,
  getOneSheet,
  auth,
  ongoingOnServer,
  toggleFavorites,
}) => {
  const [RenderShareModal, showShareModal, hideShareModal] = useModal();
  /*
  Before displaying the cells, measure the client height of each of the cells so they can be distributed in column.
  The measuring state variable indcicate which cell is being measured (by index not by id)
  The measurements state varibale is a an object that will hold the height of each cell {cellId: height}
  todo: Check if there is a css solution to do so without relying on measuring the cells
  */
  const [measuring, setMeasuring] = useState(0);
  const [measurements, setMeasurements] = useState({});

  const windowSize = useWindowsSize();
  const windowWidth = windowSize?.width;

  const sheetId = match.params.id;
  const sheet = sheets?.data ? sheets.data[sheetId] : null;

  useEffect(() => {
    if (!sheets?.data[sheetId]) {
      getOneSheet(sheetId);
    }
  }, [sheetId, sheets?.data, getOneSheet]);

  const [nCols, setNCols] = useState(null);

  useEffect(() => {
    const maxCols = Number(sheet?.maxCols);
    let optimalNCols = maxCols;
    if (optimalNCols > 2 && windowWidth < 1280) {
      optimalNCols = 2;
    }
    setNCols(optimalNCols);
  }, [sheet, windowWidth]);

  const cells = sheet?.cells.map((cell, index) => {
    return { ...cell, id: index };
  });

  const measuringCellRef = useRef();

  useEffect(() => {
    if (measuring >= 0) {
      if (cells && measuringCellRef.current) {
        setMeasurements((prevMeasurements) => {
          return {
            ...prevMeasurements,
            [measuringCellRef.current.id]:
              measuringCellRef.current.clientHeight,
          };
        });
        setMeasuring(measuring + 1);
        if (measuring === cells.length - 1) {
          setMeasuring(-1);
        }
      }
    }
  }, [measuring, cells]);

  const distributedCells = () => {
    if (!cells) return;

    //Define placeholder for the n columns
    let arrayOfCols = [...Array(nCols).keys()].map(() => []);

    let arrayOfWideCells = [];

    //get an approximation for col height
    const totalHeight = Object.keys(measurements).reduce(
      (heightsSum, currentCellKey) => heightsSum + measurements[currentCellKey],
      0
    );
    const maxColHeight = totalHeight / nCols;

    let currentColIndex = 0;
    let colHeight = 0;

    Object.keys(measurements).forEach((cellKey) => {
      const cellHeight = measurements[cellKey];

      if (
        colHeight + cellHeight > maxColHeight &&
        currentColIndex < nCols - 1
      ) {
        currentColIndex++;
        colHeight = 0;
      }

      colHeight += cellHeight;

      arrayOfCols[currentColIndex].push(
        cells[cells.findIndex((cell) => cell.id.toString() === cellKey)]
      );
    });

    const getColHeight = (col) => {
      return col.reduce(
        (heightsSum, currentCell) => heightsSum + measurements[currentCell.id],
        0
      );
    };
    const IsLayoutValid = () => {
      // this function return true if the columns are sorted in terms of height (with a tolearnce factor of 5%)
      for (let iCol = 0; iCol < nCols - 1; iCol++) {
        if (
          1.05 * getColHeight(arrayOfCols[iCol]) <
          getColHeight(arrayOfCols[iCol + 1])
        ) {
          return false;
        }
      }
      return true;
    };

    //if the height of the n+1 col is > n's, move a cell from n+1 to n
    while (!IsLayoutValid()) {
      for (let iCol = 0; iCol < nCols - 1; iCol++) {
        if (
          1.05 * getColHeight(arrayOfCols[iCol]) <
          getColHeight(arrayOfCols[iCol + 1])
        ) {
          arrayOfCols[iCol].push(arrayOfCols[iCol + 1].shift());
        }
      }
    }

    //in case the first column is larger than the second by an amount larger than the first cell, move the first cell to the array of wide cells
    if (nCols > 1) {
      if (
        getColHeight(arrayOfCols[0]) - measurements[0] >
        getColHeight(arrayOfCols[1])
      ) {
        arrayOfWideCells.push(arrayOfCols[0].shift());
      }
    }

    return [arrayOfWideCells, arrayOfCols];
  };

  const MeasuringContent = () => {
    if (!sheet || !cells || !nCols) {
      return null;
    }
    const { theme, corners, borders } = sheet;
    const cell = cells[measuring];

    return (
      <div
        ref={measuringCellRef}
        id={cell.id}
        className={`opacity-0 md:px-1 lg:px-3 xl:px-4 ${
          nCols === 1
            ? "lg:w-full"
            : nCols === 2
            ? "lg:w-1/2"
            : "lg:w-1/2 xl:w-1/3"
        }`}
      >
        <Cell
          makerMode={false}
          title={cell.title}
          theme={theme}
          corners={corners}
          borders={borders}
          rows={cell.rows}
        />
      </div>
    );
  };
  const LoadingContent = () => {
    return <Loader />;
  };
  const ErrorContent = () => {
    return <Alert type="error" text={sheets?.errMsg} />;
  };

  const TitleBar = () => {
    const { title, favorites, theme, corners, borders, authorId } = sheet;
    const ActionButtons = () => {
      if (match.path.includes(SHEET_PREVIEW_PATH)) {
        return null;
      }
      return (
        <div className="flex space-x-3">
          {auth?.user?._id === authorId && (
            <Button
              type="none"
              className={` w-7 h-7 md:w-10 md:h-10 md:text-xl rounded-full bg-${cellThemeOptions[theme]}-200 text-${cellThemeOptions[theme]}-500 `}
              title="edit"
              onClick={() => {
                history.push(`${SHEET_MAKER_PATH}/${sheetId}`);
              }}
            >
              <AiOutlineEdit />
            </Button>
          )}
          {auth?.user && (
            <Button
              className={` w-7 h-7 md:w-10 md:h-10 md:text-xl rounded-full bg-${cellThemeOptions[theme]}-200 text-${cellThemeOptions[theme]}-500 `}
              type="none"
              title={
                !auth?.user
                  ? ""
                  : favorites.includes(auth?.user?._id)
                  ? "remove from favorites"
                  : "add to favorites"
              }
              onClick={() => {
                toggleFavorites(sheetId);
              }}
            >
              {favorites.includes(auth?.user?._id) ? (
                <AiFillStar />
              ) : (
                <AiOutlineStar />
              )}
            </Button>
          )}
          <Button
            className={` w-7 h-7 md:w-10 md:h-10 md:text-xl rounded-full bg-${cellThemeOptions[theme]}-200 text-${cellThemeOptions[theme]}-500 `}
            type="none"
            onClick={showShareModal}
          >
            <IoMdShareAlt />
          </Button>
          <RenderShareModal>
            <Share hide={hideShareModal} sheetId={sheetId} sheetTitle={title} />
          </RenderShareModal>
        </div>
      );
    };
    return (
      <div
        className={`w-full px-2 py-3 md:px-6 text-white flex flex-col items-center md:flex-row  md:justify-between overflow-hidden 
      border${cellBorderOptions[borders]} 
      bg-${cellThemeOptions[theme]}-500 
      border-${cellThemeOptions[theme]}-600 
      rounded-${cellCornerOptions[corners]}`}
      >
        <div className="flex flex-col space-y-2">
          <h1 className={`text-xl font-bold md:text-2xl lg:text-3xl`}>
            {title}
          </h1>
          <div className="flex space-x-5 items-center justify-center md:justify-start">
            <p className="font-semibold">
              By{" "}
              <Link to={`${USER_PATH}/${sheet.authorId}`} className="underline">
                {sheet.authorUsername}
              </Link>
            </p>
            <div className="md:hidden">{ActionButtons()}</div>
          </div>
        </div>
        <div className="hidden md:block">{ActionButtons()}</div>
      </div>
    );
  };
  const MainContent = () => {
    if (!sheet) return null;
    const { theme, corners, borders } = sheet;

    const [arrayOfWideCells, arrayOfCols] = distributedCells();

    return (
      <div className="pb-10">
        {match.path === `${SHEET_PREVIEW_PATH}/:id` && (
          <div className="w-full mb-4 flex items-center justify-center">
            <Link
              className="flex space-x-2 py-2 px-3 items-center bg-blue-500 text-white font-semibold rounded-md focus-yellow"
              to={`${SHEET_MAKER_PATH}/${sheetId}`}
            >
              <IoIosArrowBack />
              <span>Back to editor</span>
            </Link>
          </div>
        )}
        <main className="rounded-sm shadow-sm py-10 px-2 md:px-5 lg:px-10 bg-white">
          {TitleBar()}

          <section className="w-full mt-4 flex flex-col space-y-5">
            {arrayOfWideCells[0] && (
              <div className="w-full flex flex-col space-y-5">
                {arrayOfWideCells.map((cell) => {
                  return (
                    <Cell
                      makerMode={false}
                      title={cell.title}
                      key={cell.id}
                      theme={theme}
                      corners={corners}
                      borders={borders}
                      rows={cell.rows}
                    />
                  );
                })}
              </div>
            )}
            <div className="md:mt-8 flex flex-wrap lg:flex-nowrap space-y-5 lg:space-y-0 space-x-0 lg:space-x-6 xl:space-x-8">
              {arrayOfCols.map((col, colIndex) => {
                return (
                  <div
                    key={colIndex}
                    className={`w-full flex flex-col space-y-5 ${
                      nCols === 1
                        ? "lg:w-full"
                        : nCols === 2
                        ? "lg:w-1/2"
                        : "lg:w-1/2 xl:w-1/3"
                    }`}
                  >
                    {col.map((cell) => {
                      return (
                        <Cell
                          makerMode={false}
                          title={cell.title}
                          key={cell.id}
                          theme={theme}
                          corners={corners}
                          borders={borders}
                          rows={cell.rows}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  };

  return (
    <Layout>
      {ongoingOnServer["getting-one-sheet"]
        ? LoadingContent()
        : sheets.errMsg
        ? ErrorContent()
        : measuring >= 0
        ? MeasuringContent()
        : MainContent()}
    </Layout>
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
  getOneSheet,
  toggleFavorites,
})(Sheet);
