/*------------------------------------------------------------------
Project:  Mos7 - Responsive Bootstrap 3 App Landing Page Template
Version:  1.3
Last change:  29/12/2014
Design by:  TemplatesPRO.com.br

Script (line):
- WINDOW.LOAD (32)
  1) Preloader (36)

- DOCUMENT.READY (44)
  2) Scrollbar (48)
  3) Slideshow Heigth (69)
  4) Background-size iOS - fix (80)
    - Component Slideshow (82)
    - Component Stats (115)
    - Component Call to Action (155)
  5) Component Slideshow - Carousel (196)
  6) Navbar Fixed to Top (203)
  7) ScrollTo - Navigation (212)
  8) Component Gallery - Carousel (225)
  9) Component Testimonials - Carousel (252)
  10) Animations and Component Stats - Circle Stats (259)
  11) Component Contact - Send Ajax (366)
  12) Social Buttons - Tooltips (420)

- WINDOW.SCROLL (427)
  13) Parallax Effect (431)
  14) Go Top - Scroll (441)
-------------------------------------------------------------------*/

$(window).load(function () {
  "use strict";

  /********************************************************************
   1) Preloader
   ************/
  $("#status").fadeOut(); // will first fade out the loading animation
  $("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.

});


$(document).ready(function () {
  "use strict";

  /********************************************************************
   2) ScrollBar
   ************/
//  $("html").niceScroll({
//    cursorcolor: "#777",
//    cursoropacitymax: 0.7,
//    cursorwidth: "9",
//    cursorborder: "none",
//    cursorborderradius: "10px",
//    background: "#ccc",
//    zindex: "9999999",
//    touchbehavior: false
//  });

//  $('#contact-collapse-1').on('hidden.bs.collapse', function () {
//    $("html").getNiceScroll().resize();
//  })
//  $('#contact-collapse-1').on('shown.bs.collapse', function () {
//    $("html").getNiceScroll().resize();
//  })

  /********************************************************************
   3) Slideshow Heigth
   *******************/
  function maxHeight() {
    var slideshowheight = $(window).height();
    $(".slideshow .item").css('min-height', slideshowheight - 46);
  }

  maxHeight();
  $(window).on('resize', maxHeight);

  /********************************************************************
   4) Background-size iOS - fix
   **********************/
  /* Component Slideshow */
  function bgSlideshow() {
    var imgSlideshow = new Image();
    imgSlideshow.src = $(".slideshow .item").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");

    var imgWidth = imgSlideshow.width;
    var imgHeight = imgSlideshow.height;
    var widthSlideshow = $(".slideshow .item").width();
    var heightSlideshow = $(".slideshow .item").height();
    /* Step 1 - Get the ratio of the div + the image */
    var imgRatio = imgWidth/imgHeight;
    var divRatio = widthSlideshow/heightSlideshow;

    /* Step 2 - Work out which ratio is greater */
    if (imgRatio >= divRatio) {
      /* The Height is our constant */
      var divHeight = heightSlideshow;
      var scale = (divHeight / imgHeight);
      var divWidth = imgWidth * scale;
    } else {
      /* The Width is our constant */
      var divWidth = widthSlideshow;
      var scale = (divWidth / imgWidth);
      var divHeight = imgHeight * scale;
    }
    var cover = divWidth + 'px ' + divHeight + 'px';
    if (navigator.userAgent.match(/iPhone|iPad/i)) {
      $(".slideshow .item").css('background-size', cover);
    }
  }
  bgSlideshow();
  $(window).on('load', bgSlideshow);

  /********************************************************************
   5) Component Slideshow - Carousel
   *********************************/
  $('#slideshow-carousel-1').carousel({
    interval: 15000
  });

  /********************************************************************
   6) Navbar Fixed to Top
   **********************/
  $('.navbar').affix({
    offset: {
      top: $(window).height() - $('.navbar').height() - 2
    }
  });

  /********************************************************************
   7) ScrollTo - Navigation
   ************************/
  $('a[href^="#anch"]').on('click', function (event) {
    var target = $($(this).attr('href'));
    if (target.length) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
    }
  });

  /********************************************************************
   8) Component Gallery - Carousel
   *******************************/
  $('#gallery-carousel-1').slick({
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  /********************************************************************
   9) Component Testimonials - Carousel
   ************************************/
  $('#testimonials-carousel-1').carousel({
    interval: 10000
  });

  /********************************************************************
   10) Animations and Component Stats - Circle Stats
   ************************************************/
  $(function () {
    var $elems = $('.animateblock'),
        winheight = $(window).height(),
        fullheight = $(document).height();

    function animate_elems() {
      var wintop = $(window).scrollTop(); // calculate distance from top of window

      // loop through each item to check when it animates
      $elems.each(function () {
        var $elm = $(this);

        if ($elm.hasClass('animated')) {
          return true;
        } // if already animated skip to the next item

        var topcoords = $elm.offset().top; // element's distance from top of page in pixels

        function getWidth() {
          return window.innerWidth / 14;
        }

        if (wintop > (topcoords - (winheight * 0.7))) {
          // animate when top of the window is 3/4 above the element
          $elm.addClass('animated');

          if ($elm.hasClass('circle')) {

            // animate circles stats
            var circle1 = Circles.create({
              id: 'circle-1',
              radius: getWidth(),
              value: 25,
              maxValue: 100,
              width: 30,
              text: function (value) {
                return value + '%';
              },
              colors: ['#7a8691', '#d9534f'],
              duration: 1200,
              wrpClass: 'circles-wrp',
              textClass: 'circles-text'
            });
            var circle2 = Circles.create({
              id: 'circle-2',
              radius: getWidth(),
              value: 50,
              maxValue: 100,
              width: 30,
              text: function (value) {
                return value + '%';
              },
              colors: ['#7a8691', '#d9534f'],
              duration: 1200,
              wrpClass: 'circles-wrp',
              textClass: 'circles-text'
            });
            var circle3 = Circles.create({
              id: 'circle-3',
              radius: getWidth(),
              value: 75,
              maxValue: 100,
              width: 30,
              text: function (value) {
                return value + '%';
              },
              colors: ['#7a8691', '#d9534f'],
              duration: 1200,
              wrpClass: 'circles-wrp',
              textClass: 'circles-text'
            });
            var circle4 = Circles.create({
              id: 'circle-4',
              radius: getWidth(),
              value: 100,
              maxValue: 100,
              width: 30,
              text: function (value) {
                return value + '%';
              },
              colors: ['#7a8691', '#d9534f'],
              duration: 1200,
              wrpClass: 'circles-wrp',
              textClass: 'circles-text'
            });
            window.onresize = function (e) {
              circle1.updateRadius(getWidth());
              circle2.updateRadius(getWidth());
              circle3.updateRadius(getWidth());
              circle4.updateRadius(getWidth());
            };
          }

        }
      });
    } // end animate_elems()

    $(window).scroll(function () {
      $("html").getNiceScroll().resize();
      animate_elems();
    });

  });

  /********************************************************************
   11) Component Contact - Send Ajax
   *********************************/
//  $(".submit-form").on('click', function () {
//    var proceed = true;
//    //simple validation at client's end
//    //loop through each field and we simply change border color to red for invalid fields
//    $(".contact-form input[required=true], .contact-form textarea[required=true]").each(function () {
//      $(this).css('border-color', '');
//      if (!$.trim($(this).val())) { //if this field is empty
//        $(this).css('border-color', '#d9534f'); //change border color to red
//        proceed = false; //set do not proceed flag
//      }
//      //check invalid email
//      var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//      if ($(this).attr("type") === "email" && !email_reg.test($.trim($(this).val()))) {
//        $(this).css('border-color', '#d9534f'); //change border color to red
//        proceed = false; //set do not proceed flag
//      }
//    });
//
//    if (proceed) { //everything looks good! proceed...
//      //get input field values data to be sent to server
//      var post_data = {
//        'user_fname'     : $('input[name=fname]').val(),
//        'user_lname'     : $('input[name=lname]').val(),
//        'user_email'     : $('input[name=email]').val(),
//        'user_phone'     : $('input[name=phone]').val(),
//        'user_company'   : $('input[name=company]').val(),
//        'user_website'   : $('input[name=website]').val(),
//        'subject'        : $('input[name=subject]').val(),
//        'msg'            : $('textarea[name=message]').val()
//      };
//
//      //Ajax post data to server
//      $.post('contact.php', post_data, function (response) {
//        if (response.type === 'error') { //load json data from server and output message
//          var output = '<div class="alert alert-danger alert-dismissible" role="alert"><button class="close" data-dismiss="alert" type="button"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Error:&nbsp;&nbsp;</strong>' + response.text + '</div>';
//        } else {
//          var output = '<div class="alert alert-success alert-dismissible" role="alert"><button class="close" data-dismiss="alert" type="button"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Success!&nbsp;&nbsp;</strong>' + response.text + '</div>';
//          //reset values in all input fields
//          $(".contact-form input, .contact-form textarea").val('');
//        }
//        $(".alerts").hide().html(output).slideDown();
//      }, 'json');
//    }
//  });

  //reset previously set border colors and hide all message on .keyup()
  $(".contact-form input[required=true], .contact-form textarea[required=true]").keyup(function () {
    $(this).css('border-color', '');
    $(".slideshow .item").slideUp();
  });

  /********************************************************************
   12) Social Buttons - Tooltips
   *****************************/
  $('a[data-toggle=tooltip]').tooltip();

});


$(window).scroll(function () {
  "use strict";

  /********************************************************************
   13) Parallax Effect
   *******************/
  $('.parallax').each(function () {
    var $obj = $(this),
        yPos = -($(window).scrollTop() / $obj.data('speed')),
        bgpos = '50% ' + yPos + 'px';
    $obj.css('background-position', bgpos);
  });

  /********************************************************************
   14) Go Top - Scroll
   *******************/
  if ($(this).scrollTop() > 100) {
    $('.go-top').fadeIn();
  } else {
    $('.go-top').fadeOut();
  }

});
