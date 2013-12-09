
var mongodb = require('./db');
var ObjectID = require("mongodb").ObjectID;



function Message(name,data,toName,type) {
    this.name = name;
    this.data = data;
    this.toName = toName;
    this.type = type;
}

function Message(mess){
    this.name = mess.name;
    this.data = mess.data;
    this.date = new Date();
    this.status = 1;
    this.toName = mess.toName;
    this.type = mess.type;
}

module.exports = Message;

//存储一条私信
Message.prototype.save = function(callback) {
    var message = this;
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('messages', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(message,{safe:true},function(err,mess){
                mongodb.close();
                return callback(err);
            });
        });
    });
};

//查询所有私信过的人的最近一条私信内容
Message.getMessNameList = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('messages',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //group(keys, condition, initial, reduce, command, callback)
            collection.group(['toName','name'],{'$or':[{name:name},{toName:name}]},{'date':0},
                function findNewMess(doc,prev){
                    if(doc.date > prev.date){
                        prev._id = doc._id;
                        prev.name = doc.name;
                        prev.toName = doc.toName;
                        prev.data = doc.data;
                        prev.date = doc.date;
                    }
                },function(err,results){
                mongodb.close();
                return callback(err,results);
            });
        });
    });
}

Message.getMessagesByName = function(name,toName,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('messages',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({'$or':[{'name':name,'toName':toName,'status':1},{'name':toName,'toName':name,'status':1}]}).sort({_id:-1}).toArray(function(err,messages){
                if(err){
                    console.error('查询用户私信对话内容失败,name='+name+',toName='+toName+',err='+err);
                }
                mongodb.close();
                return callback(err,messages);
            });
        });
    });
}
