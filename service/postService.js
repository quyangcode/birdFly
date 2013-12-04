/**
 * 微博相关业务操作
 */

var Post = require('../models/post.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');

var PAGE_SIZE_DEFAULT = 6;
function PostService() {
}

module.exports = PostService;

/**
 * 推荐页 推荐微博
 * @param req
 * @param res
 */
PostService.getNumPostForIndex = function (req, res) {
    Post.getNumPostForIndex(6, function (err, posts) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '推荐页',
            typeName: '推荐页',
            posts: posts,
            user: null
        });
    });

};

/**
 * 获得登录用户的所有微博 分页
 * @param req
 * @param res
 */
PostService.getAllPost = function (req, res) {
    var page = req.query.page || 1;
    if(page <= 0){
        page = 1;
    }
    var currentUser = req.session.user;
    User.getAllFollowUsers(currentUser.name,function(err,docs){
        if(err){
            req.flash('error', err);
        }
        docs.friends.push(currentUser.name);
        Post.pagePost(docs,PAGE_SIZE_DEFAULT,page,function (err2, posts) {
            if (err2) {
                console.log(err2);
            }
            res.render('post', {
                title: '首页',
                typeName: '首页',
                user: req.session.user,
                posts: posts
            });
        });
    });
};

/**
 * 发表微博
 * @param req
 * @param res
 */
PostService.insertPost = function (req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post, null, 1);
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/post');
        }
        res.redirect('/post');
    });
};

/**
 * 根据ID获得微博
 * @param req
 * @param res
 */
PostService.getOnePostById = function (req, res) {
    Post.getOne(req.params.postId, function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/post');
        }
        res.render('postone', {
            title: '首页',
            typeName: '首页',
            post: post,
            user: req.session.user
        });
    });
};

/**
 * 根据ID删除微博 异步调用 返回是否成功的json
 * @param req
 * @param res
 */
PostService.deleteOnePostById = function (req, res) {
    var result = {};
    Post.remove(req.params.postId,req.session.user.name,function (err, post) {
        if (err || post != 1) {
            result.code = 1;
        } else{
            result.code = 0;
        }
        res.send(result);
    });
};

/**
 * 个人主页
 * @param req
 * @param res
 */
PostService.userHomePage = function (req, res) {
    var page = req.query.page || 1;
    if(page <= 0){
        page = 1;
    }
    var username = req.params.username;
    var friend = {friends:[username]};
    Post.pagePost(friend,PAGE_SIZE_DEFAULT,page,function (err, posts) {
        if (err) {
            posts = [];
        }
        res.render('user', {
            title: username + '的主页',
            typeName: '个人主页',
            user: req.session.user,
            posts: posts
        });
    });
};

/**
 * 评论微博
 * @param req
 * @param res
 */
PostService.insertComment = function (req, res) {
    var comment = new Comment(req.session.user.name, req.body.comment);
    comment.save(req.body.postId, function (err) {
        if (err) {
            req.flash('error', err);
        }
        return res.redirect('/post/' + req.body.postId);
    });
};



