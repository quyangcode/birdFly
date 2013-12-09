
$(function(){
    $('.media').on('click',function(){
        var name = $(this).attr('name');
        window.location = '/message?toName=' + name;
    })
});
