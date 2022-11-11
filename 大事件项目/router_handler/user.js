// 抽离用户路由模块的函数

//导入数据库操作模块
const db = require('../db/index')
// 导入bcrypt.js这个包
const bcrypt = require('bcryptjs')
// 导入生成Token的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册函数
exports.reguser = (req, res) => {
    // 获取客户端提交到服务器的数据
    const userinfo = req.body;
    // 表单验证比这个高级 这个被舍弃
    /*  if (!userinfo.username || !userinfo.password) {
         // 这里的响应数据都是在PostCode的信息反馈 不会显示在html页面
         // return res.send({ status: 1, message: '用户名或者密码不合法!' })
         return res.cc('用户名或者密码不合法!' )
 
     } */

    const sqlStr = `select * from ev_users where username=?`
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 我们发现 没有错误的时候err为null
        // console.log(err);

        // results是将查询语句执行后的数据放在一个数组里面 因为是查询语句 所以响应的信息和更新 删除 插入不一样
        // console.log(results);
        // 用户在点击提交的时候 会先查看有没有当前表单将要提交的用户名 如果没有 则加入到数据库 执行流程是这个样子
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用,请更换用户名!' })
            return res.cc('用户名被占用,请更换用户名!')
        }

        // 调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理
        // console.log(userinfo);
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 可以发现已经被加密
        // console.log(userinfo);




        // 定义插入新用户的sql语句

        // 插入这一个大的部分尽量不要放在外面 虽说body的值是在不同中间件 方法中传递 可是同一级的方法执行速度是并驾齐驱 res.send会有相排斥 放在里面 按照执行顺序来 在express里面 不允许连续调用两次express!!!!!
        const sql = 'insert into ev_users set ?'
        // 调用db.query()执行SQL语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)
            // 这行代码证明update insert等属性大概一致 results返回的是关于sql语句的响应结果
            // console.log(results);
            // if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败,请稍后再试!' })
            if (results.affectedRows !== 1) return res.cc('注册用户失败,请稍后再试!')
            // res.send({ status: 0, message: '注册成功!' })
            res.cc('注册成功', 0)
        })
    })
    // 响应信息 只能响应一次 可以理解为这个res.send 和 db.query()在同步执行 当db.query满足了里面的用户名被占用 已经不能返回第二次了 因为每次响应默认当前的这个res.send优先响应
    // res.send('reguser ok');

}

// 登陆函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 执行SQL语句 根据用户名查询用户的信息
    const sql = `select * from ev_users where username=?`
    // 执行 SQL语句 根据用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        // 执行SQL语句成功 但是条数不等于1
        if (results.length !== 1) return res.cc('登录失败!')
        // 检测密码是否正确
        // 核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
        console.log(results);
        // 数据库密码已经经过加密了 这个方法就是将提交的密码000000 和数据库加密的进行比较  如果数据库密码是未加密的反而不成功
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('登录失败!')


        // 在服务端生成Token的字符串
        // 核心注意点：在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值 因为保存在客户端浏览器 很容易被黑客破解
        // 所以 在此将用户名和密码赋值为空
        const user = { ...results[0], password: '', user_pic: '' }
        // console.log(user);
        // 对用户的信息进行加密 生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        console.log(tokenStr);

        // 通过res.send响应给客户端
        res.send({
            status: 0,
            message: '登录成功!',
            token: 'Bearer ' + tokenStr
        })

    })

}