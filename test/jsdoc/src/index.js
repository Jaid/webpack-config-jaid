/** @module jsdoc-test */

/**
 * @class
 */
export default class Rectangle {

  constructor(height, width) {
    this.height = height
    this.width = width
  }

}

/**
 * @function
 * @param {number} x
 * @returns {number} x * 2
 */
export const twice = x => x * 2