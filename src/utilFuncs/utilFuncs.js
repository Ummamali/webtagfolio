export function isValidEmail(email) {
  // Regular expression for a basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}

export function findObjectWithProperties(array, properties) {
  return array.find((obj) => {
    for (let key in properties) {
      if (obj[key] !== properties[key]) {
        return false;
      }
    }
    return true;
  });
}
