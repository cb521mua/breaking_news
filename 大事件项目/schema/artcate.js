// 导入验证规则的模块
const joi = require('joi')

// 定义name 和 alias的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// 定义id的校验规则
const id = joi.number().integer().min(1).required()

// 向外共享验证规则对象
// POST通常保存在body里
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// get请求的数据通常在Params里面
// 验证规则对象-删除分类
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 验证规则对象 -- 根据id获取文章分类
exports.get_cate_schema = {
    params: {
        id
    }
}

// 验证规则对象 -- 更新分类
exports.update_cate_schema = {
    body: {
        // 前面是表单数据的id 后面是验证规则的
        Id: id,
        name,
        alias
    }
}
