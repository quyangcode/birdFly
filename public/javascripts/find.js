$(function(){
    $('.unFollow').on('click',function(){
        var url = '/user/followUser?followUserName=' + $(this).attr('data-name') + '&followType=' + 0;
        var btn = $(this);
        $.getJSON(url,function(data){
            if(data.code == 0){
                btn.next().text('未关注');
            }else{
                alert('取消关注失败，请稍后再试');
            }
        });
    });
    $('.follow').on('click',function(){
        var url = '/user/followUser?followUserName=' + $(this).attr('data-name') + '&followType=' + 1;
        var btn = $(this);
        $.getJSON(url,function(data){
            if(data.code == 0){
                btn.next().text('已关注');
            }else{
                alert('关注失败，请稍后再试');
            }
        });
    });
});
