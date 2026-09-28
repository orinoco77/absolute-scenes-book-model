export const requireValidIndex = (index, length, label) => {
  if (!Number.isInteger(index) || index < 0 || index >= length) {
    throw new Error(`${label} out of range: ${index}`);
  }
};
