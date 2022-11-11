// 导入mysql模块
const mysql = require('mysql')

// 账号密码要记清楚
// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'caibao521',
    database: 'my_db_01'
})

// 向外共享db数据库连接该对象
module.exports = db