/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 * [\s]表示非空字符
 * integer()代表整数类型 不能带小数点
 * ^ $分别表示开头和结尾
 */

// 导入定义验证规则的包
const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义id, nickname, email的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 定义验证avatar头像的验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 定义并暴露验证注册和登录表单数据的规则对象
// 对应router/user.js 第11行解构赋值
exports.reg_login_schema = {
    body: {
        // 规则名必须和body参数名保持一致 如果这里的规则名字和body参数名字不一致 比如P17行是username 则P25行要改为username(body参数名):username1(规则名)
        username,
        password
    }
}

// 如果采取这个样子 reg_login_schema就等于module.exports这个对象 不是属性了 所以对应router/user.js 12行的大括号可以去掉了
/* reg_login_schema = {
    body: {
        username,
        password
    }
}
module.exports = reg_login_schema */



// 验证规则对象 -- 更新用户基本信息
exports.update_userinfo_schema = {
    // 需要对req.body里面的数据进行验证
    body: {
        // 原本是要写成id: id,这种格式 但是es6可以简写 如果规则名和body参数名不一致 就要写成 id :id1 举个例子
        id,
        nickname,
        email
    }
} 


// 验证规则对象 -- 更新密码
exports.update_password_schema = {
    body: {
      // 使用 password 这个规则，验证 req.body.oldPwd 的值
      oldPwd: password,
      // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
      // 解读：
      // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
      // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
      // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
      newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
  }

// 验证规则对象 -- 更新头像
exports.update_avatar_schema = {
    body: {
        avatar
    }
}

