// 这是路由处理函数模块

// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
    // 定义查询分类列表中的SQL语句
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
    // 调用db.query执行SQL语句
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类数据成功!',
            data: results
        })
    })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义查重的SQL语句
    const sql = `select * from ev_article_cate where name=? or alias=?`
    // 执行查重的SQL语句
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 判断是否执行SQL语句失败
        if (err) return res.cc(err)

        // 判断数据的length
        // 1.length 等于 2的情况
        if (results.length === 2) return res.cc('分类名称和分类别名被占用,请更换后重试!')
        // 2.length 等于 1 的情况
        if (results.length === 1) {
            if (results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称和分类别名被占用,请更换后重试!')
            if (results[0].name === req.body.name) return res.cc('分类名称被占用,请更换后重试!')
            if (results[0].alias === req.body.alias) return res.cc('分类别名被占用,请更换后重试!')
        }

        // 分类名称和分类别名都可用 执行添加的SQL命令 插入文章分类的SQL语句
        const sql = `insert into ev_article_cate set ?`
        // 运用db.query 执行文章分类的SQL语句
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('获取文章分类失败！')
            res.cc('文章分类成功', 0)
        })

    })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // 定义标记删除的SQL语句
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    // db.query
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        res.cc('删除出文章分类成功', 0)
    })
}

// 根据id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    // 定义SQL语句
    const sql = `select * from ev_article_cate where id=?`
    // 调用db.query 执行SQL语句
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')
        res.send({
            status: 0,
            message: "获取文章分类数据成功",
            data: results[0]
        })
    })

}

// 根据id更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
    // 执行查重操作
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // TODO：更新文章分类
        const sql = `update ev_article_cate set ? where Id=?`

        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
          
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
          
            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
          })
    })
    
}