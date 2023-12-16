// form configurations for Login Route

import { isValidEmail } from "../utilFuncs/utilFuncs";

export const labelCls = "block text-sm text-white/50";

export const inputCls = {
  normal:
    "block border-b border-gray-600 pb-0.5 bg-transparent w-full focus:outline-none focus:border-gray-400 text-white/70 placeholder:text-sm placeholder:italic placeholder:text-white/30 ",
  invalid:
    "border-red-500 placeholder:!text-red-500/50 placeholder:font-normal text-red-500",
  errorMessage: "text-red-500 font-normal",
};

// Validation Below

export const identityList = {
  email: "Invalid email has been given",
  password: "Invalid password has been given",
};
export const validatorPredicates = {
  email: (str) => ({ isValid: isValidEmail(str) }),
  password: (str) => ({ isValid: str.length > 8 }),
};
