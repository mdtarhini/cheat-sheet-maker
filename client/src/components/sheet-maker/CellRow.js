//react
import { useEffect, useRef } from "react";
//custom hooks
import { useModal } from "../common/Modal/useModal";
//components
import Button from "../common/Button";
import Select from "../common/Select";
//redux
import { connect } from "react-redux";
import {
  moveRowDown,
  moveRowUp,
  deleteRow,
  updateRow,
} from "../../actions/sheet-maker";
//icons
import {
  AiOutlineCaretDown,
  AiOutlineCaretUp,
  AiFillDelete,
} from "react-icons/ai";
import { HiCode } from "react-icons/hi";
import { highlightingLangOptions } from "../../sheet-settings-constants";
const CellRow = ({
  rowId,
  rowIndex,
  cellId,
  cellIndex,
  moveRowDown,
  moveRowUp,
  updateRow,
  deleteRow,
  sheetMaker,
}) => {
  const { cells } = sheetMaker;
  const [RenderDeleteModal, showDeleteModal] = useModal();
  const value = cells[cellIndex].rows[rowIndex].value;
  const lang = cells[cellIndex].rows[rowIndex].lang;

  const textAreaRef = useRef();
  useEffect(() => {
    let numberOfLineBreaks = value ? (value.match(/\n/g) || []).length + 1 : 3;
    if (numberOfLineBreaks < 3) {
      numberOfLineBreaks = 3;
    }
    // lines * line-height + padding
    let newHeight = numberOfLineBreaks * 20 + 20;
    textAreaRef.current.style.height = newHeight + "px";
  }, [value]);
  const langSelect = () => {
    const options = Object.keys(highlightingLangOptions).map((langKey) => {
      return { value: langKey, label: highlightingLangOptions[langKey].label };
    });
    return (
      <div className="w-44 p-px h-full flex items-center">
        <div className="h-full flex items-center justify-center p-1 bg-gray-500 text-gray-200 border-r border-gray-400">
          <HiCode />
        </div>
        <div className="h-full">
          <Select
            value={lang}
            options={options}
            searchable={true}
            onValueChange={(newLang) =>
              updateRow(rowId, cellId, { lang: newLang })
            }
            buttonClassName="rounded-none bg-gray-500 text-white placeholder-white"
            menuClassName="text-xs"
          />
        </div>
      </div>
    );
  };
  const upperBar = () => {
    return (
      <div className="w-full h-8 flex items-center justify-between bg-gray-600">
        <div className="flex items-center justify-start space-x-px h-full">
          <Button
            className="bg-gray-500 text-white w-8 h-full"
            type="none"
            onClick={() => moveRowUp(cellId, rowIndex)}
            title="move up"
          >
            <AiOutlineCaretUp />
          </Button>
          <Button
            className="bg-gray-500 text-white w-8 h-full"
            type="none"
            onClick={() => moveRowDown(cellId, rowIndex)}
            title="move down"
          >
            <AiOutlineCaretDown />
          </Button>
        </div>

        {/```/.test(value) && langSelect()}

        <Button
          className="bg-red-500 text-white w-8 h-full"
          type="none"
          title="delete"
          onClick={() => {
            if (value) {
              showDeleteModal();
            } else {
              deleteRow(cellId, rowId);
            }
          }}
        >
          <AiFillDelete />
        </Button>
      </div>
    );
  };

  const TextArea = () => {
    return (
      <textarea
        ref={textAreaRef}
        autoFocus
        value={value}
        onChange={(e) => updateRow(rowId, cellId, { value: e.target.value })}
        className="w-full p-3 focus-yellow resize-none leading-5"
        placeholder="row content in markdown"
      />
    );
  };
  return (
    <div className="w-full border-2">
      {upperBar()}

      {TextArea()}
      <RenderDeleteModal
        onOk={() => {
          deleteRow(cellId, rowId);
        }}
        icon={<AiFillDelete />}
        title={<span>Are you sure you want to remove this row ? </span>}
        okText={"Remove"}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return { sheetMaker: state.sheetMaker };
};
export default connect(mapStateToProps, {
  moveRowDown,
  moveRowUp,
  updateRow,
  deleteRow,
})(CellRow);
