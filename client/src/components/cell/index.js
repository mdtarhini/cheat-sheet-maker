import {
  cellThemeOptions,
  cellCornerOptions,
  cellBorderOptions,
  highlightingLangOptions,
} from "../../sheet-settings-constants";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
const highlightRenderer = (language) => {
  return {
    code: ({ value }) => {
      if (value) {
        return (
          <SyntaxHighlighter
            style={coldarkCold}
            wrapLongLines={true}
            language={language}
            children={value}
            customStyle={{
              backgroundColor: "#ffffff28",
              fontSize: "16px",
              overflow: "hidden",
              borderLeft: "4px solid gray",
              borderRadius: "0px",
              padding: "3px 8px",
            }}
          />
        );
      }
      return null;
    },
  };
};

const Cell = ({ makerMode, title, rows, theme, corners, borders }) => {
  return (
    <div className="w-full">
      {(makerMode || title) && (
        <div
          className={`w-full h-12 flex  items-center justify-center
            bg-${cellThemeOptions[theme]}-500 
            rounded-t-${cellCornerOptions[corners]} 
            border${cellBorderOptions[borders]} 
            border-b-0 border-${cellThemeOptions[theme]}-600`}
        >
          <h3
            className={`text-xl text-gray-50 font-bold 
              ${title ? "opacity-100" : "opacity-25"}`}
          >
            {title || "cell title"}
          </h3>
        </div>
      )}

      <div className="w-full">
        {rows.map((row, index) => {
          if (row.value || makerMode) {
            return (
              <div
                className={`prose break-words whitespace-pre-wrap w-full max-w-full px-2 
                  border-l${cellBorderOptions[borders]} 
                  border-r${cellBorderOptions[borders]} 
                  border-${cellThemeOptions[theme]}-600
                  bg-${cellThemeOptions[theme]}-${
                  index % 2 === 0 ? "50" : "200"
                }
                  ${row.value ? "py-2" : "py-5"} 
                  ${
                    index === rows.length - 1
                      ? `rounded-b-${cellCornerOptions[corners]} border-b${cellBorderOptions[borders]}`
                      : ""
                  }`}
                key={index}
              >
                <ReactMarkdown
                  allowDangerousHtml={true}
                  language="js"
                  sourcePos={true}
                  renderers={highlightRenderer(
                    highlightingLangOptions[row.lang].prismValue
                  )}
                  children={row.value}
                  plugins={[gfm]}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
export default Cell;
