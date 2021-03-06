//  导入操作用户数据的model 模块
var userModel = require('../model/userModel.js');
//导入md5第三方加密模块
var md5 = require('blueimp-md5');
var config = require('../config.js');

module.exports = {
    showRegisterPage(req, res) { //展示注册页面
        res.render('./user/register', {});
    },
    registerNewUser(req, res) { //注册新用户
        //  1.获取到提交过了的用户信息 注册中间件 body-parser

        var user = req.body;
        //  2.根据提交过来的用户名，调用相关的mode模块，查询次用户名有没有被注册
        userModel.getUserByName(user.username, (err, results) => {
                if (err) return res.json({ err_code: 1, msg: '注册失败！' });
                if (results.length !== 0) return res.json({ err_code: 1, msg: '此用户名已存在，请更换其他用户名！' });

                // 为了提高密码的安全性，我们需要在 注册新用户之前，先把 用户的密码进行 MD5 加密
                // 在调用 md5() 方法加密的时候，使用两个参数：第一个是用户输的密码；第二个参数是：程序执行的提高安全性的盐
                user.password = md5(user.password, config.pwdSalt);
                userModel.registerNewUser(user, (err, results) => {
                    if (err) return res.json({ err_code: 1, msg: '注册失败！' });
                    if (results.affectedRows !== 1) return res.json({ err_code: 1, msg: '注册失败！' });
                    //注册成功
                    res.json({ err_code: 0 });
                });
            })
            //  3.如果此用户名被占用了，则提示更换用户名，重新注册
            //  4.如果数据库中没哟这个用户名，可以走后面的注册流程
            //  5.调用 Model 模块中，注册相关的方法，将提交过来的用户信息，保存到数据库，并提示用户注册OK
    },
    showLoginPage(req, res) { //展示登录页面
        res.render('./user/login', {});
    },
    login(req, res) { //用户登录
        // 1. 获取提交过来的登录信息
        var loginUser = req.body;
        // 2. 根据登录信息，调用 Model 模块，查询此用户是否存在
        // 3. 如果存在，返回登录成功，否则返回登录失败
        loginUser.password = md5(loginUser.password, config.pwdSalt);
        userModel.login(loginUser, (err, results) => {
                if (err || results.length !== 1) return res.json({ err_code: 1, msg: '登录失败，请稍后再试！' });

                res.json({ err_code: 0 });
            })
            // 在登录之前，先对用户数的 明文密码 进行加盐处理，然后再去数据库中匹配密码
    }
}