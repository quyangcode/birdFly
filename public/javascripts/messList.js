/**
 * Created with JetBrains WebStorm.
 * User: quyang
 * Date: 13-11-7
 * Time: 下午5:49
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    $('.media').on('click',function(){
        var name = $(this).attr('name');
        window.location = '/message?toName=' + name;
    })
});
