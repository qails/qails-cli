import { Model } from 'qails';
import Floor from './floor';
import Draft from './draft';

/**
 * @class <%=modelName%>
 */
export default class <%=modelName%> extends Model {
  /**
   * @constructor
   * @param {object} attributes
   * @param {object} options
   */
  constructor(attributes, options) {
    super(attributes, options);
  }

  /**
   * 依赖模型方法，在本模型底部有定义
   * 删除时依据此项删除关联表中对应的数据
   * @static {array}
   */
  static dependents = ['floors', 'draft'];<% if (jsonColumns) { %>

  /**
   * 入出库时需要自动序列化和反序列化的字段
   * @static {array}
   */
  static jsonColumns = <%=JSON.stringify(jsonColumns.split(','))%>;<% } %>

  /**
   * 自定义字段列表，返回数据时会根据该列表定义的字段返回数据
   * 支持子模型字段
   * @static {Object}
   */
  static masks = {
    custom: 'id,hotelName,floors(name),draft(id,updatedAt)'
  };

  /**
   * 表名称
   * @return {string}
   */
  get tableName() {
    return '<%=tableName%>';
  }

  /**
   * 表名称
   * @return {string}
  get validate() {
    return false;
  }
  */<% if (hasUuid) { %>

  /**
   * 插入新记录时是否自动生成UUID
   * @return {boolean}
   */
  get uuid() {
    return true;
  }<% } %>

  /**
   * 是否包含creted_at和updated_at
   * 默认包含
   * @member
   * @return {boolean|array}
   */
  get hasTimestamps() {
    return <%=hasTimestamps%>;
  }

  /**
   * @method 虚拟字段
  get virtuals() {
    return {
      full_name: () => {
        return {
          user_id: this.id,
          user_name_test: 'Joe'
        };
      }
    };
  }
  */

  /**
   * 调用 toJSON 方法时需要隐藏的字段
  get hidden() {
    return ['updated_at'];
  }
  */

  /**
   * 调用 toJSON 方法时需要显示的字段
  get visible() {
    return ['hotel_name'];
  }
  */

  /**
   * One-to-many
   * @method
   * @return {bookshelf.Collection}
   */
  floors() {
    return this.hasMany(Floor);
  }

  /**
   * One-to-one
   * @method
   * @return {bookshelf.Collection}
   */
  draft() {
    return this.hasOne(Draft);
  }
}
