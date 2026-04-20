(function() {
  'use strict';

  // Polyfills for older browsers
  if (!Array.from) {
    Array.from = function(object) {
      return [].slice.call(object);
    };
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  if (!Element.prototype.matches) {
    Element.prototype.matches = 
      Element.prototype.msMatchesSelector || 
      Element.prototype.webkitMatchesSelector;
  }

  // Utility functions - ES5 compatible
  function $(selector, context) {
    context = context || document;
    return context.querySelector(selector);
  }

  function $$(selector, context) {
    context = context || document;
    return Array.from(context.querySelectorAll(selector));
  }

  function on(element, event, handler) {
    if (element && element.addEventListener) {
      element.addEventListener(event, handler);
    }
  }

  function addClass(el, className) {
    if (el && el.classList) {
      el.classList.add(className);
    } else if (el) {
      var classes = el.className.split(' ');
      if (classes.indexOf(className) === -1) {
        el.className += ' ' + className;
      }
    }
  }

  function removeClass(el, className) {
    if (el && el.classList) {
      el.classList.remove(className);
    } else if (el) {
      var classes = el.className.split(' ');
      var index = classes.indexOf(className);
      if (index > -1) {
        classes.splice(index, 1);
        el.className = classes.join(' ');
      }
    }
  }

  function hasClass(el, className) {
    if (el && el.classList) {
      return el.classList.contains(className);
    } else if (el) {
      return el.className.split(' ').indexOf(className) > -1;
    }
    return false;
  }

  function setStyle(el, property, value) {
    if (el && el.style) {
      el.style[property] = value;
    }
  }

  // Mobile Menu
  function initMobileMenu() {
    var toggle = $('[data-menu-toggle]');
    var nav = $('[data-nav]');
    var overlay = $('[data-overlay]');
    var body = document.body;

    if (!toggle || !nav) return;

    function openMenu() {
      addClass(nav, 'active');
      if (overlay) addClass(overlay, 'active');
      addClass(body, 'menu-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      removeClass(nav, 'active');
      if (overlay) removeClass(overlay, 'active');
      removeClass(body, 'menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    on(toggle, 'click', function() {
      if (hasClass(nav, 'active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      on(overlay, 'click', closeMenu);
    }

    on(document, 'keydown', function(e) {
      if (e.key === 'Escape' && hasClass(nav, 'active')) {
        closeMenu();
      }
    });
  }

  // Product Gallery
  function initProductGallery() {
    var gallery = $('[data-gallery]');
    if (!gallery) return;

    var featuredImg = $('[data-featured-image]');
    var thumbs = $$('[data-thumb]');

    if (!featuredImg || thumbs.length === 0) return;

    thumbs.forEach(function(thumb) {
      on(thumb, 'click', function() {
        var newSrc = thumb.getAttribute('data-thumb');
        if (featuredImg && newSrc) {
          setStyle(featuredImg, 'opacity', '0');
          
          setTimeout(function() {
            featuredImg.src = newSrc;
            setStyle(featuredImg, 'opacity', '1');
          }, 200);

          thumbs.forEach(function(t) {
            removeClass(t, 'active');
          });
          addClass(thumb, 'active');
        }
      });
    });
  }

  // Quantity Selector
  function initQuantitySelectors() {
    $$('[data-qty-input]').forEach(function(input) {
      var container = input.closest('.quantity-selector');
      if (!container) return;

      var minusBtn = $('[data-qty-minus], [data-action="minus"]', container);
      var plusBtn = $('[data-qty-plus], [data-action="plus"]', container);

      function updateValue(delta) {
        var value = parseInt(input.value, 10) || 1;
        value = Math.max(1, value + delta);
        input.value = value;
        
        var event;
        if (typeof Event === 'function') {
          event = new Event('change', { bubbles: true });
        } else {
          event = document.createEvent('Event');
          event.initEvent('change', true, true);
        }
        input.dispatchEvent(event);
      }

      if (minusBtn) {
        on(minusBtn, 'click', function() {
          updateValue(-1);
        });
      }

      if (plusBtn) {
        on(plusBtn, 'click', function() {
          updateValue(1);
        });
      }
    });
  }

  // Scroll Animations with fallback
  function initScrollAnimations() {
    var animatedElements = $$('[data-animate]');
    if (animatedElements.length === 0) return;

    // Check for IntersectionObserver support
    if (typeof IntersectionObserver !== 'undefined') {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var delay = parseInt(entry.target.getAttribute('data-delay'), 10) || 0;
            setTimeout(function() {
              addClass(entry.target, 'animated');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback: Add animated class immediately for browsers without IntersectionObserver
      animatedElements.forEach(function(el) {
        addClass(el, 'animated');
      });
    }
  }

  // Header Scroll Behavior
  function initHeaderScroll() {
    var header = $('[data-header]');
    if (!header) return;

    var lastScroll = 0;
    var ticking = false;

    function updateHeader() {
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > 100) {
        setStyle(header, 'background', 'rgba(10, 10, 10, 0.95)');
      } else {
        setStyle(header, 'background', 'rgba(10, 10, 10, 0.8)');
      }

      if (currentScroll > lastScroll && currentScroll > 200) {
        setStyle(header, 'transform', 'translateY(-100%)');
      } else {
        setStyle(header, 'transform', 'translateY(0)');
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    on(window, 'scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  // Quick Add to Cart - Using XMLHttpRequest for broad compatibility
  function initQuickAdd() {
    $$('[data-quick-add]').forEach(function(btn) {
      on(btn, 'click', function(e) {
        e.preventDefault();
        
        var variantId = btn.getAttribute('data-quick-add');
        if (!variantId) return;

        btn.disabled = true;
        var originalText = btn.innerHTML;
        btn.innerHTML = '<span>Adding...</span>';

        function resetButton() {
          setTimeout(function() {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 2000);
        }

        function handleSuccess() {
          btn.innerHTML = '<span>Added!</span>';
          setStyle(btn, 'background', '#c9a962');

          // Update cart count via separate request
          var cartXhr = new XMLHttpRequest();
          cartXhr.open('GET', '/cart.js', true);
          cartXhr.onreadystatechange = function() {
            if (cartXhr.readyState === 4 && cartXhr.status === 200) {
              try {
                var cartData = JSON.parse(cartXhr.responseText);
                var cartCount = $('[data-cart-count]');
                if (cartCount) {
                  cartCount.textContent = cartData.item_count;
                }
              } catch (err) {
                // Silently fail cart count update
              }
            }
          };
          cartXhr.send();

          setTimeout(function() {
            setStyle(btn, 'background', '');
            resetButton();
          }, 2000);
        }

        function handleError() {
          btn.innerHTML = '<span>Error</span>';
          resetButton();
        }

        // Build form data manually for compatibility
        var formData = 'form_type=product&utf8=%E2%9C%93&id=' + encodeURIComponent(variantId) + '&quantity=1';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/cart/add.js', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              handleSuccess();
            } else {
              handleError();
            }
          }
        };

        xhr.onerror = handleError;
        xhr.send(formData);
      });
    });
  }

  // Smooth Scroll with fallback
  function initSmoothScroll() {
    on(document, 'click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (href === '#') return;

      var target = $(href);
      if (target) {
        e.preventDefault();
        
        // Check for smooth scroll support
        if ('scrollBehavior' in document.documentElement.style) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback for IE and older browsers
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo(0, targetPosition);
        }
      }
    });
  }

  // Cart quantity update handlers
  function initCartQuantity() {
    $$('[data-qty-update]').forEach(function(btn) {
      on(btn, 'click', function() {
        var itemId = btn.getAttribute('data-qty-update');
        var action = btn.getAttribute('data-action');
        var input = $('input[name="updates[' + itemId + ']"]');
        
        if (!input) return;

        var currentVal = parseInt(input.value, 10) || 0;
        var newVal = action === 'plus' ? currentVal + 1 : Math.max(0, currentVal - 1);
        
        input.value = newVal;
        
        // Auto-submit form if quantity reaches 0
        if (newVal === 0) {
          var form = input.closest('form');
          if (form) {
            // For Salla, we might need to handle removal differently
            // This triggers the form update
            var event;
            if (typeof Event === 'function') {
              event = new Event('change', { bubbles: true });
            } else {
              event = document.createEvent('Event');
              event.initEvent('change', true, true);
            }
            input.dispatchEvent(event);
          }
        }
      });
    });

    // Handle remove item buttons
    $$('[data-remove-item]').forEach(function(btn) {
      on(btn, 'click', function() {
        var itemId = btn.getAttribute('data-remove-item');
        var input = $('input[name="updates[' + itemId + ']"]');
        
        if (input) {
          input.value = 0;
          var form = input.closest('form');
          if (form) {
            form.submit();
          }
        }
      });
    });
  }

  // Initialize all modules
  function init() {
    initMobileMenu();
    initProductGallery();
    initQuantitySelectors();
    initScrollAnimations();
    initHeaderScroll();
    initQuickAdd();
    initSmoothScroll();
    initCartQuantity();
  }

  // Run on DOM ready - cross-browser compatible
  if (document.readyState === 'loading') {
    on(document, 'DOMContentLoaded', init);
  } else {
    init();
  }
})();
