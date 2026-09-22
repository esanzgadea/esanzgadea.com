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
      layoutMode: 'masonry',
      percentPosition: true,
      masonry: {
        columnWidth: '.archive-sizer'
      },
      transitionDuration: '420ms'
    });
    var categoryFilter = '*';
    var textFilter = '';

    $(window).resize(function() {
      $container.isotope({
        masonry: {
          columnWidth: '.archive-sizer'
        }
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
      var total = $container.find('.archive-piece').length;
      var visible = $container.data('isotope') ? $container.data('isotope').filteredItems.length : total;
      $('#archive-count').text(visible);
      $('#archive-count-label').text(visible === 1 ? 'entry' : 'entries');
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
    var initializePreview = function($project, images) {
      var $image = $project.find('img').first();
      var original = images[0] || $image.attr('src');
      var index = 0;
      var timer = null;

      if (!images.length) return;

      $image.attr('src', original);
      if (images.length < 2) return;

      images.forEach(function(src) {
        var preload = new Image();
        preload.src = src;
      });

      var showNext = function() {
        index = (index + 1) % images.length;
        $image.attr('src', images[index]);
        $image.one('load', function() {
          $('#portfolio-grid').isotope('layout');
        });
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
    };

    $('.archive-project[data-preview]').each(function() {
      var $project = $(this);
      var images = ($project.attr('data-preview') || '').split('|').filter(Boolean);
      initializePreview.call(this, $project, images);
    });

    $('.archive-project[data-auto-preview]').each(function() {
      var project = this;
      var $project = $(project);
      var basePath = $project.attr('data-preview-path') || '';
      var startIndex = parseInt($project.attr('data-preview-start') || '1', 10);
      var extensions = ($project.attr('data-preview-extensions') || 'jpg,png,jpeg,webp,gif').split(',');
      var cacheVersion = $project.attr('data-preview-version') || '';
      var images = [];

      var finish = function() {
        initializePreview.call(project, $project, images);
      };

      var tryIndex = function(index, extensionIndex) {
        if (extensionIndex >= extensions.length) {
          finish();
          return;
        }

        var extension = extensions[extensionIndex].trim();
        var src = basePath + index + '.' + extension + (cacheVersion ? '?v=' + encodeURIComponent(cacheVersion) : '');
        var preload = new Image();

        preload.onload = function() {
          images.push(src);
          tryIndex(index + 1, 0);
        };

        preload.onerror = function() {
          tryIndex(index, extensionIndex + 1);
        };

        preload.src = src;
      };

      tryIndex(startIndex, 0);
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

  var autoProjectGallery = function() {
    $('[data-auto-gallery]').each(function() {
      var gallery = this;
      var $gallery = $(gallery);
      var basePath = $gallery.attr('data-gallery-path') || 'assets/images/';
      var maxImages = parseInt($gallery.attr('data-gallery-max') || '15', 10);
      var startIndex = parseInt($gallery.attr('data-gallery-start') || '0', 10);
      var altText = $gallery.attr('data-gallery-alt') || 'Project image';
      var extensions = ($gallery.attr('data-gallery-extensions') || 'jpg,png,jpeg,webp').split(',');
      var cacheVersion = $gallery.attr('data-gallery-version') || '';
      var captionSource = document.querySelector('[data-gallery-captions]');
      var galleryCaptions = {};
      var pending = maxImages - startIndex + 1;
      var foundImages = [];
      var loaderSpace = document.createElement('div');
      var loader = document.createElement('div');

      if (captionSource) {
        try {
          galleryCaptions = JSON.parse(captionSource.textContent);
        } catch (error) {
          galleryCaptions = {};
        }
      }

      if ($gallery.data('gallery-ready')) return;
      $gallery.data('gallery-ready', true);
      $gallery.addClass('is-loading');
      loader.className = 'project-gallery-loader';
      loader.setAttribute('role', 'status');
      loader.setAttribute('aria-live', 'polite');
      loader.setAttribute('aria-label', 'Loading project images');
      loaderSpace.className = 'project-gallery-loader-space';
      loaderSpace.appendChild(loader);
      gallery.parentNode.insertBefore(loaderSpace, gallery);

      var renderGallery = function() {
        if (pending > 0) return;
        foundImages.sort(function(a, b) {
          return a.index - b.index;
        });
        foundImages.forEach(function(item) {
          addImage(item.src, item.index);
        });
        $gallery.removeClass('is-loading');
        loader.classList.add('is-complete');
        window.setTimeout(function() {
          if (loaderSpace.parentNode) loaderSpace.parentNode.removeChild(loaderSpace);
        }, 220);
        gallery.setAttribute('data-gallery-loaded', 'true');
        gallery.dispatchEvent(new CustomEvent('auto-gallery-ready'));
      };

      var addImage = function(src, index) {
        var figure = document.createElement('figure');
        figure.className = 'project-image';

        var image = document.createElement('img');
        var captionData = galleryCaptions[String(index)];
        image.src = src;
        image.className = 'img-fluid project-lightbox-image';
        image.alt = altText + ' ' + index;

        figure.appendChild(image);

        if (captionData) {
          var caption = document.createElement('figcaption');
          var captionTitle = document.createElement('span');
          var fullCaption = captionData.title + ' ' + captionData.text;

          caption.className = 'project-gallery-caption';
          captionTitle.className = 'project-gallery-caption-title';
          captionTitle.textContent = captionData.title + ' ';
          caption.appendChild(captionTitle);
          caption.appendChild(document.createTextNode(captionData.text));
          figure.appendChild(caption);
          image.setAttribute('data-caption', fullCaption);
        }

        gallery.appendChild(figure);
      };

      var tryImage = function(index, extensionIndex) {
        if (extensionIndex >= extensions.length) {
          pending -= 1;
          renderGallery();
          return;
        }

        var extension = extensions[extensionIndex].trim();
        var src = basePath + index + '.' + extension + (cacheVersion ? '?v=' + encodeURIComponent(cacheVersion) : '');
        var image = new Image();

        image.onload = function() {
          foundImages.push({ src: src, index: index });
          pending -= 1;
          renderGallery();
        };

        image.onerror = function() {
          tryImage(index, extensionIndex + 1);
        };

        image.src = src;
      };

      for (var index = startIndex; index <= maxImages; index += 1) {
        tryImage(index, 0);
      }
    });
  }

  var staticProjectGallery = function() {
    $('[data-static-gallery]').each(function() {
      var gallery = this;
      var $gallery = $(gallery);
      var images = gallery.querySelectorAll('img');
      var pending = images.length;
      var loaderSpace = document.createElement('div');
      var loader = document.createElement('div');

      if ($gallery.data('gallery-ready')) return;
      $gallery.data('gallery-ready', true);

      if (!pending) return;

      $gallery.addClass('is-loading');
      loader.className = 'project-gallery-loader';
      loader.setAttribute('role', 'status');
      loader.setAttribute('aria-live', 'polite');
      loader.setAttribute('aria-label', 'Loading project images');
      loaderSpace.className = 'project-gallery-loader-space';
      loaderSpace.appendChild(loader);
      gallery.parentNode.insertBefore(loaderSpace, gallery);

      var imageReady = function() {
        pending -= 1;
        if (pending > 0) return;

        $gallery.removeClass('is-loading');
        loader.classList.add('is-complete');
        window.setTimeout(function() {
          if (loaderSpace.parentNode) loaderSpace.parentNode.removeChild(loaderSpace);
        }, 220);
        gallery.setAttribute('data-gallery-loaded', 'true');
        gallery.dispatchEvent(new CustomEvent('static-gallery-ready'));
      };

      Array.prototype.forEach.call(images, function(image) {
        if (image.complete) {
          imageReady();
          return;
        }
        image.addEventListener('load', imageReady, { once: true });
        image.addEventListener('error', imageReady, { once: true });
      });
    });
  }

  autoProjectGallery();
  staticProjectGallery();

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
