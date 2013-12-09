$(function(){
    var isOver = {
        isOver : function(){
            return this.size() > this.MAX_SIZE;
        },
        MAX_SIZE : 140,
        size : function(){
            return $('#postArea').val().length;
        }
    };
    $('#postArea').on('keyup',function(e){
        if(isOver.isOver()){
            $('#inform').text('已经超过');
            $('#postNum').text(isOver.size() - isOver.MAX_SIZE).addClass('postNum-danger');
        }else{
            $('#inform').text('还可以输入');
            $('#postNum').text(isOver.MAX_SIZE - isOver.size()).removeClass('postNum-danger');
        }
    });

    $('#submitPost').on('click',function(){
        if(!isOver.isOver()){
            $('#postForm').submit();
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

    $('#transDialog').dialog({
        autoOpen: false,
        width: 450,
        height:240,
        buttons: {
            "确认": function () {
                $(this).dialog("close");
                var url = "/post";
                var post = {'post':$('#postDialog').val()};
                $.post(url,post,function(data){
                });
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

    $('#uploadBtn').on('click',function(){
        $('#uploadDialog').dialog('open');
        $('#hidePost').val($('#postArea').val());
    });


    $('#uploadDialog').dialog({
        autoOpen: false,
        width: 350,
        height:150,
        buttons: {
            "确认": function () {
                $(this).dialog("close");
                $('#upForm').submit();
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

    $('.picA').on('click',function(){
        $('#picDialog').dialog('open');
        var src = $(this).attr('vid').replace('public','');
        $('#picSrc').attr('src', src);
    });

    $('#picDialog').dialog({
        autoOpen: false,
        width: 200,
        height:280
    });

});

function showPost(text,author){
    $('#postDialog').val('//@' + author + ':' + text);
    $('#transDialog').dialog('open');
    return false;
};


