"use client";
import React from "react";

const DropdownMenu = ({
  options,
  currentOption,
  setCurrentOption,
  className = "",
}) => {
  const handleChange = (e) => {
    setCurrentOption(e.target.value);
  };

  return (
    <select
      value={currentOption}
      onChange={handleChange}
      className={
        "block text-sm px-3 py-2 bg-transparent border border-gray-400/50 rounded-sm text-gray-400 focus:outline-none hover:cursor-pointer " +
        className
      }
    >
      {options.map((option, idx) => (
        <option
          key={option}
          value={idx}
          className="text-black hover:cursor-pointer py-1"
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default DropdownMenu;
