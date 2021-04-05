//components
import Button from "../common/Button";
//redux
import { connect } from "react-redux";
import {
  moveCellDown,
  moveCellUp,
  deleteCell,
  selectCell,
} from "../../actions/sheet-maker";
//custom hooks
import { useModal } from "../common/Modal/useModal";
//icons
import {
  AiOutlineCaretDown,
  AiOutlineCaretUp,
  AiFillDelete,
} from "react-icons/ai";

const CellInList = ({
  cellIndex,
  cellId,
  moveCellDown,
  moveCellUp,
  deleteCell,
  selectCell,
  sheetMaker,
}) => {
  const [RenderDeleteModal, showDeleteModal] = useModal();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (
      cells[cellIndex].title === "" &&
      cells[cellIndex].rows.every((row) => row.value === "")
    ) {
      deleteCell(cellId);
    } else {
      showDeleteModal();
    }
  };
  const { cells, selectedCell } = sheetMaker;
  return (
    <div
      className="w-full flex items-center space-x-3 cursor-pointer"
      key={cellId}
      onClick={() => selectCell(cellId)}
    >
      <span className="text-blue-500 w-3 text-sm font-bold">
        {cellIndex + 1}
      </span>
      <div
        className={`flex-grow bg-gray-100 h-24 flex items-center overflow-hidden 
        ${selectedCell === cellId ? "border-2 border-blue-500" : ""}`}
      >
        <div className="w-8 flex-shrink-0 h-full bg-white flex flex-col justify-between items-center py-1">
          <div className="w-full flex flex-col space-y-1 items-center">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                moveCellUp(cellIndex);
              }}
              type="none"
              className="p-1 rounded-full bg-blue-100 text-gray-700"
              title="Move cell down"
            >
              <AiOutlineCaretUp />
            </Button>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                moveCellDown(cellIndex);
              }}
              className="p-1 rounded-full bg-blue-100 text-gray-700"
              type="none"
              title="Move cell up"
            >
              <AiOutlineCaretDown />
            </Button>
          </div>
          <Button
            onClick={handleDelete}
            type="none"
            className="p-1 rounded-full bg-red-600 text-gray-50"
            title="delete cell"
          >
            <AiFillDelete />
          </Button>
        </div>
        <p className="flex-grow px-2">{cells[cellIndex].title}</p>
      </div>
      <RenderDeleteModal
        onOk={() => {
          deleteCell(cellId);
        }}
        icon={<AiFillDelete />}
        title={<span>Are you sure you want to delete this cell ? </span>}
        okText={"Yes"}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return { sheetMaker: state.sheetMaker };
};
export default connect(mapStateToProps, {
  moveCellDown,
  moveCellUp,

  deleteCell,
  selectCell,
})(CellInList);
