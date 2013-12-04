
/*
 * GET home page.
 */
var Userservice = require('../service/userService.js');
var PostService = require('../service/postService.js');
var MessageService = require('../service/messageService.js');

module.exports = function(app){

    /**
     * 推荐页路由
     */
    //直接访问域名 未登录则展示推荐页否则进入首页
    app.all('/',Userservice.checkNotLogin);
  	app.get('/',function(req,res){
        PostService.getNumPostForIndex(req,res);
  	});

    /**
     * 注册页路由
     */
  	app.all('/reg', Userservice.checkNotLogin);
	app.get('/reg',function(req,res){
	    res.render('reg', { title: '注册',typeName:'注册' , error : req.flash('error').toString(),user: req.session.user});
	});
  	app.post('/reg', function(req,res){
	  	Userservice.register(req,res);
  	});

    /**
     * 登录页路由
     */
  	app.all('/login', Userservice.checkNotLogin);
  	app.get('/login',function(req,res){
    	res.render('login', { title: '登录', typeName:'登录' ,error : req.flash('error').toString(),user: req.session.user});
  	});
  	app.post('/login', function(req, res){
	  	Userservice.login(req,res);
  	});

    /**
     * 微博首页路由
     */
  	app.all('/post', Userservice.checkLogin);
  	app.get('/post',function(req,res){
        PostService.getAllPost(req,res);
  	});
 	app.post('/post',function(req,res){
        PostService.insertPost(req,res);
  	});

    //单条微博
    app.get('/post/:postId', function (req, res) {
        PostService.getOnePostById(req,res);
    });

    //删除微博
    app.all('/post/deletePost/:postId',Userservice.checkLogin);
    app.get('/post/deletePost/:postId', function (req, res) {
        PostService.deleteOnePostById(req,res);
    });

    /**
     * 个人主页
     */
    app.all('/post/user/:username',Userservice.checkLogin);
    app.get('/post/user/:username', function (req, res) {
        PostService.userHomePage(req,res);
    });

    /**
     * 评论操作
     */
    app.post('/comment',function(req,res){
        PostService.insertComment(req,res);
    });

    /**
     * 登出操作
     */
  	app.get('/logout', Userservice.checkLogin);
	app.get('/logout',function(req,res){
		req.session.user = null;
  		req.flash('success','登出成功!');
  		res.redirect('/');
	});

    /**
     * 查找用户
     */
    app.all('/find',Userservice.checkLogin);
    app.get('/find',Userservice.findUsers);

    /**
     * 关注用户
     */
    app.all('/user/followUser',Userservice.checkLogin);
    app.get('/user/followUser',Userservice.followUser);

    /**
     * 修改个人信息
     */
    app.all('/user/modify',Userservice.checkLogin);
    app.get('/user/modify',function(req,res){
        res.render('modify', { title: '个人主页', typeName:'个人主页',error : req.flash('error2modify').toString(),success: req.flash('success2modify').toString(),user: req.session.user});
    });
    app.post('/user/modify',Userservice.modifyInformation);

    /**
     * 私信
     */
    app.all('/message',Userservice.checkLogin);
    app.get('/message',MessageService.findNameMessByToName);

    app.all('/messList',Userservice.checkLogin);
    app.get('/messList',MessageService.findMessNames);
};

