// When the user scrolls down 50px from the top of the document, resize the header's font size
window.onscroll = function() {scrollFunction()};
  function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    $('header').css('padding', '8px');
    $('#logo').css('width', '25px');
    $('header').css('box-shadow',        '3px 3px 5px 4px rgba(25,25,25,0.4)');
    $('header').css('-moz-box-shadow',   '3px 3px 5px 4px rgba(25,25,25,0.4)');
    $('header').css('-webkit-box-shadow','3px 3px 5px 4px rgba(25,25,25,0.4)');
    $('a.header_links').on('mouseover', function() {
      $(this).css('color', '#ff6633');
    }).on("mouseout", function() {
      $(this).css("color", "#fff");
    });
  } else {
    let win_width = $(window).width();
    if (win_width <= 414 ) {
      $('header').css('padding', '14px');
    } else {
      $('header').css('padding', '19px');
    }
    $('#logo').css('width', '50px');
    $('header').css('box-shadow','');
    $('header').css('-moz-box-shadow','');
    $('header').css('-webkit-box-shadow','');
    $('a.header_links').on('mouseover', function() {
      $(this).css('color', '#222');
    }).on("mouseout", function() {
      $(this).css("color", "#fff");
    });
  }
}
