import { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { addRow, setCellTitle } from "../../actions/sheet-maker";
import Button from "../common/Button";
import CellRow from "./CellRow";

const CellMaker = ({ addRow, sheetMaker, setCellTitle }) => {
  const { cells, selectedCell } = sheetMaker;
  const addRowRef = useRef();

  const scrollToBottom = () => {
    if (addRowRef.current) {
      addRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [cells]);

  const selectedCellIndex = cells.findIndex((cell) => cell.id === selectedCell);

  return (
    <div className="w-full h-full bg-blue-100 flex flex-col space-y-3 items-start p-2 overflow-auto">
      <div className="hidden md:flex w-full justify-center items-center p-1 text-blue-500 font-semibold bg-blue-200 bg-opacity-50">
        <h2>Cell editor</h2>
      </div>

      {cells[selectedCellIndex] ? (
        <div className="w-full">
          <div className="flex items-center">
            <input
              name="cell-title"
              aria-label="cell-title"
              value={cells[selectedCellIndex]?.title}
              onChange={(e) => setCellTitle(selectedCell, e.target.value)}
              className="flex-grow h-12 p-2 border-2 focus-yellow"
              placeholder="cell title..."
            />
          </div>

          <div className="my-2 flex flex-col space-y-1">
            {cells[selectedCellIndex]?.rows.map((row, index) => {
              return (
                <CellRow
                  key={row.id}
                  rowId={row.id}
                  cellId={selectedCell}
                  cellIndex={selectedCellIndex}
                  rowIndex={index}
                />
              );
            })}
          </div>
          <div
            className="w-full flex justify-center items-center"
            ref={addRowRef}
          >
            <Button
              className="w-full font-bold"
              type="open"
              onClick={() => {
                addRow(selectedCell);
              }}
            >
              New row
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
const mapStateToProps = (state) => {
  return { sheetMaker: state.sheetMaker };
};
export default connect(mapStateToProps, {
  addRow,
  setCellTitle,
})(CellMaker);
