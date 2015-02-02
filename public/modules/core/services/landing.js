'use strict';

/* global Circles */

$(document).ready(function () {
  /********************************************************************
   2) ScrollBar
   ************/
  $('html').niceScroll({
    cursorcolor: '#777',
    cursoropacitymax: 0.7,
    cursorwidth: '9',
    cursorborder: 'none',
    cursorborderradius: '10px',
    background: '#ccc',
    zindex: '9999999',
    touchbehavior: false
  });

  $('#contact-collapse-1').on('hidden.bs.collapse', function () {
    $('html').getNiceScroll().resize();
  });

  $('#contact-collapse-1').on('shown.bs.collapse', function () {
    $('html').getNiceScroll().resize();
  });

  /********************************************************************
   3) Slideshow Heigth
   *******************/
  function maxHeight() {
    var slideshowheight = $(window).height();
    $('.slideshow .item').css('min-height', slideshowheight - 46);
  }

  function minAppEntranceDivHeight() {
    var windowHeight = $(window).height();
    var footerHeight = $('.footer').height();
    $('.app-entrance-div').css('min-height', windowHeight - footerHeight);
  }

  maxHeight();
  minAppEntranceDivHeight();

  $(window).on('resize', maxHeight);
  $(window).on('resize', minAppEntranceDivHeight);

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
      $('html').getNiceScroll().resize();
      animate_elems();
    });

  });

  /********************************************************************
   11) Component Contact - Send Ajax
   *********************************/

  //reset previously set border colors and hide all message on .keyup()
  $('.contact-form input[required=true], .contact-form textarea[required=true]').keyup(function () {
    $(this).css('border-color', '');
    $('.slideshow .item').slideUp();
  });

  /********************************************************************
   12) Social Buttons - Tooltips
   *****************************/
  $('a[data-toggle=tooltip]').tooltip();

});


$(window).scroll(function () {

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
