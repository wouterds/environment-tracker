//@flow

/**
 * Format CO2
 *
 * @param {number|null} raw
 * @return {string}
 */
const format = (raw: number | null) => {
  if (!raw) {
    return null;
  }

  return raw.toFixed(0);
};

export {
  format,
};
