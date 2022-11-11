// 导入数据库操作模块
const db = require('../db/index')
// 导入处理用户密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的SQL语句
    const sql = `select id,username,nickname,email,user_pic from ev_users where id=?`

    // 调用db.query()执行语句 只要身份认证成功了 就会多出user这个属性 user是对象
    db.query(sql, req.user.id, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 执行SQL语句成功 但是查询的结果可能为空
        if (results.length !== 1) return res.cc('获取用户信息失败!')

        // req.body是用户表单上的数据 req.user是获取的数据库的数据
        // 查看req.user请求的数据
        /* console.log(req.user);
        {
            id: 4,
            username: 'zs2',
            password: '',
            nickname: null,
            email: null,
            user_pic: '',
            iat: 1665127852,
            exp: 1665163852
          } */
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户信息成功!',
            data: results[0]
        })
    })
}

// 更新用户信息的处理函数
exports.updateUserinfo = (req, res) => {
    // 定义待执行的SQL语句
    const sql = `update ev_users set ? where id=?`
    // 调用db.query 执行SQL语句并传递参数
    // 在PostCode更新数据时 如果没有这个人的id会更新失败
    // req.body是用户表单上的数据 req.user是获取的数据库的数据
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行SQL语句失败
        // 这里的req.body就是提交的更新数据
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败!')
        // 成功
        res.cc('更新用户的信息成功!', 0)
    })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 根据id查询用户信息
    const sql = `select * from ev_users where id=?`
    // 执行根据id查询用户的信息的SQL语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行SQL语句失败
        if(err) return res.cc(err)
        // 用户不存在
        if(results.length !== 1) return res.cc('用户不存在!')

        // 判断用户输入的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('旧密码错误!')

        // 更新数据库的密码
        const sql =`update ev_users set password=? where id=?`
        // 给新密码进行加密处理
        // req.body是用户表单上的数据 req.user是获取的数据库的数据
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 调用db.query 执行SQL语句
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if(err) return res.cc(err)
            // 判断影响行数
            if(results.affectedRows !== 1) return res.cc('更新密码失败!')
            // 成功
            res.cc('更新密码成功!', 0)
        })
    })
}


// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义更新头像的SQL语句
    const sql = `update ev_users set user_pic=? where id=?`
    // 调用db.query执行SQL语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err)
        // 影响的行数是否等于1
        if(results.affectedRows !== 1) return res.cc('更新头像失败!')
        // 成功
        res.cc('更换头像成功!', 0)
    })
}