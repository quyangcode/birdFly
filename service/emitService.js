///**
// * type
// * 1   私信消息
// * 2   关注消息
// * 3   @消息
// * 4   评论消息
// */
//
//function Emit(io,type){
//    if(type == 1){
//        io.sockets.on('connection',done());
//    }
//
//};
//
//module.exports = Emit;
//
//var MessageService = require('./service/messageService.js');
//
////使用socket-io实现私信
//function crea
//    socket.on('createMessage', function (message) {
//        if(message != null && message.toName != null){
//            var name = message.toName;
//            socket.broadcast.emit(name + 'Message',message);
//            MessageService.insertMess(message);
//        }
//    });
//});