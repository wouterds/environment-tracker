//@flow

/**
 * Format temperature
 *
 * @param {number|null} raw
 * @return {string}
 */
const format = (raw: number | null) => {
  if (!raw) {
    return null;
  }

  return raw.toFixed(2);
};

export {
  format,
};
