/**
 * 用户相关业务操作
 *
 */

var crypto = require('crypto');
var User = require('../models/user.js');
var Step = require('step');

var PAGE_SIZE_DEFAULT = 6;

function UserService(){}
module.exports = UserService;

/**
 * 注册
 * @param req
 * @param res
 */
UserService.register = function(req,res){
    var password = req.body.password;
    var password2 = req.body.password2;
    //检验用户两次输入的密码是否一致
    if(password2 != password){
        req.flash('error','两次输入的密码不一致!');
        return res.redirect('/reg');
    }
    //生成密码的散列值
    var md5 = crypto.createHash('md5'),
        password = md5.update(password).digest('hex');
    var newUser = new User({
        name: req.body.name,
        password: password,
        email: req.body.email,
        friends: [],
        introduction: null,
        location: null,
        portraitSrc: '/images/defaultSrc.jpg',
        fans: []
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user){
        if(user){
            err = '用户已存在!';
        }
        if(err){
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;//用户信息存入session
            req.flash('success','注册成功!');
            res.redirect('/post');
        });
    });
};

/**
 * 修改个人信息
 * @param req
 * @param res
 */
UserService.modifyInformation = function(req,res){
    var user = new User({
        name: req.session.user.name,
        location: req.body.location,
        introduction: req.body.introduction,
        portraitSrc: req.files.portraitSrc.path
    });
    Step(
        function modify(){
            user.modifyInformation(this);
        },
        function getUser(err){
            if(err){
                req.flash('error2modify','修改失败!');
            }else{
                req.flash('success2modify','修改成功!');
            }
            User.get(user.name,this);
        },
        function done(err,user){
            if (err) {
                console.error('查找用户失败' + err);
            }else{
                user.portraitSrc = user.portraitSrc.replace('public','');
                req.session.user = user;
            }
            res.redirect('/user/modify');
        }
    );
};

/**
 * 关注取消关注
 * @param req
 * @param res
 */
UserService.followUser = function (req, res) {
    //关注处理用户名
    var followUserName = req.query.followUserName;
    //操作类型
    var type = req.query.followType;
    //发起操作用户名
    var userName = req.session.user.name;
    var result = {};
    var callBack = function (err, num) {
        if (err || num != 1) {
            result.code = 1;
        } else {
            result.code = 0;
            User.get(userName, function (err, user) {
                if (err) {
                    user = null;
                }
                req.session.user = user;
                res.send(result);
            });
        }
    };
    if (type == 1) {
        //关注用户
        User.followUser(followUserName, userName, callBack);
    } else if (type == 0) {
        //取消关注
        User.unFollowUser(followUserName, userName, callBack);
    }
}



/**
 * 登录
 * @param req
 * @param res
 */
UserService.login = function(req, res){
    //生成密码的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.isExist(req.body.name, password,function(err, user){
        if(!user){
            req.flash('error', '用户名密码错误!');
            return res.redirect('/login');
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        req.flash('success','登陆成功!');
        res.redirect('/post');
    });
};
/**
 * 找人
 * @param req
 * @param res
 */
UserService.findUsers = function(req,res){
    var page = req.query.page || 1;
    if(page <= 0){
        page = 1;
    }

    User.getAllUsers(page,PAGE_SIZE_DEFAULT,function(err,users){
        if (err) {
            users = [];
        }
        for(var i = 0;i < users.valueList.length;i++){
            users.valueList[i].isFriend = isFriends(users.valueList[i].name,req.session.user.friends);
        }
        res.render('find', {
            title: '找人',
            typeName: '找人',
            user: req.session.user,
            users: users
        });

    });

};

function isFriends(name,friends){
    for(var i = 0;i < friends.length;i++) {
        if (friends[i] == name) {
            return true;
        }
    }
    return false;
};

/**
 * 判断用户是否登录 如果未登录则跳转到登录页
 * @param req
 * @param res
 * @param next
 */
UserService.checkLogin = function(req, res, next){
    if(!req.session.user){
        req.flash('error','未登录!');
        return res.redirect('/login');
    }
    next();
};

/**
 * 判断用户是否未登录 如果已登录则转到首页
 * @param req
 * @param res
 * @param next
 */
UserService.checkNotLogin = function(req,res,next){
    if(req.session.user){
        req.flash('error','已登录!');
        return res.redirect('/post');
    }
    next();
};


