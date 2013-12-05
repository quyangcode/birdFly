/**
 * Created with JetBrains WebStorm.
 * User: quyang
 * Date: 13-11-2
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */
var Message = require('../models/message.js');
var async = require('async');

function MessageService(){}

module.exports = MessageService;

/**
 * 私信列表页
 * @param req
 * @param res
 */
MessageService.findMessList = function(req,res){
    var name = req.session.user.name;
    Message.getMessNameList(name,function(err,messages){
        if(err){
            console.error('查询私信失败,name='+name+',err='+err);
            messages = [];
        }
        var results = dealRepeatMess(messages);
        res.render('messList',{title: '私信', typeName:'私信' ,user: req.session.user,messList:results});
    });
}

MessageService.insertMess = function(mess){
    var message = new Message(mess);
    message.save(function(err){
        if(err){
            console.error('新增私信失败,err='+err);
        }
    });
}
/**
 * 私信detail页
 * @param req
 * @param res
 */
MessageService.findMessDetail = function(req,res){
    var name = req.session.user.name;
    var toName = req.query.toName;
    Message.getMessagesByName(name,toName,function(err,messages){
        if(err){
            messages = [];
        }
        res.render('message',{ title: '私信', typeName:'私信' ,user: req.session.user,toName : toName,messages:messages});
    });

}

function dealRepeatMess(messages){
    var results = [];
    for(var m = 0;m < messages.length;m++){
        for(var n = m+1;n < messages.length;n++){
            if(messages[m].name == messages[n].toName){
                if(messages[m].date > messages[n].date){
                    results.push(messages[m]);
                }else{
                    results.push(messages[n]);
                }
            }
        }
    }
    return results;
}


