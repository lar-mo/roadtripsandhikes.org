$(document).ready(function(){

  $(".tiles").click(function(){
    $(this).toggle();
    $(this.nextElementSibling).fadeToggle(750);
  });

  $(".content").click(function(){
    $(this).toggle();
    $(this.previousElementSibling).fadeToggle(750);
  });

  // $('header').click(function(){
  //   $('body').load(location.href);
  // });

  // $('.empty_row').click(function(){
  //   $('body').load(location.href);
  // })
  //
  // $('.close_link').click(function(){
  //   $('.tiles').load(location.href);
  // })

});
