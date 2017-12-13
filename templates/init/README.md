# <%=appname%>

## 前提条件

- node@>=7.6.0
- npm@>=3.0.0
- pm2@>=2.0.0(全局安装)

## 初始化数据库
如果选择了 `MySQL`，需要修改 `profiles/local/mysql.env` 中的数据库信息，然后运行：
```
npm run seed
```


## 启动工程
```
npm run start
```

## 文档
https://qails.github.io

## 编码规范

### ORM
- 模型文件名词使用名词单数形式
- `tableName` 使用复数形式
- 有关联数据时需要指定静态属性 `dependents`，便于删除数据时能自动删除关联数据

### MySQL
- 为了与前端变量命名编码规范保持一致，数据表名称和字段名称都使用小驼峰命名方式命名(注意：MySQL不区分大小写，请不要试图使用大小写差异来区分变量)
- 表名称用名词的复数形式，如果名称由多个名称连接而成，最后一个名词使用复数
- 无特殊情况，每个表都应该包含 `id`, `createdAt`, `updatedAt` 三个字段
- 字段不允许为 `null`，而且必须有默认值和注释 (公司规范)
- 每张表最多只允许一个时间字段的默认值使用当前时间，如果存在多个，SQL审核时会被拒绝
- varchar(string)类型必须指定存储长度
- 关联字段名称使用 `关联表名称 + Id`

### 目录和文件名
- 使用小驼峰命名方式命名
  - `qdr_service` 目录除外，该目录名称以及内部文件名称是 Jenkins 约定的
- 模型文件名词使用名词单数形式

### GraphQL
- 接口必须有注释，注释会生成文档，以后不需要再单独写接口文档了
- 列表都需要支持 `page: Int, pageSize: Int, limit: Int, offset: Int`
- 有外部关联的对象模型需要支持 `withRelated: [String]`，出于性能的考虑，默认不查询关联表
- Mutation类型的命名
- Input Type类型的命名
- Error的规范
- 一次请求返回的最大数据量限制

### Redis
- 缓存规范

### eslint
- 尽量少修改 `.eslintrc.js` 中的配置
- 尽量选择影响范围小的方式禁用规则，范围从小到大依次是：
    `单行 -> 多行 -> 单文件某个规则 -> 单文件所有规则`

    ```js
    // 单行禁用
    alert('foo'); // eslint-disable-line
    // eslint-disable-next-line
    alert('foo');

    //多行禁用
    /* eslint-disable */
    alert('foo1');
    alert('foo2');
    alert('foo3');
    /* eslint-enable */

    // 单文件禁用某个规则
    /* eslint-disable no-alert */
    alert('foo');

    // 单文件禁用所有规则，等同于把文件名加入到 .eslintignore
    /* eslint-disable */
    alert('foo');
    ```

## 相关网站

- [bookshelfjs docs](http://bookshelfjs.org)
- [knexjs docs](http://knexjs.org)
- [Joi docs](https://github.com/hapijs/joi)
- [koa-router docs](https://github.com/alexmingoia/koa-router)
