//@flow

/**
 * Format light
 *
 * @param {number|null} raw
 * @return {string}
 */
const format = (raw: number | null) => {
  if (!raw) {
    return null;
  }

  if (raw > 100) {
    return raw.toFixed(0);
  }

  return raw.toFixed(2);
};

export {
  format,
};
