(function(){
    var htmls = [];
    var index = $('#pageDiv').attr('index');
    var url = $('#pageDiv').attr('data-src');
    for(var i = 1;i <= $('#pageList').attr('size');i++) {
        if(i == index){
            htmls.push('<li class="disabled"><a href="javascript:void(0)" >第'+ i + '页</a></li>');
        }else{
            htmls.push('<li><a href="'+ url + i +'">第'+ i + '页</a></li>');
        }
    }
    $('#pageList').html(htmls);
})();
$(function(){
    var url = $('#pageDiv').attr('data-src') ;
    $('#previousBtn').on('click',function(){
        var index = $('#pageDiv').attr('index') - 1;
        url = url + index;
        location = url;
    });
    $('#nextBtn').on('click',function(){
        var index = parseInt($('#pageDiv').attr('index')) + 1;
        url = url + index;
        location = url;
    });
});

