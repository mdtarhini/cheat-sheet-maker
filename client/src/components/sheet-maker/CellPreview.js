import Cell from "../cell";
import { connect } from "react-redux";

const CellPreview = ({ sheetMaker }) => {
  const { cells, selectedCell, theme, corners, borders } = sheetMaker;
  const cellIndex = cells.findIndex((cell) => cell.id === selectedCell);

  return (
    <div className="w-full h-full bg-blue-100 flex flex-col space-y-3 mb-10 p-2 overflow-auto">
      <div className="flex justify-center items-center p-1 text-blue-500 font-semibold bg-blue-200 bg-opacity-50">
        <h2>Cell preview</h2>
      </div>
      {cells[cellIndex] && (
        <Cell
          makerMode
          theme={theme}
          corners={corners}
          borders={borders}
          title={cells[cellIndex].title}
          rows={cells[cellIndex].rows}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { sheetMaker: state.sheetMaker };
};
export default connect(mapStateToProps)(CellPreview);
