// 导入express
const express = require('express');
// 创建实例对象
const app = express();
const joi = require('joi')

// 导入并配置cors中间件
const cors = require('cors');
app.use(cors())

// 解析表单数据的中间件 只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }))

// 要在路由之前封装res.cc函数 因为如果在路由之后 路由就访问不到这个函数了
app.use((req, res, next) => {
    // status默认值为1 表示失败的情况
    // err的值 可能是一个错误对象 也可能是一个错误的描述字符串
    res.cc = (err, status = 1) => {
        res.send({
            status,
            // instanceof的作用是测试它左边的对象是否是它右边的类的实例
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// 其他接口请求需要携带 Authorization的字段 同时value前面要加上Bearer +token
// 身份认证成功 可是如果没有开放这个接口 会返回错误的html页面
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
// 导入并使用文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    //验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知的错误
    res.cc(err)
})


// 调用app.listen方法 指定端口号并启动web服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})
