// Credit:
// https://codepen.io/nickcil/pen/sfutl
// https://stackoverflow.com/questions/13725263/changing-background-opacity-of-div-using-rgba
$(window).scroll(function(){
    $("header").css("background-color", 'rgba(0, 0, 0,' + (0.0 + $(window).scrollTop() / 300) + ')');
    $(".hero_text").css("opacity", 1.0 - $(window).scrollTop()/350);
    $("#hero_title_card").css("opacity", 1.25 - $(window).scrollTop()/190);
    // console.log(1.0 - $(window).scrollTop()/600);
});

$(document).ready(function() {
  $('#logo').hover(function() {
    if ($(window).scrollTop() < 50) {
      $(this).attr('src', 'https://lar-mo.com/images/lar-mo_favicon_bw.png');
      $('#title').css("color","black");
    };
  },function() {
    $(this).attr('src', 'https://lar-mo.com/images/lar-mo_favicon.png');
    $('#title').css("color","white");
  });
  $('#title').hover(function() {
    if ($(window).scrollTop() < 50) {
      $('#logo').attr('src', 'https://lar-mo.com/images/lar-mo_favicon_bw.png');
      $(this).css("color","black");
    };
  },function() {
    $('#logo').attr('src', 'https://lar-mo.com/images/lar-mo_favicon.png');
    $(this).css("color","white");
  });
});
