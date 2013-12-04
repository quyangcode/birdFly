var mongodb = require('./db');
var ObjectID = require("mongodb").ObjectID;
var PageList = require('./pageList');

function Post(name,post,srcPicture,status) {
    this.name = name;
    this.post = post;
    this.time = new Date();
    this.srcPicture = srcPicture;
    this.comments = [];
    this.status = status;
}

module.exports = Post;

/**
 * 存储一篇微博及其相关信息
 * @param callback
 */
Post.prototype.save = function(callback) {
    var post = this;
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档插入 posts 集合   第二个参数保证插入失败时可以返回错误 不加的话 是否插入成功都不会报错 即err为空
            collection.insert(post, {safe: true}, function (err, post) {
                mongodb.close();
                callback(err);
            });
        });
    });
};


/**
 * 获得name用户的所有微博
 * @param name
 * @param callback
 */
Post.get = function(name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            query.status = 1;
            //根据 query 对象查询文章
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        });
    });
};

/**
 * 获取一篇文章 根据id
 * @param id
 * @param callback
 */
Post.getOne = function(id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据用户名、发表日期及文章名进行查询
            collection.findOne({
                "_id": ObjectID.createFromHexString(id),
                "status" : 1
            }, function (err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                if(doc != null){
                    doc.comments.sort(function(a,b){
                        return a > b ? -1:1;
                    });
                }
                callback(null, doc);//返回查询的一篇文章
            });
        });
    });
};

/**
 * 获取系统微博最新的num条数据
 * @param num
 * @param callback
 */
Post.getNumPostForIndex = function(num, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据用户名、发表日期及文章名进行查询
            collection.find({}).sort({time:-1}).limit(num).toArray(function(err,docs){
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        });
    });
};

/**
 * 删除微博
 * @param id
 * @param callback
 */
Post.remove = function(id,name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({_id:ObjectID(id),name:name},{$set : {status:0}},function(err,post){
                mongodb.close();
                if(err){
                    console.log("删除微博异常:" + err);
                }
                callback(err,post);
            });
        });
    });

};

/**
 * 分页获取微博
 * @param name 用户名
 * @param pageSize 每页条数
 * @param index 当前页
 * @param callback
 */
Post.pagePost = function(friend,pageSize,index,callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (friend.friends.length != 0) {
                query.name = {$in:friend.friends};
            }
            query.status = 1;
            collection.count(query,function(err,count){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                var pageList = new PageList(pageSize,index,count,null);
                //根据 query 对象查询文章
                collection.find(query).sort({time: -1}).limit(pageSize).skip(pageList.getStartItem()).toArray(function (err, posts) {
                    mongodb.close();
                    if (err) {
                        posts = [];
                        pageList.valueList = posts;
                        return callback(err,pageList);//失败！返回 err
                    }
                    if(null == posts){
                        posts = [];
                    }
                    pageList.valueList = posts;
                    callback(null, pageList);
                });
            });

        });
    });
};



