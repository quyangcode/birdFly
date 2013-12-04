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

MessageService.findMessNames = function(req,res){
    var name = req.session.user.name;
    Message.getMessNameList(name,function(err,result){
        if(err){
            console.error('查询私信失败,name='+name+',err='+err);
            result = [];
        }
        if(result.length > 0){

        }
        res.render('messList',{title: '私信', typeName:'私信' ,user: req.session.user,messList:result});
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

MessageService.findNameMessByToName = function(req,res){
    var name = req.session.user.name;
    var toName = req.query.toName;
    Message.getMessagesByName(name,toName,function(err,messages){
        if(err){
            messages = [];
        }
        res.render('message',{ title: '私信', typeName:'私信' ,user: req.session.user,toName : toName,messages:messages});
    });

}


