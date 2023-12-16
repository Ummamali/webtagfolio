// form configurations for Login Route

import { isValidEmail } from "../../utilFuncs/utilFuncs";

// Stylings below
export const labelCls = "block text-sm text-gray-400";

export const inputCls = {
  errorMessage: "text-red-500",
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
