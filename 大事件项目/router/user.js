const express = require('express')
// Router是大写
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 1.导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 2.导入需要的验证规则对象  用到了解构赋值
// 解构赋值 因为 module本身也是个对象 在schema/user.js20行中 是exports.reg_login_schema 则说明 reg_login_schema是对象的属性
const { reg_login_schema } = require('../schema/user')

// 注册新用户
// 可以通过中间件对这个数据进行验证 如果验证通过了 把这个关系交给后面的处理函数 如果失败了 则返回一个全局错误消息 我们在app.js中捕获这个错误
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终    止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/reguser', expressJoi(reg_login_schema), user_handler.reguser)
// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

module.exports = router