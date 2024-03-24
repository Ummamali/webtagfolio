import { isValidEmail } from "../../utilFuncs/utilFuncs";

// stylings >>> same as login form stylings

// validations
export const identityList = {
  username: "Please provide a valid username",
  email: "Please provide a valid email",
  password: "Invalid password",
  confirmPassword: "Invalid password for confirmation",
};

export const validatorPredicates = {
  username: (str) => ({ isValid: str.length > 5 }),
  email: (str) => ({ isValid: isValidEmail(str) }),
  password: (str) => ({ isValid: str.length > 8 }),
  confirmPassword: (str) => ({ isValid: str.length > 8 }),
};
