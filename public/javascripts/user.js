function deletePost(postId){
    console.log(postId);
    $('#deleteDialog').attr('vid',postId).dialog('open');
    return false;
}

$(function(){
    $('#deleteDialog').dialog({
        autoOpen: false,
        width: 300,
        buttons: {
            "确认": function () {
                $(this).dialog("close");
                var url = "/post/deletePost/" + $('#deleteDialog').attr('vid');
                $.getJSON(url,function(data){
                    if(data.code == 0){
                        location = location;
                    }else{
                        $("#deleteError").text('删除微博失败,有问题请求助管理员...').show();
                    }
                });
            },
            "取消": function () {
                $(this).dialog("close");
            }
        }
    });

    $('#modifyBtn').on('click',function(){
        location = '/user/modify/';
    });
});

