//react
import { useState, useEffect } from "react";
//custom hooks
import { useMenuToggler } from "../../custom-hooks";

//icons
import { AiOutlineSearch, AiOutlineStop, AiOutlineCheck } from "react-icons/ai";
import { HiSelector } from "react-icons/hi";

const Select = ({
  searchable = false,
  options = [],
  value,
  onValueChange,
  id,
  buttonClassName = "",
  menuClassName = "",
}) => {
  const [open, toggle, menuRef] = useMenuToggler();

  //When searchable is true
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [open]);

  const optionList = () => {
    const filteredOptions = options.filter(
      (option) =>
        inputValue === "" ||
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return (
      <ul
        className={`${menuClassName} absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 overflow-auto focus:outline-none `}
        tabIndex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        {filteredOptions.length === 0 ? (
          <div className="flex items-center justify-center p-4 space-x-2 text-gray-600 text-base">
            <AiOutlineStop />
            <span>No options</span>
          </div>
        ) : (
          filteredOptions.map((option, index) => {
            return (
              <li
                key={option.value}
                className={` cursor-default select-none relative py-2 pl-3 pr-9 
                ${value === option.value ? "font-semibold text-gray-700" : ""}
              hover:bg-blue-100`}
                role="option"
                aria-selected={value === option.value ? "true" : "false"}
                onClick={() => {
                  onValueChange(option.value);
                  toggle();
                }}
              >
                <div className="flex items-center">
                  <span className="ml-1 block truncate">{option.label}</span>
                </div>
                {value === option.value && (
                  <span className="font-semibold absolute inset-y-0 right-0 flex items-center pr-4">
                    <AiOutlineCheck />
                  </span>
                )}
              </li>
            );
          })
        )}
      </ul>
    );
  };

  const selectedOption =
    options[options.findIndex((item) => item.value === value)] || null;
  return (
    <div className="relative h-full w-full" ref={menuRef}>
      {searchable ? (
        <input
          type="text"
          id={id}
          className={`${buttonClassName} w-full bg-white h-full pl-3 pr-10 py-2 text-left cursor-default focus-yellow text-sm placeholder-black`}
          aria-haspopup="listbox"
          placeholder={selectedOption?.label || "select..."}
          aria-labelledby="listbox-label"
          onClick={() => {
            toggle();
            setInputValue("");
          }}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      ) : (
        <button
          id={id}
          className={`${buttonClassName} w-full bg-white h-full pl-3 pr-10 py-2 text-left cursor-default focus-yellow sm:text-sm`}
          onClick={toggle}
        >
          {selectedOption ? selectedOption.label : "Select..."}
        </button>
      )}

      <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
        {open ? (
          searchable ? (
            <AiOutlineSearch />
          ) : (
            <HiSelector />
          )
        ) : (
          <HiSelector />
        )}
      </span>

      {open && optionList()}
    </div>
  );
};
export default Select;
