import React from "react";
import { AiOutlineMore } from "react-icons/ai";
import { useMenuToggler } from "../../custom-hooks";
const DropDown = (props) => {
  const [open, toggle, menuRef] = useMenuToggler();

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={toggle} className="text-base">
        {props.children ? props.children : <AiOutlineMore />}
      </div>

      {open && (
        <div
          className="z-30 origin-top-right absolute mt-2 -inset-x-40 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          {props.options.map((option, index) => {
            return (
              <div
                key={index}
                className={`flex items-center space-x-2 px-4 py-2 text-sm text-gray-900 dark:text-white 
                ${
                  option.func
                    ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    : ""
                }
                ${option.isTitle ? "font-semibold border-b" : ""}
                `}
                onClick={() => {
                  if (option.func) {
                    option.func();
                    toggle();
                  }
                }}
              >
                {option.icon && (
                  <span className="text-blue-500 text-lg">{option.icon}</span>
                )}
                {option.text && <span>{option.text}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default DropDown;
