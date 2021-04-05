import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { addCell } from "../../actions/sheet-maker";
import Button from "../common/Button";
import CellInList from "./CellInList";
import { AiOutlinePlusCircle } from "react-icons/ai";

const CellList = ({ sheetMaker, addCell }) => {
  const { cells } = sheetMaker;
  const addCellRef = useRef();

  const scrollToBottom = () => {
    addCellRef.current.scrollIntoView(true, { behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [cells.length]);

  const AddCellButton = () => {
    return (
      <div className="flex justify-center" ref={addCellRef}>
        <Button className="font-bold" type="text" onClick={addCell}>
          <AiOutlinePlusCircle className="text-2xl" />
          <span>New Cell</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full flex-shrink-0 h-full items-start md:w-56 max-w-full bg-blue-100 p-2  flex-col space-y-3 overflow-auto">
      <div className="hidden md:flex justify-center items-center p-1 text-blue-500 font-semibold bg-blue-200 bg-opacity-50">
        <h2>Cells</h2>
      </div>
      {cells.map((cell, index) => {
        return <CellInList key={cell.id} cellId={cell.id} cellIndex={index} />;
      })}
      {AddCellButton()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { sheetMaker: state.sheetMaker };
};
export default connect(mapStateToProps, {
  addCell,
})(CellList);
