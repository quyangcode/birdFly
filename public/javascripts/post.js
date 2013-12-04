$(function(){
    $('#postArea').on('keyup',function(e){
        var size = $(this).val().length;
        var maxSize = 4;
        if(size > maxSize){
            $('#inform').text('已经超过');
            $('#postNum').text(size - maxSize).addClass('postNum-danger');
        }else{
            $('#inform').text('还可以输入');
            $('#postNum').text(maxSize - size).removeClass('postNum-danger');
        }
    });

    var socket = io.connect('http://localhost:3000');
    var onName = $('#messLi').attr('name');
    socket.on(onName + 'Message', function (message) {
        $('#messLi a').attr('href','/message?toName='+message.name);
        newMess(message);
    });

    var title = $('title').text();

    function newMess(message){
        var name = message.name;
        $('title').text('【您的新私信】'+name);
        $('#messLi').addClass('newMessage');
        setTimeout(function(){
            $('title').text(title);
            $('#messLi').removeClass('newMessage');
            setTimeout(function(){newMess(message);},1000);
        },1000);
    }
});
