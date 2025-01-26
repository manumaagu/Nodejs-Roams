const letters = "TRWAGMYFPDXBNJZSQVHLCKE";

export const dniChecker = (dni) => {
  const number = dni.substr(0, 8);
  const letter = dni.substr(8, 1).toUpperCase();
  const position = number % 23;

  return letter === letters[position];
};
