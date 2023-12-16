import { isValidEmail } from "../../utilFuncs/utilFuncs";

// stylings >>> same as login form stylings

// validations
export const identityList = {
  email: "Please provide a valid email",
  password: "Invalid password",
  confirmPassword: "Invalid password for confirmation",
};

export const validatorPredicates = {
  email: (str) => ({ isValid: isValidEmail(str) }),
  password: (str) => ({ isValid: str.length > 8 }),
  confirmPassword: (str) => ({ isValid: str.length > 8 }),
};
