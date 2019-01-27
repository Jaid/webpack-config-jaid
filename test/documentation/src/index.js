/**
 * Swimming pool
 * @extends Hole
 */
export default class SwimmingPool extends Hole {

  /**
   * Creates a new SwimmingPool instance
   * @param {number} width The width of the hole in cm
   * @param {number} length The length of the hole in cm
   * @param {number} depth - The depth of the hole in cm
   * @example
   * const pool = new SwimmingPool(800, 600, 200)
   */
  constructor(width, length, depth = 300) {
    super(width, length, depth)
    this.width = width
    this.length = length
    this.depth = depth
  }

}