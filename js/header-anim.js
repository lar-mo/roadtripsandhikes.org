// Credit:
// https://codepen.io/nickcil/pen/sfutl
// https://stackoverflow.com/questions/13725263/changing-background-opacity-of-div-using-rgba
$(window).scroll(function(){
    $("header").css("background-color", 'rgba(0, 0, 0,' + (0.0 + $(window).scrollTop() / 300) + ')');
    $(".hero_text").css("opacity", 1.0 - $(window).scrollTop()/350);
    $("#hero_title_card").css("opacity", 1.25 - $(window).scrollTop()/190);
    // console.log(1.0 - $(window).scrollTop()/600);
});
