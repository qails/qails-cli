# <%=appname%>

[![Build status](https://ci.appveyor.com/api/projects/status/n1s6xqxlbk9f0fgr?svg=true)](https://ci.appveyor.com/project/zhongzhi107/kakao)
[![Dependency Status](https://david-dm.org/zhongzhi107/kakao.svg)](https://david-dm.org/zhongzhi107/kakao)
[![devDependency Status](https://david-dm.org/zhongzhi107/kakao/dev-status.svg)](https://david-dm.org/zhongzhi107/kakao#info=devDependencies)

An API-driven framework for building nodejs apps, using MVC conventions. It only will provide a structure, inspired on Ruby on Rails, that will allow you to organise better your projects, initialise your own or third party libraries, call in a easy way your models, helpers, etc.

## Features

* MVC architecture project
* ES6 support
* Helpers support
* ORM, ODM or DB driver independent
* Well organized configuration files and routes

## TODO
- [x] Log
  - [x] accessLog
  - [x] requestLog
- [x] Router
- [x] REST
  - [x] GET
  - [x] POST
  - [x] PUT
  - [x] DELETE
- [x] ORM
  - [x] withRelated返回指定的columns - mask plugin
  - [x] 自定义sql
  - [x] schema/joi
  - [x] 分页
  - [x] 使用bookshelf-cascade-delete删除关联表数据，避免使用数据库外键
  - [x] 根据models自动创建CRUD路由
  - [ ] insert/update时更新关联表数据
  - [ ] joi.description()不起作用
- [x] Debug
- [ ] HTTPS support
- [ ] Cache
- [ ] Task
- [ ] Test
- [ ] Deploy
- [ ] Daemon
- [ ] Others
  - [ ] xx

## Installation

First install [node.js](http://nodejs.org/) and [mysql](http://dev.mysql.com/downloads/mysql/). Then:

1. Clone the project to local
```
$ git clone https://github.com/zhongzhi107/kakao
```

1. Install dependencies
```
$ yarn
```

1. Modify config file `config/index.js`
```
$ vi config/index.js
```

  ```js
  connection: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'qrmaps',
    port: 3306,
    charset: 'utf8',
    timezone: 'UTC',
    // debug: true,
  }
  ```

1. Migrate data
```
$ yarn run init
```

1. Start the application
```
$ yarn start
```
By default the app tries to connect to port 3000. After starting the application you can check it at [http://localhost:3000/roles](http://localhost:3000/roles)


## Convention
> 以下是默认约定，如果不想按着默认约定编码，可以在代码中使用指定参数的方式更改

- 数据库、表应该像变量名一样，全部采用小写，但单词之间以下划线分隔，而且表名始终是复数形式的
- 文件名应该全部小写，单词之间用下划线
- 关联表名称默认为用下划线连接的被关联的两个表名，且按2个表名称的字母排序先后顺序连接
  - `users`和`posts`的关联表名称应该为`posts_users`
  - `tags`和`posts`的关联表名称应该为`posts_tags`
  - `users`和`tags`的关联表名称应该为`tags_users`
- 关联表名中关联的字段默认为 `被关联表名称的单数_id`，如 `user_id` `tag_id` `post_id`
- ...

## 日志
使用下面的方法能很方便的记录日志，更多信息请看[winston官网](https://github.com/winstonjs/winston)

```js
import logger from './utils/logger';
logger.info('Hello');
```

## 路由
kakao能根据model自动创建RESTful路由地址

### 创建一个最简单的CRUD路由
```js
import Role from '../models/roles';
import ResourceRouter from '../utils/resource';

export default ResourceRouter.define(Role.collection())
```

上面的代码会自动创建以下路由：

提交方式 | 路由 | 说明
--- | --- | ---
POST | /roles | 新建一个角色
GET | /roles | 列出所有角色
GET | /roles/:id | 获取某个指定角色的信息
PATCH | /roles/:id | 更新某个指定角色的信息
DELETE | /roles/:id | 删除某个角色

### 创建一个嵌套路由
```js
import Role from '../models/role';
import ResourceRouter from '../utils/resource';

const users = ResourceRouter.define({
  // 假设在role model中已经设定了role和user的关联关系
  collection: (ctx) => ctx.state.role.users(),
  name: 'users',
  setup(router) {
    router
      .use(async (ctx, next) => {
        ctx.state.role = await Role.findById(
          ctx.params.role_id,
          {require: true}
        );
        await next();
      })
      .crud();
  },
});

export default ResourceRouter.define({
  collection: Role.collection(),
  setup(router) {
    router.crud();
    // router.create().read().update().destroy();

    // 使用嵌套路由
    router.use('/roles/:role_id(\\d+)', users.routes());
  },
});

```
上面的代码会自动创建以下路由：

 提交方式 | 路由 | 说明
---|---|---
POST|/roles|新建一个角色
GET|/roles|列出所有角色
GET|/roles/:id|获取某个指定角色的信息
PATCH|/roles/:id|更新某个指定角色的信息
DELETE|/roles/:id|删除某个指定角色的信息
POST|/roles/:role_id/users|新增一个某个指定角色的用户
GET|/roles/:role_id/users|列出某个指定角色的所有用户
GET|/roles/:role_id/users/:user_id|列出某个指定角色的指定用户
PATCH|/roles/:role_id/users/:user_id|修改某个指定角色的指定用户
DELETE|/roles/:role_id/users/:user_id|删除某个指定角色的指定用户

### 创建一个表名称和model名称不一致的路由
假设表名称是 `tb_roles`，希望创建的路由是 `roles`，这需要在创建路由时指定 `name` 参数：

```js
// routes/role.js
import Role from '../models/role';
import ResourceRouter from '../utils/resource';

export default ResourceRouter.define({
  collection: Role.collection(),
  name: 'roles'
});
```

同时指定 model 名称

```js
// models/role.js
export default class extends bookshelf.Model {
  get tableName() {
    return 'tb_roles';
  }
}
```

### 在标准 CRUD 路由前后插入其他中间件
有时候需要在标准的路由前后加入一些业务规则中间件，如新增一条记录后需要在日志表中记录操作人日志，这时候可以在创建路由时注入中间件。可以在以下位置注入中间件：

参数名称 | 参数类型 | 适用patten | 说明
--- | --- | --- | ---
beforeMiddlewaves | `Function` `Array` | all | 在标准路由前执行
afterMiddlewaves | `Function` `Array` | all | 在标准路由后执行
beforeListMiddlewaves | `Function` `Array` | /models | 在标准获取列表路由前执行
afterListMiddlewaves | `Function` `Array` | /models | 在标准获取列表路由后执行
beforeItemMiddlewaves | `Function` `Array` | /models/:model | 在标准获取详情路由前执行
afterItemMiddlewaves | `Function` `Array` | /models/:model | 在标准获取详情路由后执行

```js
import Log from '../models/log';
import ResourceRouter from '../utils/resource';

export default ResourceRouter.define({
  collection: Log.collection(),
  name: 'logs',
  setup(router) {
    router.read({
      beforeMiddlewaves: [
        async(ctx, next) => {
          console.log('===before===');
          await next();
        }
      ],
      afterMiddlewaves: async(ctx, next) => {
        console.log('===after===');
        await next();
      }
    });
  }
});
```

## API支持的querystring
- 查询类
  - http://localhost/roles??where[name]=sales
  - http://localhost/roles?where=id&where=>&where=5
  - http://localhost/roles?where=id&where=>&where=5&orWhere[map_id]=3
  - http://localhost/roles?where=id&where=>&where=5&andWhere[id]=3&orWhere[map_id]=4
  - http://localhost/roles?where=id&where=>&where=5&andWhere=id&andWhere==&andWhere=3&andWhere=id&andWhere=<&andWhere=10&orWhere[map_id]=4
- 返回值类
  - 分页
    - http://localhost/roles?pageNo=1&pageSize=15
    - http://localhost/roles?offset=0&limit=15
  - 自定义返回字段
    - http://localhost/roles?mask=custom
    - http://localhost/roles?mask=id,name
  - 返回关联模型数据
    - http://localhost/roles?embed=users
    - http://localhost/roles?embed=users,posts
  - 排序
    - http://localhost/roles?sort=id
    - http://localhost/roles?sort=id,name
    - http://localhost/roles?sort=-id

    除过滤条件外的参数完，list和item参数通用

    ##list
    l-wap3.wap.dev.cn0.qunar.com:3000/maps
    ##item
    l-wap3.wap.dev.cn0.qunar.com:3000/maps/1
    ##含关联数据的list
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?embed=floors
    ##含多个关联数据的list
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?embed=floors,draft
    只返回部分字段，如果字段太多可以让我在后端限制
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?mask=id,hotelName
    正向排序
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?sort=id
    反向排序
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?sort=-id
    多字段排序
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?sort=id,name
    page方式分页
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?pageNo=1&pageSize=15
    offset方式分页
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?offset=0&limit=15

    过滤（字段名使用下划线方式命名，暂时不支持驼峰命名，马上支持）
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?where[hotel_id]=1
    多个and条件过滤
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?where[hotel_id]=1&andWhere[hotel_seq]=SEQ_1
    或条件
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?where[hotelId]=1&orWhere[hotelId]=2
    like（查询出所有以0结尾的seq）
    l-wap3.wap.dev.cn0.qunar.com:3000/maps?where=hotel_seq&where=like&where=%0

## Overview
...

## Notes
- curl传递多个querystring参数时，`&` 前需要加 `\`，如 `curl http://localhost/roles?sort=id\&direction=desc`
- curl传递带[]参赛时，需要加上 `--globoff` 参数，如 `curl --globoff http://localhost/roles?where[name]=sales`

## References

- [bookshelfjs docs](http://bookshelfjs.org)
- [knexjs docs](http://knexjs.org)
- [Joi docs](https://github.com/hapijs/joi)
- [koa-router docs](https://github.com/alexmingoia/koa-router)
