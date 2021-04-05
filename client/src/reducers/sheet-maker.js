import {
  MOVE_CELL_UP,
  MOVE_CELL_DOWN,
  DELETE_CELL,
  ADD_CELL,
  SET_CELL_TITLE,
  MOVE_ROW_UP,
  MOVE_ROW_DOWN,
  DELETE_ROW,
  ADD_ROW,
  UPDATE_ROW,
  SELECT_CELL,
  SET_SHEET_SUCCESS,
  DELETE_SHEET_SUCCESS,
} from "../actions/sheet-maker/types";

const initialState = {
  selectedCell: 0,
};
const sheetMakerReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_SHEET_SUCCESS:
      return initialState;
    case SET_SHEET_SUCCESS:
      return { selectedCell: action.payload.cells[0]?.id, ...action.payload };
    case ADD_CELL: {
      const newId =
        state.cells.length === 0
          ? 0
          : Math.max(...state.cells.map((cell) => cell.id)) + 1;
      return {
        ...state,
        selectedCell: newId,
        cells: [
          ...state.cells,
          {
            id: newId,
            title: "",
            rows: [{ id: 0, value: "", lang: state.defaultLang }],
          },
        ],
      };
    }

    case MOVE_CELL_UP: {
      let index = action.payload;
      if (index === 0) return state;
      return {
        ...state,
        cells: [
          ...state.cells.slice(0, index - 1),
          state.cells[index],
          state.cells[index - 1],
          ...state.cells.slice(index + 1),
        ],
      };
    }

    case MOVE_CELL_DOWN: {
      const index = action.payload;
      if (index === state.cells.length - 1) return state;
      return {
        ...state,
        cells: [
          ...state.cells.slice(0, index),
          state.cells[index + 1],
          state.cells[index],
          ...state.cells.slice(index + 2),
        ],
      };
    }
    case SET_CELL_TITLE: {
      const { cellId, value } = action.payload;
      const newCells = state.cells.map((cell) => {
        if (cell.id === cellId) {
          return { ...cell, title: value };
        }
        return cell;
      });
      return { ...state, cells: newCells };
    }
    case DELETE_CELL: {
      //find the index of the cell to retrieve the id of the cell before it
      const cellId = action.payload;
      const cellIndex = state.cells.findIndex((cell) => cell.id === cellId);
      const prevCellId =
        state.cells[cellIndex === 0 ? 1 : cellIndex - 1]?.id || 0;

      return {
        ...state,
        selectedCell: prevCellId,
        cells: state.cells.filter((cell) => cell.id !== cellId),
      };
    }

    case ADD_ROW: {
      const cellId = action.payload;
      const cellIndex = state.cells.findIndex((cell) => cell.id === cellId);
      const cellRows = state.cells[cellIndex].rows;
      const newRowId =
        cellRows.length === 0
          ? 0
          : Math.max(...cellRows.map((row) => row.id)) + 1;
      const newCells = state.cells.map((cell) => {
        if (cell.id === cellId) {
          return {
            ...cell,
            rows: [
              ...cellRows,
              { id: newRowId, value: "", lang: state.defaultLang },
            ],
          };
        }
        return cell;
      });
      return { ...state, cells: newCells };
    }

    case MOVE_ROW_UP: {
      const { cellId, rowIndex } = action.payload;
      const cellIndex = state.cells.findIndex((cell) => cell.id === cellId);
      let cellRows = state.cells[cellIndex].rows;
      if (rowIndex === 0) return state;
      cellRows = [
        ...cellRows.slice(0, rowIndex - 1),
        cellRows[rowIndex],
        cellRows[rowIndex - 1],
        ...cellRows.slice(rowIndex + 1),
      ];
      const newCells = state.cells.map((cell) => {
        if (cell.id === cellId) {
          return { ...cell, rows: cellRows };
        }
        return cell;
      });
      return { ...state, cells: newCells };
    }

    case MOVE_ROW_DOWN: {
      const { cellId, rowIndex } = action.payload;
      const cellIndex = state.cells.findIndex((cell) => cell.id === cellId);
      let cellRows = state.cells[cellIndex].rows;
      if (rowIndex === cellRows.length - 1) return state;
      cellRows = [
        ...cellRows.slice(0, rowIndex),
        cellRows[rowIndex + 1],
        cellRows[rowIndex],
        ...cellRows.slice(rowIndex + 2),
      ];
      const newCells = state.cells.map((cell) => {
        if (cell.id === cellId) {
          return { ...cell, rows: cellRows };
        }
        return cell;
      });
      return { ...state, cells: newCells };
    }

    case DELETE_ROW: {
      const { cellId, rowId } = action.payload;
      const cellIndex = state.cells.findIndex((cell) => cell.id === cellId);
      let cellRows = state.cells[cellIndex].rows.filter(
        (row) => rowId !== row.id
      );
      const newCells = state.cells.map((cell) => {
        if (cell.id === cellId) {
          return { ...cell, rows: cellRows };
        }
        return cell;
      });
      return { ...state, cells: newCells };
    }

    case UPDATE_ROW: {
      const { cellId, rowId, update } = action.payload;
      const cellIndex = state.cells.findIndex((cell) => cell.id === cellId);
      let cellRows = state.cells[cellIndex].rows.map((row) => {
        if (rowId === row.id) {
          return { ...row, ...update };
        }
        return row;
      });
      const newCells = state.cells.map((cell) => {
        if (cell.id === cellId) {
          return { ...cell, rows: cellRows };
        }
        return cell;
      });
      return { ...state, cells: newCells };
    }
    case SELECT_CELL: {
      return { ...state, selectedCell: action.payload };
    }

    default:
      return state;
  }
};

export default sheetMakerReducer;
