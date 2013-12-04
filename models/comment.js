var mongodb = require('./db');
var ObjectID = require("mongodb").ObjectID;
function Comment(name,comment) {
    this.name = name;
    this.time = new Date();
    this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(postId,callback) {
    var comment = this;
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
            //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的 comments 数组里
            collection.update({"_id":ObjectID(postId)}, {
                $push: {"comments": comment}
            } , function (err, result) {
                mongodb.close();
                callback(null);
            });
        });
    });
};

