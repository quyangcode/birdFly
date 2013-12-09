$(function(){
    var socket = io.connect('http://localhost:3000');
    var onName = $('#messLi').attr('name');
    socket.on(onName + 'Message', function (message) {
        insertOtherMessage(message);
    });

    $('#mesBtn').on('click',function(){
        var message = {
            name : onName,
            data : $('#mesArea').val(),
            toName : $('#mesToName').text()
        };
        insertMyMessage(message);
        $('#mesArea').val('');
        socket.emit('createMessage', message);
    });

    function insertMyMessage(message){
        var htmls = [];
        htmls.push('<div class="panel"><h5><a href="post/user/' + message.name + '">' + message.name + '</a> 说:</h5></div>');
        htmls.push('<div class="media" style="width: 600px"><a class="pull-left"><img class="media-object portrait" src="/images/defaultSrc.jpg"></a>');
        htmls.push('<div class="media-body"><div class="well"><p>'+ message.data +'</p></div></div></div>');
        $('#mesDiv').prepend(htmls.join(''));
    }

    function insertOtherMessage(message){
        var htmls = [];
        htmls.push('<div class="panel text-right"><h5><a href="post/user/' + message.name + '">' + message.name + '</a> 说:</h5></div>');
        htmls.push('<div class="media" style="width: 600px;margin-left:360px"><a class="pull-right"><img class="media-object portrait" src="/images/defaultSrc.jpg"></a>');
        htmls.push('<div class="media-body"><div class="well text-right"><p>'+ message.data +'</p></div></div></div>');
        $('#mesDiv').prepend(htmls.join(''));
    }

});





