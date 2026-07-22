/**
* Template Name: MyPortfolio - v2.1.0
* Template URL: https://bootstrapmade.com/myportfolio-bootstrap-portfolio-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function($) {
  "use strict";
  var setArchiveRole = function() {};

  var burgerMenu = function() {
    $('.burger').click(function(e) {
      $(window).scrollTop(0);
      if (!$('.burger').hasClass('active'))
        $('.burger').addClass('active');
      else
        $('.burger').removeClass('active');
    });
  }
  burgerMenu();

  var siteIstotope = function() {
    var $container = $('#portfolio-grid');
    if (!$container.length) return;

    $container.isotope({
      itemSelector: '.item',
      layoutMode: 'fitRows',
      transitionDuration: '420ms'
    });
    var categoryFilter = '*';
    var textFilter = '';

    $(window).resize(function() {
      $container.isotope({
        columnWidth: '.col-sm-3'
      });
    });

    var archiveFilter = function() {
      var $item = $(this);
      var searchableText = [
        $item.attr('data-title'),
        $item.attr('data-year'),
        $item.attr('data-tags'),
        $item.text()
      ].join(' ').toLowerCase();
      var matchesCategory = categoryFilter === '*' || $item.is(categoryFilter);
      var matchesText = !textFilter || searchableText.indexOf(textFilter) !== -1;
      return matchesCategory && matchesText;
    };

    var updateArchiveCount = function() {
      var total = $container.find('.item').length;
      var visible = $container.data('isotope') ? $container.data('isotope').filteredItems.length : total;
      $('#archive-count').text(visible);
      $('.archive-empty').remove();
      if (total && !visible) {
        $container.after('<p class="archive-empty">No entries match this search.</p>');
      }
    };

    $container.isotope({ filter: archiveFilter });
    updateArchiveCount();

    $('#filters').on('click', 'a', function(e) {
      e.preventDefault();
      categoryFilter = $(this).attr('data-filter');
      setArchiveRole($(this).attr('data-role') || $(this).text());
      $container.isotope({
        filter: archiveFilter
      });
      $('#filters a').removeClass('active');
      $(this).addClass('active');
      updateArchiveCount();
    });

    $('#archive-search').on('input', function() {
      textFilter = $(this).val().toLowerCase().trim();
      $container.isotope({
        filter: archiveFilter
      });
      updateArchiveCount();
    });
  }

  var archivePreview = function() {
    $('.archive-project[data-preview]').each(function() {
      var $project = $(this);
      var $image = $project.find('img').first();
      var images = $project.attr('data-preview').split('|').filter(Boolean);
      var original = $image.attr('src');
      var index = 0;
      var timer = null;

      if (images.length < 2) return;

      images.forEach(function(src) {
        var preload = new Image();
        preload.src = src;
      });

      var showNext = function() {
        index = (index + 1) % images.length;
        $image.attr('src', images[index]);
      };

      $project.on('mouseenter focusin', function() {
        if (timer) return;
        index = Math.max(0, images.indexOf($image.attr('src')));
        showNext();
        timer = window.setInterval(showNext, 700);
      });

      $project.on('mouseleave focusout', function() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
        index = 0;
        $image.attr('src', original);
      });
    });
  }

  var typedRole = function() {
    var element = document.getElementById('typed-role');
    if (!element) return;

    var timeout = null;

    setArchiveRole = function(nextText) {
      var currentText = element.textContent;
      var targetText = nextText || element.getAttribute('data-default-role') || '';
      if (currentText === targetText) return;

      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }

      var deleteText = function() {
        if (element.textContent.length) {
          element.textContent = element.textContent.slice(0, -1);
          timeout = window.setTimeout(deleteText, 26);
          return;
        }
        writeText();
      };

      var writeText = function() {
        if (element.textContent.length < targetText.length) {
          element.textContent = targetText.slice(0, element.textContent.length + 1);
          timeout = window.setTimeout(writeText, 48);
        }
      };

      deleteText();
    };
  }

  $(window).on('load', function() {
    siteIstotope();
    archivePreview();
    typedRole();
  });

  var siteOwlCarousel = function() {
    $('.testimonial-carousel').owlCarousel({
      center: true,
      items: 1,
      loop: true,
      margin: 0,
      autoplay: true,
      smartSpeed: 1000,
    });
  };
  siteOwlCarousel();

  $(window).on('load', function() {
    AOS.init({
      easing: 'ease',
      duration: 1000,
      once: true
    });
  });

})(jQuery);
