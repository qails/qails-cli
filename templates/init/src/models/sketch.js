import bookshelf from './base';
import Draft from './draft';

/**
 * @class Sketch
 */
export default class Sketch extends bookshelf.Model {
  /**
   * @method 表名称
   * @return {string}
   */
  get tableName() {
    return 'sketches';
  }

  /**
   * One-to-many
   * @return {bookshelf.Collection}
   */
  draft() {
    return this.belongsTo(Draft);
  }
}
