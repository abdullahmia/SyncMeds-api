/**
 * Create an object composed of the picked object properties
 * @param {Record<string, any>} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object: Record<string, any>, keys: string[]) => {
  return keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
