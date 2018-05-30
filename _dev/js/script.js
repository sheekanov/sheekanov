$(document).ready(function(){
    //выбор пунктов в карьере
    (function(){
        var $careerList = $('.career__list-item');

        $careerList.on('click', function(event){
        var cnt = $careerList.index(event.target.closest('.career__list-item'));
    
        $('.career__pic-block').removeClass('career__pic-block--active');
        $('.career__pic-block').eq(cnt).addClass('career__pic-block--active');
    })
    }());
})