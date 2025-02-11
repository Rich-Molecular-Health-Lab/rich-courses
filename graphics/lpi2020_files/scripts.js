"use strict";

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

(function () {
  'use strict';
  /**
   * Element.closest() polyfill
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
   */

  if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    Element.prototype.closest = function (s) {
      var el = this;
      var ancestor = this;
      if (!document.documentElement.contains(el)) return null;

      do {
        if (ancestor.matches(s)) return ancestor;
        ancestor = ancestor.parentElement;
      } while (ancestor !== null);

      return null;
    };
  }

  var hasClass = function hasClass(el, cls) {
    if (el.className.match === undefined) return false;
    return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  };

  var addClass = function addClass(el, cls) {
    if (!hasClass(el, cls)) {
      el.className == "" ? el.className = cls : el.className += " " + cls;
    }
  };

  var removeClass = function removeClass(el, cls) {
    if (hasClass(el, cls)) {
      el.className = el.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ').trim();
    }
  };

  var toggleClass = function toggleClass(el, cls) {
    if (hasClass(el, cls)) removeClass(el, cls);else addClass(el, cls);
  };
  /**
    * Bind event listeners
    * useage:
    *
    * let element = document.querySelector('<element selector>');
    * listen(element, 'click', function(event) {
    *   --- code to execute on click---
    * });
    *
    */


  var listen = function listen(el, ev, cb) {
    if (el.addEventListener) el.addEventListener(ev, cb);else el.attachEvent('on' + ev, cb);
  };
  /**
    * array contains helper
    */


  var contains = function contains(a, obj) {
    var i = a.length;

    while (i--) {
      if (a[i] === obj) {
        return true;
      }
    }

    return false;
  };
  /**
    * on load handler
    *
    */


  var onLoad = function onLoad(callback) {
    if (document.readyState !== "loading") window.setTimeout(callback);else {
      if (window.addEventListener) window.addEventListener('load', callback);else window.attachEvent('onload', callback);
    }
  };

  window.__scrollHandlers = [];
  window.__resizeHandlers = [];
  /**
    * bind scroll events
    * combines scroll handlers and calls them with a single event listener for better performance
    */

  var onScroll = function onScroll(callback) {
    window.__scrollHandlers.push(callback);
  };

  var __setupScrollHandlers = function () {
    listen(window, 'scroll', function (e) {
      for (var i = 0, j = window.__scrollHandlers.length; i < j; i++) {
        window.__scrollHandlers[i].call(e);
      }
    });
  }();
  /**
    * bind window resize events
    * combines resize handlers and calls them with a single event listener for better performance
    */


  var onResize = function onResize(callback) {
    window.__resizeHandlers.push(callback);
  };

  var __setupResizeHandlers = function () {
    listen(window, 'resize', function (e) {
      for (var i = 0, j = window.__resizeHandlers.length; i < j; i++) {
        window.__resizeHandlers[i].call(e);
      }
    });
  }();
  /**
    * inView - returns true if element is visible in viewport
    * @arg threshold: min px of element that needs to be visible by before triggering
    */


  var inView = function inView(el) {
    var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var rect = el.getBoundingClientRect(); //  return (
    //    rect.bottom >= 0 && // bottom below top of window
    //    rect.right  >= 0 && // right inside right of window
    //    rect.top    <= (window.innerHeight || document.documentElement.clientHeight) && // top less than bottom of window
    //    rect.left   <= (window.innerWidth || document.documentElement.clientWidth) // left inside left of window
    // );

    return rect.bottom >= Math.min(threshold, window.innerHeight) && // bottom below top of window
    rect.right >= Math.min(threshold, window.innerWidth) && // right inside right of window
    rect.top <= Math.max(0, (window.innerHeight || document.documentElement.clientHeight) - threshold) && // top less than bottom of window
    rect.left <= Math.max(0, (window.innerWidth || document.documentElement.clientWidth) - threshold) // left inside left of window
    ;
  };
  /**
    * Set focus to element
    */


  var setFocus = function setFocus(el) {
    var allowScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var __x = window.scrollX,
        __y = window.scrollY;
    el.focus();
    if (!allowScroll) window.scrollTo(__x, __y);
  };
  /** animate scrolling */


  var easeInCubic = function easeInCubic(t) {
    return t * t * t;
  };

  var scrollToElement = function scrollToElement(startTime, currentTime, duration, scrollEndElemTop, startScrollOffset) {
    var runtime = currentTime - startTime;
    var progress = runtime / duration;
    progress = Math.min(progress, 1);
    var ease = easeInCubic(progress);
    window.scroll(0, startScrollOffset + scrollEndElemTop * ease);

    if (runtime < duration) {
      requestAnimationFrame(function (timestamp) {
        var currentTime = timestamp || new Date().getTime();
        scrollToElement(startTime, currentTime, duration, scrollEndElemTop, startScrollOffset);
      });
    }
  };

  var isElement = function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
  };
  /**
    * smooth scroll to an anchor point
    * useage:
    *
    * scrollTo('anchorID', 1000);
    *
    */


  var scrollTo = function scrollTo(selector) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1200;
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var target = isElement(selector) ? selector : document.querySelector(selector);
    var anim = requestAnimationFrame(function (timestamp) {
      var stamp = timestamp || new Date().getTime(),
          duration = time,
          start = stamp;
      var startScrollOffset = window.pageYOffset;
      var scrollEndElemTop = target.getBoundingClientRect().top + offset;
      scrollToElement(start, stamp, duration, scrollEndElemTop, startScrollOffset);
    });
  };
  /**
    * Animate with js
    * useage:
    * animate left position from 0 to 200px over 1 second:
    *
    * let element = document.querySelector('selector'),
    *     from = 0,
    *     to = 200;
    *
    * animate({
    *     timing: easing.circ,
    *     duration: 1000,
    *     draw: function(progress) {
    *       let value = ((to - from) * progress) + from;
    *       element.style.left = `${ value }px`;
    *     },
    *   });
    *
    */


  var animate = function animate(_ref) {
    var _this4 = this;

    var timing = _ref.timing,
        draw = _ref.draw,
        duration = _ref.duration,
        done = _ref.done,
        delay = _ref.delay;

    var _delay = delay || 0;

    var start = performance.now() + _delay,
        time = start;

    var animation = {
      __rai: null,
      __time: time,
      paused: false
    };

    var _animate = function _animate() {
      animation.__rai = requestAnimationFrame(function () {
        time = performance.now();
        var timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        if (timeFraction > 0) {
          // wait for delay
          var progress = timing(timeFraction);
          draw(progress);
        }

        if (timeFraction < 1) {
          animation.__rai = requestAnimationFrame(_animate);
        } else {
          if (done) done.call(_this4);
        }
      });
    };

    var _pause = function pause() {
      if (animation.__rai) {
        animation.__time = time - start; // time elapsed

        cancelAnimationFrame(animation.__rai);
        animation.paused = true;
      }
    };

    var _resume = function resume() {
      if (animation.paused) {
        start = performance.now() - animation.__time;
        time = performance.now();

        _animate();

        animation.paused = false;
      }
    };

    var _dispose = function dispose() {
      cancelAnimationFrame(animation.__rai);
      animation.__rai = null;
      animation.__time = 0;
    };

    _animate();

    return {
      pause: function pause() {
        return _pause();
      },
      resume: function resume() {
        return _resume();
      },
      dispose: function dispose() {
        return _dispose();
      },
      isPaused: function isPaused() {
        return animation.paused;
      }
    };
  };

  var easing = {
    linear: function linear(timeFraction) {
      return timeFraction;
    },
    circ: function circ(timeFraction) {
      return 1 - Math.sin(Math.acos(timeFraction));
    },
    cubic: function cubic(timeFraction) {
      return timeFraction * timeFraction * timeFraction;
    },
    outCubic: function outCubic(timeFraction) {
      return --timeFraction * timeFraction * timeFraction + 1;
    },
    quad: function quad(timeFraction) {
      return Math.pow(timeFraction, 4);
    },
    bounce: function bounce(timeFraction) {
      for (var a = 0, b = 1; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
          return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
        }
      }
    }
  };

  var triggerEvent = function triggerEvent(args) {
    var category = args.category,
        action = args.action,
        label = args.label;
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  };

  window.___triggerEvent = triggerEvent;

  (function () {
    var linkIsExternal = function linkIsExternal(link) {
      return link.hostname !== window.location.hostname;
    }; // track link clicks


    listen(document, 'click', function (e) {
      if (e.target.matches('.track-link') || e.target.closest('.track-link')) {
        var link = e.target.matches('.track-link') ? e.target : e.target.closest('.track-link');

        if (hasClass(link, 'pledge')) {
          triggerEvent({
            action: 'Pledge button clicks',
            category: 'Pledge',
            label: link.getAttribute('data-pledge')
          });
        }

        if (link.hasAttribute('data-download')) {
          triggerEvent({
            action: 'Download',
            category: 'Report',
            label: link.getAttribute('data-download')
          });
        } else if (linkIsExternal(link)) {
          triggerEvent({
            action: 'Click',
            category: 'External link',
            label: "".concat(window.location.pathname, " - ").concat(link.getAttribute('href'))
          });
        } else {
          triggerEvent({
            action: 'Button click',
            category: 'Button',
            label: "".concat(window.location.pathname, " - ").concat(link.getAttribute('href'))
          });
        }
      }

      if (e.target.matches('.track-video') || e.target.closest('.track-video')) {
        var _link = e.target.matches('.track-video') ? e.target : e.target.closest('.track-video');

        triggerEvent({
          action: 'Play',
          category: 'Video',
          label: _link.getAttribute('data-video-name')
        });
        window.___currentVideo = _link.getAttribute('data-video-name');
      }

      return true;
    });

    var addLinksToCopy = function addLinksToCopy() {
      var sww = document.querySelectorAll('.section-wysiwyg');

      for (var i = 0, j = sww.length; i < j; i++) {
        var links = sww[i].querySelectorAll('a');

        for (var k = 0, l = links.length; k < l; k++) {
          addClass(links[i], 'track-link');
        }
      }
    };

    onLoad(addLinksToCopy);
  })();

  (function () {
    var burgerChange = function burgerChange(x) {
      return toggleClass(x, "change");
    };

    var menuToggle = document.querySelector("#menu-toggle"),
        menu = document.querySelector("#menu");
    listen(menuToggle, "click", function (ev) {
      var menuOpen = hasClass(menu, "active"),
          newMenuOpenStatus = !menuOpen;
      toggleClass(document.body, 'noScroll');
      menuToggle.setAttribute("aria-expanded", newMenuOpenStatus);
      toggleClass(menu, "active");
      burgerChange(ev.currentTarget);
    });
    var menuToggleScroll = document.getElementById("navbar-responsive-toggle");

    var scrollFunction = function scrollFunction(ev) {
      var y = window.scrollY;

      if (y >= 125) {
        menuToggleScroll.className = "navbar-responsive-toggle afterScroll";
      } else {
        menuToggleScroll.className = "navbar-responsive-toggle beforeScroll";
      }
    };

    onScroll(scrollFunction);

    var toggleDropdown = function toggleDropdown(ev) {
      var dropdownToggle = ev.currentTarget,
          dropdownMenu = dropdownToggle.parentNode.querySelector('.menu-primary-dropdown-menu');

      if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.setAttribute('aria-hidden', 'true');
        removeClass(dropdownToggle.parentNode, 'dropdown-on');
      } else {
        dropdownToggle.setAttribute('aria-expanded', 'true');
        dropdownMenu.setAttribute('aria-hidden', 'false');
        addClass(dropdownToggle.parentNode, 'dropdown-on');
        dropdownMenu.children[0].focus();
      }

      return true;
    };

    var setupDropdown = function setupDropdown(dropdownToggle) {
      dropdownToggle.setAttribute('aria-haspopup', 'true');
      dropdownToggle.setAttribute('aria-expanded', 'false');
      var dropdownMenu = dropdownToggle.parentNode.querySelector('.menu-primary-dropdown-menu');
      dropdownMenu.setAttribute('aria-hidden', 'true');
      listen(dropdownToggle, 'click', toggleDropdown);
    };

    document.querySelectorAll('[data-toggle~=dropdown]').forEach(setupDropdown);
  })();

  (function () {
    var _this5 = this;

    var quizElement = document.querySelector(".js-quiz-element");
    if (typeof config === 'undefined' || quizElement === null) return;
    var _config = config,
        quiz = _config.quiz;
    var quizWrapper = document.querySelector('.quiz'),
        answerTitle = quiz.resultsTitle,
        quizStyle = "quiz",
        correctAnswerSubmitted = false;

    if (quizWrapper.hasAttribute('data-quiz-style')) {
      quizStyle = quizWrapper.getAttribute('data-quiz-style');
    }
    /* setup quiz and display question */


    var initQuiz = function initQuiz() {
      correctAnswerSubmitted = false;
      var output = "\n      <section class=\"quiz__answer-container js-quiz-answers\"></section>\n    ";
      quizElement.innerHTML = output;
      displayQuestion();
    };

    var displayQuestion = function displayQuestion() {
      var question = quiz,
          answers = document.querySelector(".js-quiz-answers"),
          output = ""; // reset styles

      quizElement.setAttribute('style', null);
      removeClass(quizElement, 'answered-correctly');
      removeClass(quizElement, 'answer-displayed');
      var questionElem = document.querySelector(".js-quiz-question");
      questionElem.innerText = quiz.question;

      for (var i = 0, j = quiz.options.length; i < j; i++) {
        output += "\n        <div class=\"quiz__answer\">\n          <input class=\"quiz__answer-input js-quiz-answer\" type=\"radio\" id=\"answer-".concat(i, "\" name=\"answers\" value=\"").concat(i, "\" />\n          <label class=\"quiz__answer-label js-quiz-label \"for=\"answer-").concat(i, "\" tabindex=\"1\">\n            <span class=\"quiz__answer-icon\">\n              <img class=\"correct\" src=\"https://f.hubspotusercontent20.net/hubfs/4783129/LPR/img/quiz-tick.svg\" alt=\"tick\" />\n              <img class=\"incorrect\" src=\"https://f.hubspotusercontent20.net/hubfs/4783129/LPR/img/quiz-cross.svg\" alt=\"cross\" />\n            </span>\n            ").concat(question.options[i], "</label>\n        </div>\n      ");
      }

      answers.innerHTML = output;
    };

    var displayResults = function displayResults() {
      var correctAnswerEl = document.querySelector('.quiz__answer.correct');
      var aRect = correctAnswerEl.getBoundingClientRect(),
          qRect = quizElement.getBoundingClientRect();
      var aLeft = aRect.left,
          aTop = aRect.top,
          qLeft = qRect.left,
          qTop = qRect.top;
      var leftDistance = aLeft - qLeft + 15;
      var slideToFirstCss = "\n      -webkit-transform: translate3d(-".concat(leftDistance, "px, 0px, 0) scale(1);\n      -moz-transform: translate3d(-").concat(leftDistance, "px, 0px, 0) scale(1);\n      -ms-transform: translate3d(-").concat(leftDistance, "px, 0px, 0) scale(1);\n      -o-transform: translate3d(-").concat(leftDistance, "px, 0px, 0) scale(1);\n      transform: translate3d(-").concat(leftDistance, "px, 0px, 0) scale(1);\n      transition: transform 500ms ease 400ms;\n    ");
      quizElement.style.minHeight = "".concat(quizElement.clientHeight + 30, "px"); // fixing min height temporarily here helps to prevent scroll position jumping when changing content
      // unset min height on next resize event - only call once

      var resizeHandlerContext,
          resizeHandler = function resizeHandler(ev) {
        quizElement.setAttribute('style', null);
        window.removeEventListener('resize', resizeHandlerContext);
      };

      resizeHandlerContext = resizeHandler.bind(_this5);
      window.addEventListener('resize', resizeHandlerContext); // let shareText = `I just got the correct answer in the quiz! ${ quiz.description }`;

      var shareButtons = document.getElementById('template-share-buttons').innerHTML;
      var resultsEl = document.createElement('div');
      resultsEl.className = "quiz__results inactive";
      var output = "\n      <h3 class=\"text-blue bold\">".concat(answerTitle, "</h3>\n      <p>").concat(quiz.description, "</p>\n      ").concat(shareButtons, " <br />\n      <button class=\"button button-text js-reset-quiz\">").concat(quiz.resetButtonText || "Reset", "</button>\n    ");
      resultsEl.innerHTML = output;
      quizElement.appendChild(resultsEl); // quizElement.closest('.section').setAttribute('data-social-message', shareText);

      setTimeout(function () {
        correctAnswerEl.setAttribute('style', slideToFirstCss);
        addClass(quizElement, 'answered-correctly');
        removeClass(document.querySelector('.quiz__results'), 'inactive');
        scrollTo('.quiz', 720, -40);
        addClass(document.querySelector('.js-quiz-element'), 'answer-displayed');
      }, 1);
    };

    var submitAnswer = function submitAnswer(e) {
      if (correctAnswerSubmitted) return false;
      var selectedAnswer = parseInt(e.target.value),
          correctAnswer = quiz.answer,
          answers = document.getElementsByName("answers");
      if (quizStyle == 'opinion') correctAnswer = selectedAnswer;
      var selected = e.target.parentElement; // clear selection

      for (var i = 0, j = answers.length; i < j; i++) {
        removeClass(answers[i].parentElement, 'correct');
        removeClass(answers[i].parentElement, 'incorrect');
      }

      if (selectedAnswer === correctAnswer) {
        correctAnswerSubmitted = true;
        addClass(selected, 'correct');
        setTimeout(function () {
          return displayResults();
        }, 1000);
      } else {
        addClass(selected, 'incorrect');
        setTimeout(function () {
          // clear selection after timeout
          removeClass(selected, 'incorrect');
          selected.querySelector('.js-quiz-answer').checked = false;
          selected.querySelector('.js-quiz-label').focus();
        }, 1000);
      }
    };

    var listen = function listen(ev, cb) {
      if (document.addEventListener) document.addEventListener(ev, cb, false);else document.attachEvent("on" + ev, cb);
    };

    listen("click", function (e) {
      if (e.target.matches('.js-reset-quiz')) initQuiz();
      return false;
    });
    listen("change", function (e) {
      if (e.target.matches('.js-quiz-answer')) submitAnswer(e);
      return false;
    });
    listen("keydown", function (e) {
      if ("key" in e && e.key == "Enter" || (e.keyCode ? e.keyCode : e.which) == 13) {
        document.activeElement.click();
      }

      return true;
    }); // start quiz

    initQuiz();
  })();

  (function () {
    var accs = document.querySelectorAll('.js-themes-acc-header');
    if (!accs.length) return;
    var tabs = document.querySelectorAll('.js-themes-tab-panel'),
        tbs = document.querySelectorAll('.js-themes-tab-button');

    var onClickAccHeader = function onClickAccHeader(e, acc) {
      var cont = acc.closest('.js-themes-tab-panel');
      var backgroundImageOverlayIdHeader = acc.closest('.js-themes-tab-panel').getAttribute('faqimagtabid');
      var bgHeader = document.querySelector("#section-themes-background-".concat(backgroundImageOverlayIdHeader));

      if (hasClass(cont, 'active')) {
        return removeClass(cont, 'active');
      }

      for (var i = 0, j = tabs.length; i < j; i++) {
        removeClass(tabs[i], 'active');
      }

      addClass(cont, 'active');
      bgHeader.src = cont.querySelector('.js-themes-tab-image').getAttribute('data-src');
    };

    var onClickTabButton = function onClickTabButton(e, tab) {
      var _tab = document.querySelector("#".concat(tab.getAttribute('aria-controls')));
      var backgroundImageOverlayIdTab = tab.getAttribute('faqimagtabid');
      var bgTab = document.querySelector("#section-themes-background-".concat(backgroundImageOverlayIdTab));

      for (var i = 0, j = tabs.length; i < j; i++) {
        removeClass(tabs[i], 'active');
        removeClass(tbs[i], 'active');
      }

      addClass(_tab, 'active');
      addClass(tab, 'active');
      bgTab.src = _tab.querySelector('.js-themes-tab-image').getAttribute('data-src');
    };

    var keychecks = {
      right: function right(e) {
        return "key" in e && e.key == "ArrowRight" || (e.keyCode ? e.keyCode : e.which) == 39;
      },
      left: function left(e) {
        return "key" in e && e.key == "ArrowLeft" || (e.keyCode ? e.keyCode : e.which) == 37;
      }
    };

    var configureKeyboardNav = function configureKeyboardNav() {
      var tablist = document.querySelector('.js-themes-tablist'); // Enable arrow navigation between tabs in the tab list

      var tabFocus = 0;
      listen(tablist, 'keydown', function (e) {
        // Move right
        if (keychecks.right(e)) {
          tbs[tabFocus].setAttribute("tabindex", -1);
          tabFocus++; // If we're at the end, go to the start

          if (tabFocus >= tbs.length) {
            tabFocus = 0;
          }

          tbs[tabFocus].setAttribute("tabindex", 0);
          tbs[tabFocus].focus();
        } else if (keychecks.left(e)) {
          tbs[tabFocus].setAttribute("tabindex", -1);
          tabFocus--; // If we're at the start, move to the end

          if (tabFocus < 0) {
            tabFocus = tbs.length - 1;
          }

          tbs[tabFocus].setAttribute("tabindex", 0);
          tbs[tabFocus].focus();
        }
      });
    }; // nb -preloading the images like this helps to speed up image change when there's no browser cache


    var preloadTabImages = function preloadTabImages() {
      var images = document.querySelectorAll('.js-themes-tab-image');

      for (var i = 0, j = images.length; i < j; i++) {
        new Image().src = images[i].getAttribute('data-src');
      }
    };

    var init = function init() {
      var _loop = function _loop(i, j) {
        listen(accs[i], 'click', function (e) {
          return onClickAccHeader(e, accs[i]);
        });
      };

      for (var i = 0, j = accs.length; i < j; i++) {
        _loop(i, j);
      }

      var _loop2 = function _loop2(_i4, _j) {
        listen(tbs[_i4], 'click', function (e) {
          return onClickTabButton(e, tbs[_i4]);
        });
      };

      for (var _i4 = 0, _j = tbs.length; _i4 < _j; _i4++) {
        _loop2(_i4, _j);
      }

      configureKeyboardNav();
      preloadTabImages();
    };

    onLoad(init);
  })();
  /*!
   * Glide.js v3.4.1
   * (c) 2013-2019 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
   * Released under the MIT License.
   */


  var defaults = {
    /**
     * Type of the movement.
     *
     * Available types:
     * `slider` - Rewinds slider to the start/end when it reaches the first or last slide.
     * `carousel` - Changes slides without starting over when it reaches the first or last slide.
     *
     * @type {String}
     */
    type: 'slider',

    /**
     * Start at specific slide number defined with zero-based index.
     *
     * @type {Number}
     */
    startAt: 0,

    /**
     * A number of slides visible on the single viewport.
     *
     * @type {Number}
     */
    perView: 1,

    /**
     * Focus currently active slide at a specified position in the track.
     *
     * Available inputs:
     * `center` - Current slide will be always focused at the center of a track.
     * `0,1,2,3...` - Current slide will be focused on the specified zero-based index.
     *
     * @type {String|Number}
     */
    focusAt: 0,

    /**
     * A size of the gap added between slides.
     *
     * @type {Number}
     */
    gap: 10,

    /**
     * Change slides after a specified interval. Use `false` for turning off autoplay.
     *
     * @type {Number|Boolean}
     */
    autoplay: false,

    /**
     * Stop autoplay on mouseover event.
     *
     * @type {Boolean}
     */
    hoverpause: true,

    /**
     * Allow for changing slides with left and right keyboard arrows.
     *
     * @type {Boolean}
     */
    keyboard: true,

    /**
     * Stop running `perView` number of slides from the end. Use this
     * option if you don't want to have an empty space after
     * a slider. Works only with `slider` type and a
     * non-centered `focusAt` setting.
     *
     * @type {Boolean}
     */
    bound: false,

    /**
     * Minimal swipe distance needed to change the slide. Use `false` for turning off a swiping.
     *
     * @type {Number|Boolean}
     */
    swipeThreshold: 80,

    /**
     * Minimal mouse drag distance needed to change the slide. Use `false` for turning off a dragging.
     *
     * @type {Number|Boolean}
     */
    dragThreshold: 120,

    /**
     * A maximum number of slides to which movement will be made on swiping or dragging. Use `false` for unlimited.
     *
     * @type {Number|Boolean}
     */
    perTouch: false,

    /**
     * Moving distance ratio of the slides on a swiping and dragging.
     *
     * @type {Number}
     */
    touchRatio: 0.5,

    /**
     * Angle required to activate slides moving on swiping or dragging.
     *
     * @type {Number}
     */
    touchAngle: 45,

    /**
     * Duration of the animation in milliseconds.
     *
     * @type {Number}
     */
    animationDuration: 400,

    /**
     * Allows looping the `slider` type. Slider will rewind to the first/last slide when it's at the start/end.
     *
     * @type {Boolean}
     */
    rewind: true,

    /**
     * Duration of the rewinding animation of the `slider` type in milliseconds.
     *
     * @type {Number}
     */
    rewindDuration: 800,

    /**
     * Easing function for the animation.
     *
     * @type {String}
     */
    animationTimingFunc: 'cubic-bezier(.165, .840, .440, 1)',

    /**
     * Throttle costly events at most once per every wait milliseconds.
     *
     * @type {Number}
     */
    throttle: 10,

    /**
     * Moving direction mode.
     *
     * Available inputs:
     * - 'ltr' - left to right movement,
     * - 'rtl' - right to left movement.
     *
     * @type {String}
     */
    direction: 'ltr',

    /**
     * The distance value of the next and previous viewports which
     * have to peek in the current view. Accepts number and
     * pixels as a string. Left and right peeking can be
     * set up separately with a directions object.
     *
     * For example:
     * `100` - Peek 100px on the both sides.
     * { before: 100, after: 50 }` - Peek 100px on the left side and 50px on the right side.
     *
     * @type {Number|String|Object}
     */
    peek: 0,

    /**
     * Collection of options applied at specified media breakpoints.
     * For example: display two slides per view under 800px.
     * `{
     *   '800px': {
     *     perView: 2
     *   }
     * }`
     */
    breakpoints: {},

    /**
     * Collection of internally used HTML classes.
     *
     * @todo Refactor `slider` and `carousel` properties to single `type: { slider: '', carousel: '' }` object
     * @type {Object}
     */
    classes: {
      direction: {
        ltr: 'glide--ltr',
        rtl: 'glide--rtl'
      },
      slider: 'glide--slider',
      carousel: 'glide--carousel',
      swipeable: 'glide--swipeable',
      dragging: 'glide--dragging',
      cloneSlide: 'glide__slide--clone',
      activeNav: 'glide__bullet--active',
      activeSlide: 'glide__slide--active',
      disabledArrow: 'glide__arrow--disabled'
    }
  };
  /**
   * Outputs warning message to the bowser console.
   *
   * @param  {String} msg
   * @return {Void}
   */

  function warn(msg) {
    console.error("[Glide warn]: " + msg);
  }

  var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return _typeof2(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
  };

  var classCallCheck = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + _typeof2(superClass));
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (_typeof2(call) === "object" || typeof call === "function") ? call : self;
  };
  /**
   * Converts value entered as number
   * or string to integer value.
   *
   * @param {String} value
   * @returns {Number}
   */


  function toInt(value) {
    return parseInt(value);
  }
  /**
   * Converts value entered as number
   * or string to flat value.
   *
   * @param {String} value
   * @returns {Number}
   */


  function toFloat(value) {
    return parseFloat(value);
  }
  /**
   * Indicates whether the specified value is a string.
   *
   * @param  {*}   value
   * @return {Boolean}
   */


  function isString(value) {
    return typeof value === 'string';
  }
  /**
   * Indicates whether the specified value is an object.
   *
   * @param  {*} value
   * @return {Boolean}
   *
   * @see https://github.com/jashkenas/underscore
   */


  function isObject(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return type === 'function' || type === 'object' && !!value; // eslint-disable-line no-mixed-operators
  }
  /**
   * Indicates whether the specified value is a number.
   *
   * @param  {*} value
   * @return {Boolean}
   */


  function isNumber(value) {
    return typeof value === 'number';
  }
  /**
   * Indicates whether the specified value is a function.
   *
   * @param  {*} value
   * @return {Boolean}
   */


  function isFunction(value) {
    return typeof value === 'function';
  }
  /**
   * Indicates whether the specified value is undefined.
   *
   * @param  {*} value
   * @return {Boolean}
   */


  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  /**
   * Indicates whether the specified value is an array.
   *
   * @param  {*} value
   * @return {Boolean}
   */


  function isArray(value) {
    return value.constructor === Array;
  }
  /**
   * Creates and initializes specified collection of extensions.
   * Each extension receives access to instance of glide and rest of components.
   *
   * @param {Object} glide
   * @param {Object} extensions
   *
   * @returns {Object}
   */


  function mount(glide, extensions, events) {
    var components = {};

    for (var name in extensions) {
      if (isFunction(extensions[name])) {
        components[name] = extensions[name](glide, components, events);
      } else {
        warn('Extension must be a function');
      }
    }

    for (var _name in components) {
      if (isFunction(components[_name].mount)) {
        components[_name].mount();
      }
    }

    return components;
  }
  /**
   * Defines getter and setter property on the specified object.
   *
   * @param  {Object} obj         Object where property has to be defined.
   * @param  {String} prop        Name of the defined property.
   * @param  {Object} definition  Get and set definitions for the property.
   * @return {Void}
   */


  function define(obj, prop, definition) {
    Object.defineProperty(obj, prop, definition);
  }
  /**
   * Sorts aphabetically object keys.
   *
   * @param  {Object} obj
   * @return {Object}
   */


  function sortKeys(obj) {
    return Object.keys(obj).sort().reduce(function (r, k) {
      r[k] = obj[k];
      return r[k], r;
    }, {});
  }
  /**
   * Merges passed settings object with default options.
   *
   * @param  {Object} defaults
   * @param  {Object} settings
   * @return {Object}
   */


  function mergeOptions(defaults, settings) {
    var options = _extends({}, defaults, settings); // `Object.assign` do not deeply merge objects, so we
    // have to do it manually for every nested object
    // in options. Although it does not look smart,
    // it's smaller and faster than some fancy
    // merging deep-merge algorithm script.


    if (settings.hasOwnProperty('classes')) {
      options.classes = _extends({}, defaults.classes, settings.classes);

      if (settings.classes.hasOwnProperty('direction')) {
        options.classes.direction = _extends({}, defaults.classes.direction, settings.classes.direction);
      }
    }

    if (settings.hasOwnProperty('breakpoints')) {
      options.breakpoints = _extends({}, defaults.breakpoints, settings.breakpoints);
    }

    return options;
  }

  var EventsBus = function () {
    /**
     * Construct a EventBus instance.
     *
     * @param {Object} events
     */
    function EventsBus() {
      var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, EventsBus);
      this.events = events;
      this.hop = events.hasOwnProperty;
    }
    /**
     * Adds listener to the specifed event.
     *
     * @param {String|Array} event
     * @param {Function} handler
     */


    createClass(EventsBus, [{
      key: 'on',
      value: function on(event, handler) {
        if (isArray(event)) {
          for (var i = 0; i < event.length; i++) {
            this.on(event[i], handler);
          }
        } // Create the event's object if not yet created


        if (!this.hop.call(this.events, event)) {
          this.events[event] = [];
        } // Add the handler to queue


        var index = this.events[event].push(handler) - 1; // Provide handle back for removal of event

        return {
          remove: function remove() {
            delete this.events[event][index];
          }
        };
      }
      /**
       * Runs registered handlers for specified event.
       *
       * @param {String|Array} event
       * @param {Object=} context
       */

    }, {
      key: 'emit',
      value: function emit(event, context) {
        if (isArray(event)) {
          for (var i = 0; i < event.length; i++) {
            this.emit(event[i], context);
          }
        } // If the event doesn't exist, or there's no handlers in queue, just leave


        if (!this.hop.call(this.events, event)) {
          return;
        } // Cycle through events queue, fire!


        this.events[event].forEach(function (item) {
          item(context || {});
        });
      }
    }]);
    return EventsBus;
  }();

  var Glide = function () {
    /**
     * Construct glide.
     *
     * @param  {String} selector
     * @param  {Object} options
     */
    function Glide(selector) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, Glide);
      this._c = {};
      this._t = [];
      this._e = new EventsBus();
      this.disabled = false;
      this.selector = selector;
      this.settings = mergeOptions(defaults, options);
      this.index = this.settings.startAt;
    }
    /**
     * Initializes glide.
     *
     * @param {Object} extensions Collection of extensions to initialize.
     * @return {Glide}
     */


    createClass(Glide, [{
      key: 'mount',
      value: function mount$$1() {
        var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this._e.emit('mount.before');

        if (isObject(extensions)) {
          this._c = mount(this, extensions, this._e);
        } else {
          warn('You need to provide a object on `mount()`');
        }

        this._e.emit('mount.after');

        return this;
      }
      /**
       * Collects an instance `translate` transformers.
       *
       * @param  {Array} transformers Collection of transformers.
       * @return {Void}
       */

    }, {
      key: 'mutate',
      value: function mutate() {
        var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        if (isArray(transformers)) {
          this._t = transformers;
        } else {
          warn('You need to provide a array on `mutate()`');
        }

        return this;
      }
      /**
       * Updates glide with specified settings.
       *
       * @param {Object} settings
       * @return {Glide}
       */

    }, {
      key: 'update',
      value: function update() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.settings = mergeOptions(this.settings, settings);

        if (settings.hasOwnProperty('startAt')) {
          this.index = settings.startAt;
        }

        this._e.emit('update');

        return this;
      }
      /**
       * Change slide with specified pattern. A pattern must be in the special format:
       * `>` - Move one forward
       * `<` - Move one backward
       * `={i}` - Go to {i} zero-based slide (eq. '=1', will go to second slide)
       * `>>` - Rewinds to end (last slide)
       * `<<` - Rewinds to start (first slide)
       *
       * @param {String} pattern
       * @return {Glide}
       */

    }, {
      key: 'go',
      value: function go(pattern) {
        this._c.Run.make(pattern);

        return this;
      }
      /**
       * Move track by specified distance.
       *
       * @param {String} distance
       * @return {Glide}
       */

    }, {
      key: 'move',
      value: function move(distance) {
        this._c.Transition.disable();

        this._c.Move.make(distance);

        return this;
      }
      /**
       * Destroy instance and revert all changes done by this._c.
       *
       * @return {Glide}
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this._e.emit('destroy');

        return this;
      }
      /**
       * Start instance autoplaying.
       *
       * @param {Boolean|Number} interval Run autoplaying with passed interval regardless of `autoplay` settings
       * @return {Glide}
       */

    }, {
      key: 'play',
      value: function play() {
        var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (interval) {
          this.settings.autoplay = interval;
        }

        this._e.emit('play');

        return this;
      }
      /**
       * Stop instance autoplaying.
       *
       * @return {Glide}
       */

    }, {
      key: 'pause',
      value: function pause() {
        this._e.emit('pause');

        return this;
      }
      /**
       * Sets glide into a idle status.
       *
       * @return {Glide}
       */

    }, {
      key: 'disable',
      value: function disable() {
        this.disabled = true;
        return this;
      }
      /**
       * Sets glide into a active status.
       *
       * @return {Glide}
       */

    }, {
      key: 'enable',
      value: function enable() {
        this.disabled = false;
        return this;
      }
      /**
       * Adds cuutom event listener with handler.
       *
       * @param  {String|Array} event
       * @param  {Function} handler
       * @return {Glide}
       */

    }, {
      key: 'on',
      value: function on(event, handler) {
        this._e.on(event, handler);

        return this;
      }
      /**
       * Checks if glide is a precised type.
       *
       * @param  {String} name
       * @return {Boolean}
       */

    }, {
      key: 'isType',
      value: function isType(name) {
        return this.settings.type === name;
      }
      /**
       * Gets value of the core options.
       *
       * @return {Object}
       */

    }, {
      key: 'settings',
      get: function get$$1() {
        return this._o;
      }
      /**
       * Sets value of the core options.
       *
       * @param  {Object} o
       * @return {Void}
       */
      ,
      set: function set$$1(o) {
        if (isObject(o)) {
          this._o = o;
        } else {
          warn('Options must be an `object` instance.');
        }
      }
      /**
       * Gets current index of the slider.
       *
       * @return {Object}
       */

    }, {
      key: 'index',
      get: function get$$1() {
        return this._i;
      }
      /**
       * Sets current index a slider.
       *
       * @return {Object}
       */
      ,
      set: function set$$1(i) {
        this._i = toInt(i);
      }
      /**
       * Gets type name of the slider.
       *
       * @return {String}
       */

    }, {
      key: 'type',
      get: function get$$1() {
        return this.settings.type;
      }
      /**
       * Gets value of the idle status.
       *
       * @return {Boolean}
       */

    }, {
      key: 'disabled',
      get: function get$$1() {
        return this._d;
      }
      /**
       * Sets value of the idle status.
       *
       * @return {Boolean}
       */
      ,
      set: function set$$1(status) {
        this._d = !!status;
      }
    }]);
    return Glide;
  }();

  function Run(Glide, Components, Events) {
    var Run = {
      /**
       * Initializes autorunning of the glide.
       *
       * @return {Void}
       */
      mount: function mount() {
        this._o = false;
      },

      /**
       * Makes glides running based on the passed moving schema.
       *
       * @param {String} move
       */
      make: function make(move) {
        var _this = this;

        if (!Glide.disabled) {
          Glide.disable();
          this.move = move;
          Events.emit('run.before', this.move);
          this.calculate();
          Events.emit('run', this.move);
          Components.Transition.after(function () {
            if (_this.isStart()) {
              Events.emit('run.start', _this.move);
            }

            if (_this.isEnd()) {
              Events.emit('run.end', _this.move);
            }

            if (_this.isOffset('<') || _this.isOffset('>')) {
              _this._o = false;
              Events.emit('run.offset', _this.move);
            }

            Events.emit('run.after', _this.move);
            Glide.enable();
          });
        }
      },

      /**
       * Calculates current index based on defined move.
       *
       * @return {Void}
       */
      calculate: function calculate() {
        var move = this.move,
            length = this.length;
        var steps = move.steps,
            direction = move.direction;
        var countableSteps = isNumber(toInt(steps)) && toInt(steps) !== 0;

        switch (direction) {
          case '>':
            if (steps === '>') {
              Glide.index = length;
            } else if (this.isEnd()) {
              if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
                this._o = true;
                Glide.index = 0;
              }
            } else if (countableSteps) {
              Glide.index += Math.min(length - Glide.index, -toInt(steps));
            } else {
              Glide.index++;
            }

            break;

          case '<':
            if (steps === '<') {
              Glide.index = 0;
            } else if (this.isStart()) {
              if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
                this._o = true;
                Glide.index = length;
              }
            } else if (countableSteps) {
              Glide.index -= Math.min(Glide.index, toInt(steps));
            } else {
              Glide.index--;
            }

            break;

          case '=':
            Glide.index = steps;
            break;

          default:
            warn('Invalid direction pattern [' + direction + steps + '] has been used');
            break;
        }
      },

      /**
       * Checks if we are on the first slide.
       *
       * @return {Boolean}
       */
      isStart: function isStart() {
        return Glide.index === 0;
      },

      /**
       * Checks if we are on the last slide.
       *
       * @return {Boolean}
       */
      isEnd: function isEnd() {
        return Glide.index === this.length;
      },

      /**
       * Checks if we are making a offset run.
       *
       * @param {String} direction
       * @return {Boolean}
       */
      isOffset: function isOffset(direction) {
        return this._o && this.move.direction === direction;
      }
    };
    define(Run, 'move', {
      /**
       * Gets value of the move schema.
       *
       * @returns {Object}
       */
      get: function get() {
        return this._m;
      },

      /**
       * Sets value of the move schema.
       *
       * @returns {Object}
       */
      set: function set(value) {
        var step = value.substr(1);
        this._m = {
          direction: value.substr(0, 1),
          steps: step ? toInt(step) ? toInt(step) : step : 0
        };
      }
    });
    define(Run, 'length', {
      /**
       * Gets value of the running distance based
       * on zero-indexing number of slides.
       *
       * @return {Number}
       */
      get: function get() {
        var settings = Glide.settings;
        var length = Components.Html.slides.length; // If the `bound` option is acitve, a maximum running distance should be
        // reduced by `perView` and `focusAt` settings. Running distance
        // should end before creating an empty space after instance.

        if (Glide.isType('slider') && settings.focusAt !== 'center' && settings.bound) {
          return length - 1 - (toInt(settings.perView) - 1) + toInt(settings.focusAt);
        }

        return length - 1;
      }
    });
    define(Run, 'offset', {
      /**
       * Gets status of the offsetting flag.
       *
       * @return {Boolean}
       */
      get: function get() {
        return this._o;
      }
    });
    return Run;
  }
  /**
   * Returns a current time.
   *
   * @return {Number}
   */


  function now() {
    return new Date().getTime();
  }
  /**
   * Returns a function, that, when invoked, will only be triggered
   * at most once during a given window of time.
   *
   * @param {Function} func
   * @param {Number} wait
   * @param {Object=} options
   * @return {Function}
   *
   * @see https://github.com/jashkenas/underscore
   */


  function throttle(func, wait, options) {
    var timeout = void 0,
        context = void 0,
        args = void 0,
        result = void 0;
    var previous = 0;
    if (!options) options = {};

    var later = function later() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function throttled() {
      var at = now();
      if (!previous && options.leading === false) previous = at;
      var remaining = wait - (at - previous);
      context = this;
      args = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        previous = at;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }

      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  var MARGIN_TYPE = {
    ltr: ['marginLeft', 'marginRight'],
    rtl: ['marginRight', 'marginLeft']
  };

  function Gaps(Glide, Components, Events) {
    var Gaps = {
      /**
       * Applies gaps between slides. First and last
       * slides do not receive it's edge margins.
       *
       * @param {HTMLCollection} slides
       * @return {Void}
       */
      apply: function apply(slides) {
        for (var i = 0, len = slides.length; i < len; i++) {
          var style = slides[i].style;
          var direction = Components.Direction.value;

          if (i !== 0) {
            style[MARGIN_TYPE[direction][0]] = this.value / 2 + 'px';
          } else {
            style[MARGIN_TYPE[direction][0]] = '';
          }

          if (i !== slides.length - 1) {
            style[MARGIN_TYPE[direction][1]] = this.value / 2 + 'px';
          } else {
            style[MARGIN_TYPE[direction][1]] = '';
          }
        }
      },

      /**
       * Removes gaps from the slides.
       *
       * @param {HTMLCollection} slides
       * @returns {Void}
      */
      remove: function remove(slides) {
        for (var i = 0, len = slides.length; i < len; i++) {
          var style = slides[i].style;
          style.marginLeft = '';
          style.marginRight = '';
        }
      }
    };
    define(Gaps, 'value', {
      /**
       * Gets value of the gap.
       *
       * @returns {Number}
       */
      get: function get() {
        return toInt(Glide.settings.gap);
      }
    });
    define(Gaps, 'grow', {
      /**
       * Gets additional dimentions value caused by gaps.
       * Used to increase width of the slides wrapper.
       *
       * @returns {Number}
       */
      get: function get() {
        return Gaps.value * (Components.Sizes.length - 1);
      }
    });
    define(Gaps, 'reductor', {
      /**
       * Gets reduction value caused by gaps.
       * Used to subtract width of the slides.
       *
       * @returns {Number}
       */
      get: function get() {
        var perView = Glide.settings.perView;
        return Gaps.value * (perView - 1) / perView;
      }
    });
    /**
     * Apply calculated gaps:
     * - after building, so slides (including clones) will receive proper margins
     * - on updating via API, to recalculate gaps with new options
     */

    Events.on(['build.after', 'update'], throttle(function () {
      Gaps.apply(Components.Html.wrapper.children);
    }, 30));
    /**
     * Remove gaps:
     * - on destroying to bring markup to its inital state
     */

    Events.on('destroy', function () {
      Gaps.remove(Components.Html.wrapper.children);
    });
    return Gaps;
  }
  /**
   * Finds siblings nodes of the passed node.
   *
   * @param  {Element} node
   * @return {Array}
   */


  function siblings(node) {
    if (node && node.parentNode) {
      var n = node.parentNode.firstChild;
      var matched = [];

      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== node) {
          matched.push(n);
        }
      }

      return matched;
    }

    return [];
  }
  /**
   * Checks if passed node exist and is a valid element.
   *
   * @param  {Element} node
   * @return {Boolean}
   */


  function exist(node) {
    if (node && node instanceof window.HTMLElement) {
      return true;
    }

    return false;
  }

  var TRACK_SELECTOR = '[data-glide-el="track"]';

  function Html(Glide, Components) {
    var Html = {
      /**
       * Setup slider HTML nodes.
       *
       * @param {Glide} glide
       */
      mount: function mount() {
        this.root = Glide.selector;
        this.track = this.root.querySelector(TRACK_SELECTOR);
        this.slides = Array.prototype.slice.call(this.wrapper.children).filter(function (slide) {
          return !slide.classList.contains(Glide.settings.classes.cloneSlide);
        });
      }
    };
    define(Html, 'root', {
      /**
       * Gets node of the glide main element.
       *
       * @return {Object}
       */
      get: function get() {
        return Html._r;
      },

      /**
       * Sets node of the glide main element.
       *
       * @return {Object}
       */
      set: function set(r) {
        if (isString(r)) {
          r = document.querySelector(r);
        }

        if (exist(r)) {
          Html._r = r;
        } else {
          warn('Root element must be a existing Html node');
        }
      }
    });
    define(Html, 'track', {
      /**
       * Gets node of the glide track with slides.
       *
       * @return {Object}
       */
      get: function get() {
        return Html._t;
      },

      /**
       * Sets node of the glide track with slides.
       *
       * @return {Object}
       */
      set: function set(t) {
        if (exist(t)) {
          Html._t = t;
        } else {
          warn('Could not find track element. Please use ' + TRACK_SELECTOR + ' attribute.');
        }
      }
    });
    define(Html, 'wrapper', {
      /**
       * Gets node of the slides wrapper.
       *
       * @return {Object}
       */
      get: function get() {
        return Html.track.children[0];
      }
    });
    return Html;
  }

  function Peek(Glide, Components, Events) {
    var Peek = {
      /**
       * Setups how much to peek based on settings.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.value = Glide.settings.peek;
      }
    };
    define(Peek, 'value', {
      /**
       * Gets value of the peek.
       *
       * @returns {Number|Object}
       */
      get: function get() {
        return Peek._v;
      },

      /**
       * Sets value of the peek.
       *
       * @param {Number|Object} value
       * @return {Void}
       */
      set: function set(value) {
        if (isObject(value)) {
          value.before = toInt(value.before);
          value.after = toInt(value.after);
        } else {
          value = toInt(value);
        }

        Peek._v = value;
      }
    });
    define(Peek, 'reductor', {
      /**
       * Gets reduction value caused by peek.
       *
       * @returns {Number}
       */
      get: function get() {
        var value = Peek.value;
        var perView = Glide.settings.perView;

        if (isObject(value)) {
          return value.before / perView + value.after / perView;
        }

        return value * 2 / perView;
      }
    });
    /**
     * Recalculate peeking sizes on:
     * - when resizing window to update to proper percents
     */

    Events.on(['resize', 'update'], function () {
      Peek.mount();
    });
    return Peek;
  }

  function Move(Glide, Components, Events) {
    var Move = {
      /**
       * Constructs move component.
       *
       * @returns {Void}
       */
      mount: function mount() {
        this._o = 0;
      },

      /**
       * Calculates a movement value based on passed offset and currently active index.
       *
       * @param  {Number} offset
       * @return {Void}
       */
      make: function make() {
        var _this = this;

        var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.offset = offset;
        Events.emit('move', {
          movement: this.value
        });
        Components.Transition.after(function () {
          Events.emit('move.after', {
            movement: _this.value
          });
        });
      }
    };
    define(Move, 'offset', {
      /**
       * Gets an offset value used to modify current translate.
       *
       * @return {Object}
       */
      get: function get() {
        return Move._o;
      },

      /**
       * Sets an offset value used to modify current translate.
       *
       * @return {Object}
       */
      set: function set(value) {
        Move._o = !isUndefined(value) ? toInt(value) : 0;
      }
    });
    define(Move, 'translate', {
      /**
       * Gets a raw movement value.
       *
       * @return {Number}
       */
      get: function get() {
        return Components.Sizes.slideWidth * Glide.index;
      }
    });
    define(Move, 'value', {
      /**
       * Gets an actual movement value corrected by offset.
       *
       * @return {Number}
       */
      get: function get() {
        var offset = this.offset;
        var translate = this.translate;

        if (Components.Direction.is('rtl')) {
          return translate + offset;
        }

        return translate - offset;
      }
    });
    /**
     * Make movement to proper slide on:
     * - before build, so glide will start at `startAt` index
     * - on each standard run to move to newly calculated index
     */

    Events.on(['build.before', 'run'], function () {
      Move.make();
    });
    return Move;
  }

  function Sizes(Glide, Components, Events) {
    var Sizes = {
      /**
       * Setups dimentions of slides.
       *
       * @return {Void}
       */
      setupSlides: function setupSlides() {
        var width = this.slideWidth + 'px';
        var slides = Components.Html.slides;

        for (var i = 0; i < slides.length; i++) {
          slides[i].style.width = width;
        }
      },

      /**
       * Setups dimentions of slides wrapper.
       *
       * @return {Void}
       */
      setupWrapper: function setupWrapper(dimention) {
        Components.Html.wrapper.style.width = this.wrapperSize + 'px';
      },

      /**
       * Removes applied styles from HTML elements.
       *
       * @returns {Void}
       */
      remove: function remove() {
        var slides = Components.Html.slides;

        for (var i = 0; i < slides.length; i++) {
          slides[i].style.width = '';
        }

        Components.Html.wrapper.style.width = '';
      }
    };
    define(Sizes, 'length', {
      /**
       * Gets count number of the slides.
       *
       * @return {Number}
       */
      get: function get() {
        return Components.Html.slides.length;
      }
    });
    define(Sizes, 'width', {
      /**
       * Gets width value of the glide.
       *
       * @return {Number}
       */
      get: function get() {
        return Components.Html.root.offsetWidth;
      }
    });
    define(Sizes, 'wrapperSize', {
      /**
       * Gets size of the slides wrapper.
       *
       * @return {Number}
       */
      get: function get() {
        return Sizes.slideWidth * Sizes.length + Components.Gaps.grow + Components.Clones.grow;
      }
    });
    define(Sizes, 'slideWidth', {
      /**
       * Gets width value of the single slide.
       *
       * @return {Number}
       */
      get: function get() {
        return Sizes.width / Glide.settings.perView - Components.Peek.reductor - Components.Gaps.reductor;
      }
    });
    /**
     * Apply calculated glide's dimensions:
     * - before building, so other dimentions (e.g. translate) will be calculated propertly
     * - when resizing window to recalculate sildes dimensions
     * - on updating via API, to calculate dimensions based on new options
     */

    Events.on(['build.before', 'resize', 'update'], function () {
      Sizes.setupSlides();
      Sizes.setupWrapper();
    });
    /**
     * Remove calculated glide's dimensions:
     * - on destoting to bring markup to its inital state
     */

    Events.on('destroy', function () {
      Sizes.remove();
    });
    return Sizes;
  }

  function Build(Glide, Components, Events) {
    var Build = {
      /**
       * Init glide building. Adds classes, sets
       * dimensions and setups initial state.
       *
       * @return {Void}
       */
      mount: function mount() {
        Events.emit('build.before');
        this.typeClass();
        this.activeClass();
        Events.emit('build.after');
      },

      /**
       * Adds `type` class to the glide element.
       *
       * @return {Void}
       */
      typeClass: function typeClass() {
        Components.Html.root.classList.add(Glide.settings.classes[Glide.settings.type]);
      },

      /**
       * Sets active class to current slide.
       *
       * @return {Void}
       */
      activeClass: function activeClass() {
        var classes = Glide.settings.classes;
        var slide = Components.Html.slides[Glide.index];

        if (slide) {
          slide.classList.add(classes.activeSlide);
          siblings(slide).forEach(function (sibling) {
            sibling.classList.remove(classes.activeSlide);
          });
        }
      },

      /**
       * Removes HTML classes applied at building.
       *
       * @return {Void}
       */
      removeClasses: function removeClasses() {
        var classes = Glide.settings.classes;
        Components.Html.root.classList.remove(classes[Glide.settings.type]);
        Components.Html.slides.forEach(function (sibling) {
          sibling.classList.remove(classes.activeSlide);
        });
      }
    };
    /**
     * Clear building classes:
     * - on destroying to bring HTML to its initial state
     * - on updating to remove classes before remounting component
     */

    Events.on(['destroy', 'update'], function () {
      Build.removeClasses();
    });
    /**
     * Remount component:
     * - on resizing of the window to calculate new dimentions
     * - on updating settings via API
     */

    Events.on(['resize', 'update'], function () {
      Build.mount();
    });
    /**
     * Swap active class of current slide:
     * - after each move to the new index
     */

    Events.on('move.after', function () {
      Build.activeClass();
    });
    return Build;
  }

  function Clones(Glide, Components, Events) {
    var Clones = {
      /**
       * Create pattern map and collect slides to be cloned.
       */
      mount: function mount() {
        this.items = [];

        if (Glide.isType('carousel')) {
          this.items = this.collect();
        }
      },

      /**
       * Collect clones with pattern.
       *
       * @return {Void}
       */
      collect: function collect() {
        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var slides = Components.Html.slides;
        var _Glide$settings = Glide.settings,
            perView = _Glide$settings.perView,
            classes = _Glide$settings.classes;
        var peekIncrementer = +!!Glide.settings.peek;
        var part = perView + peekIncrementer;
        var start = slides.slice(0, part);
        var end = slides.slice(-part);

        for (var r = 0; r < Math.max(1, Math.floor(perView / slides.length)); r++) {
          for (var i = 0; i < start.length; i++) {
            var clone = start[i].cloneNode(true);
            clone.classList.add(classes.cloneSlide);
            items.push(clone);
          }

          for (var _i = 0; _i < end.length; _i++) {
            var _clone = end[_i].cloneNode(true);

            _clone.classList.add(classes.cloneSlide);

            items.unshift(_clone);
          }
        }

        return items;
      },

      /**
       * Append cloned slides with generated pattern.
       *
       * @return {Void}
       */
      append: function append() {
        var items = this.items;
        var _Components$Html = Components.Html,
            wrapper = _Components$Html.wrapper,
            slides = _Components$Html.slides;
        var half = Math.floor(items.length / 2);
        var prepend = items.slice(0, half).reverse();
        var append = items.slice(half, items.length);
        var width = Components.Sizes.slideWidth + 'px';

        for (var i = 0; i < append.length; i++) {
          wrapper.appendChild(append[i]);
        }

        for (var _i2 = 0; _i2 < prepend.length; _i2++) {
          wrapper.insertBefore(prepend[_i2], slides[0]);
        }

        for (var _i3 = 0; _i3 < items.length; _i3++) {
          items[_i3].style.width = width;
        }
      },

      /**
       * Remove all cloned slides.
       *
       * @return {Void}
       */
      remove: function remove() {
        var items = this.items;

        for (var i = 0; i < items.length; i++) {
          Components.Html.wrapper.removeChild(items[i]);
        }
      }
    };
    define(Clones, 'grow', {
      /**
       * Gets additional dimentions value caused by clones.
       *
       * @return {Number}
       */
      get: function get() {
        return (Components.Sizes.slideWidth + Components.Gaps.value) * Clones.items.length;
      }
    });
    /**
     * Append additional slide's clones:
     * - while glide's type is `carousel`
     */

    Events.on('update', function () {
      Clones.remove();
      Clones.mount();
      Clones.append();
    });
    /**
     * Append additional slide's clones:
     * - while glide's type is `carousel`
     */

    Events.on('build.before', function () {
      if (Glide.isType('carousel')) {
        Clones.append();
      }
    });
    /**
     * Remove clones HTMLElements:
     * - on destroying, to bring HTML to its initial state
     */

    Events.on('destroy', function () {
      Clones.remove();
    });
    return Clones;
  }

  var EventsBinder = function () {
    /**
     * Construct a EventsBinder instance.
     */
    function EventsBinder() {
      var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, EventsBinder);
      this.listeners = listeners;
    }
    /**
     * Adds events listeners to arrows HTML elements.
     *
     * @param  {String|Array} events
     * @param  {Element|Window|Document} el
     * @param  {Function} closure
     * @param  {Boolean|Object} capture
     * @return {Void}
     */


    createClass(EventsBinder, [{
      key: 'on',
      value: function on(events, el, closure) {
        var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (isString(events)) {
          events = [events];
        }

        for (var i = 0; i < events.length; i++) {
          this.listeners[events[i]] = closure;
          el.addEventListener(events[i], this.listeners[events[i]], capture);
        }
      }
      /**
       * Removes event listeners from arrows HTML elements.
       *
       * @param  {String|Array} events
       * @param  {Element|Window|Document} el
       * @param  {Boolean|Object} capture
       * @return {Void}
       */

    }, {
      key: 'off',
      value: function off(events, el) {
        var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (isString(events)) {
          events = [events];
        }

        for (var i = 0; i < events.length; i++) {
          el.removeEventListener(events[i], this.listeners[events[i]], capture);
        }
      }
      /**
       * Destroy collected listeners.
       *
       * @returns {Void}
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        delete this.listeners;
      }
    }]);
    return EventsBinder;
  }();

  function Resize(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    var Resize = {
      /**
       * Initializes window bindings.
       */
      mount: function mount() {
        this.bind();
      },

      /**
       * Binds `rezsize` listener to the window.
       * It's a costly event, so we are debouncing it.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('resize', window, throttle(function () {
          Events.emit('resize');
        }, Glide.settings.throttle));
      },

      /**
       * Unbinds listeners from the window.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('resize', window);
      }
    };
    /**
     * Remove bindings from window:
     * - on destroying, to remove added EventListener
     */

    Events.on('destroy', function () {
      Resize.unbind();
      Binder.destroy();
    });
    return Resize;
  }

  var VALID_DIRECTIONS = ['ltr', 'rtl'];
  var FLIPED_MOVEMENTS = {
    '>': '<',
    '<': '>',
    '=': '='
  };

  function Direction(Glide, Components, Events) {
    var Direction = {
      /**
       * Setups gap value based on settings.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.value = Glide.settings.direction;
      },

      /**
       * Resolves pattern based on direction value
       *
       * @param {String} pattern
       * @returns {String}
       */
      resolve: function resolve(pattern) {
        var token = pattern.slice(0, 1);

        if (this.is('rtl')) {
          return pattern.split(token).join(FLIPED_MOVEMENTS[token]);
        }

        return pattern;
      },

      /**
       * Checks value of direction mode.
       *
       * @param {String} direction
       * @returns {Boolean}
       */
      is: function is(direction) {
        return this.value === direction;
      },

      /**
       * Applies direction class to the root HTML element.
       *
       * @return {Void}
       */
      addClass: function addClass() {
        Components.Html.root.classList.add(Glide.settings.classes.direction[this.value]);
      },

      /**
       * Removes direction class from the root HTML element.
       *
       * @return {Void}
       */
      removeClass: function removeClass() {
        Components.Html.root.classList.remove(Glide.settings.classes.direction[this.value]);
      }
    };
    define(Direction, 'value', {
      /**
       * Gets value of the direction.
       *
       * @returns {Number}
       */
      get: function get() {
        return Direction._v;
      },

      /**
       * Sets value of the direction.
       *
       * @param {String} value
       * @return {Void}
       */
      set: function set(value) {
        if (VALID_DIRECTIONS.indexOf(value) > -1) {
          Direction._v = value;
        } else {
          warn('Direction value must be `ltr` or `rtl`');
        }
      }
    });
    /**
     * Clear direction class:
     * - on destroy to bring HTML to its initial state
     * - on update to remove class before reappling bellow
     */

    Events.on(['destroy', 'update'], function () {
      Direction.removeClass();
    });
    /**
     * Remount component:
     * - on update to reflect changes in direction value
     */

    Events.on('update', function () {
      Direction.mount();
    });
    /**
     * Apply direction class:
     * - before building to apply class for the first time
     * - on updating to reapply direction class that may changed
     */

    Events.on(['build.before', 'update'], function () {
      Direction.addClass();
    });
    return Direction;
  }
  /**
   * Reflects value of glide movement.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */


  function Rtl(Glide, Components) {
    return {
      /**
       * Negates the passed translate if glide is in RTL option.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        if (Components.Direction.is('rtl')) {
          return -translate;
        }

        return translate;
      }
    };
  }
  /**
   * Updates glide movement with a `gap` settings.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */


  function Gap(Glide, Components) {
    return {
      /**
       * Modifies passed translate value with number in the `gap` settings.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        return translate + Components.Gaps.value * Glide.index;
      }
    };
  }
  /**
   * Updates glide movement with width of additional clones width.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */


  function Grow(Glide, Components) {
    return {
      /**
       * Adds to the passed translate width of the half of clones.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        return translate + Components.Clones.grow / 2;
      }
    };
  }
  /**
   * Updates glide movement with a `peek` settings.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */


  function Peeking(Glide, Components) {
    return {
      /**
       * Modifies passed translate value with a `peek` setting.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        if (Glide.settings.focusAt >= 0) {
          var peek = Components.Peek.value;

          if (isObject(peek)) {
            return translate - peek.before;
          }

          return translate - peek;
        }

        return translate;
      }
    };
  }
  /**
   * Updates glide movement with a `focusAt` settings.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */


  function Focusing(Glide, Components) {
    return {
      /**
       * Modifies passed translate value with index in the `focusAt` setting.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        var gap = Components.Gaps.value;
        var width = Components.Sizes.width;
        var focusAt = Glide.settings.focusAt;
        var slideWidth = Components.Sizes.slideWidth;

        if (focusAt === 'center') {
          return translate - (width / 2 - slideWidth / 2);
        }

        return translate - slideWidth * focusAt - gap * focusAt;
      }
    };
  }
  /**
   * Applies diffrent transformers on translate value.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */


  function mutator(Glide, Components, Events) {
    /**
     * Merge instance transformers with collection of default transformers.
     * It's important that the Rtl component be last on the list,
     * so it reflects all previous transformations.
     *
     * @type {Array}
     */
    var TRANSFORMERS = [Gap, Grow, Peeking, Focusing].concat(Glide._t, [Rtl]);
    return {
      /**
       * Piplines translate value with registered transformers.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      mutate: function mutate(translate) {
        for (var i = 0; i < TRANSFORMERS.length; i++) {
          var transformer = TRANSFORMERS[i];

          if (isFunction(transformer) && isFunction(transformer().modify)) {
            translate = transformer(Glide, Components, Events).modify(translate);
          } else {
            warn('Transformer should be a function that returns an object with `modify()` method');
          }
        }

        return translate;
      }
    };
  }

  function Translate(Glide, Components, Events) {
    var Translate = {
      /**
       * Sets value of translate on HTML element.
       *
       * @param {Number} value
       * @return {Void}
       */
      set: function set(value) {
        var transform = mutator(Glide, Components).mutate(value);
        Components.Html.wrapper.style.transform = 'translate3d(' + -1 * transform + 'px, 0px, 0px)';
      },

      /**
       * Removes value of translate from HTML element.
       *
       * @return {Void}
       */
      remove: function remove() {
        Components.Html.wrapper.style.transform = '';
      }
    };
    /**
     * Set new translate value:
     * - on move to reflect index change
     * - on updating via API to reflect possible changes in options
     */

    Events.on('move', function (context) {
      var gap = Components.Gaps.value;
      var length = Components.Sizes.length;
      var width = Components.Sizes.slideWidth;

      if (Glide.isType('carousel') && Components.Run.isOffset('<')) {
        Components.Transition.after(function () {
          Events.emit('translate.jump');
          Translate.set(width * (length - 1));
        });
        return Translate.set(-width - gap * length);
      }

      if (Glide.isType('carousel') && Components.Run.isOffset('>')) {
        Components.Transition.after(function () {
          Events.emit('translate.jump');
          Translate.set(0);
        });
        return Translate.set(width * length + gap * length);
      }

      return Translate.set(context.movement);
    });
    /**
     * Remove translate:
     * - on destroying to bring markup to its inital state
     */

    Events.on('destroy', function () {
      Translate.remove();
    });
    return Translate;
  }

  function Transition(Glide, Components, Events) {
    /**
     * Holds inactivity status of transition.
     * When true transition is not applied.
     *
     * @type {Boolean}
     */
    var disabled = false;
    var Transition = {
      /**
       * Composes string of the CSS transition.
       *
       * @param {String} property
       * @return {String}
       */
      compose: function compose(property) {
        var settings = Glide.settings;

        if (!disabled) {
          return property + ' ' + this.duration + 'ms ' + settings.animationTimingFunc;
        }

        return property + ' 0ms ' + settings.animationTimingFunc;
      },

      /**
       * Sets value of transition on HTML element.
       *
       * @param {String=} property
       * @return {Void}
       */
      set: function set() {
        var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';
        Components.Html.wrapper.style.transition = this.compose(property);
      },

      /**
       * Removes value of transition from HTML element.
       *
       * @return {Void}
       */
      remove: function remove() {
        Components.Html.wrapper.style.transition = '';
      },

      /**
       * Runs callback after animation.
       *
       * @param  {Function} callback
       * @return {Void}
       */
      after: function after(callback) {
        setTimeout(function () {
          callback();
        }, this.duration);
      },

      /**
       * Enable transition.
       *
       * @return {Void}
       */
      enable: function enable() {
        disabled = false;
        this.set();
      },

      /**
       * Disable transition.
       *
       * @return {Void}
       */
      disable: function disable() {
        disabled = true;
        this.set();
      }
    };
    define(Transition, 'duration', {
      /**
       * Gets duration of the transition based
       * on currently running animation type.
       *
       * @return {Number}
       */
      get: function get() {
        var settings = Glide.settings;

        if (Glide.isType('slider') && Components.Run.offset) {
          return settings.rewindDuration;
        }

        return settings.animationDuration;
      }
    });
    /**
     * Set transition `style` value:
     * - on each moving, because it may be cleared by offset move
     */

    Events.on('move', function () {
      Transition.set();
    });
    /**
     * Disable transition:
     * - before initial build to avoid transitioning from `0` to `startAt` index
     * - while resizing window and recalculating dimentions
     * - on jumping from offset transition at start and end edges in `carousel` type
     */

    Events.on(['build.before', 'resize', 'translate.jump'], function () {
      Transition.disable();
    });
    /**
     * Enable transition:
     * - on each running, because it may be disabled by offset move
     */

    Events.on('run', function () {
      Transition.enable();
    });
    /**
     * Remove transition:
     * - on destroying to bring markup to its inital state
     */

    Events.on('destroy', function () {
      Transition.remove();
    });
    return Transition;
  }
  /**
   * Test via a getter in the options object to see
   * if the passive property is accessed.
   *
   * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
   */


  var supportsPassive = false;

  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
      }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}

  var supportsPassive$1 = supportsPassive;
  var START_EVENTS = ['touchstart', 'mousedown'];
  var MOVE_EVENTS = ['touchmove', 'mousemove'];
  var END_EVENTS = ['touchend', 'touchcancel', 'mouseup', 'mouseleave'];
  var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];

  function Swipe(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    var swipeSin = 0;
    var swipeStartX = 0;
    var swipeStartY = 0;
    var disabled = false;
    var capture = supportsPassive$1 ? {
      passive: true
    } : false;
    var Swipe = {
      /**
       * Initializes swipe bindings.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.bindSwipeStart();
      },

      /**
       * Handler for `swipestart` event. Calculates entry points of the user's tap.
       *
       * @param {Object} event
       * @return {Void}
       */
      start: function start(event) {
        if (!disabled && !Glide.disabled) {
          this.disable();
          var swipe = this.touches(event);
          swipeSin = null;
          swipeStartX = toInt(swipe.pageX);
          swipeStartY = toInt(swipe.pageY);
          this.bindSwipeMove();
          this.bindSwipeEnd();
          Events.emit('swipe.start');
        }
      },

      /**
       * Handler for `swipemove` event. Calculates user's tap angle and distance.
       *
       * @param {Object} event
       */
      move: function move(event) {
        if (!Glide.disabled) {
          var _Glide$settings = Glide.settings,
              touchAngle = _Glide$settings.touchAngle,
              touchRatio = _Glide$settings.touchRatio,
              classes = _Glide$settings.classes;
          var swipe = this.touches(event);
          var subExSx = toInt(swipe.pageX) - swipeStartX;
          var subEySy = toInt(swipe.pageY) - swipeStartY;
          var powEX = Math.abs(subExSx << 2);
          var powEY = Math.abs(subEySy << 2);
          var swipeHypotenuse = Math.sqrt(powEX + powEY);
          var swipeCathetus = Math.sqrt(powEY);
          swipeSin = Math.asin(swipeCathetus / swipeHypotenuse);

          if (swipeSin * 180 / Math.PI < touchAngle) {
            event.stopPropagation();
            Components.Move.make(subExSx * toFloat(touchRatio));
            Components.Html.root.classList.add(classes.dragging);
            Events.emit('swipe.move');
          } else {
            return false;
          }
        }
      },

      /**
       * Handler for `swipeend` event. Finitializes user's tap and decides about glide move.
       *
       * @param {Object} event
       * @return {Void}
       */
      end: function end(event) {
        if (!Glide.disabled) {
          var settings = Glide.settings;
          var swipe = this.touches(event);
          var threshold = this.threshold(event);
          var swipeDistance = swipe.pageX - swipeStartX;
          var swipeDeg = swipeSin * 180 / Math.PI;
          var steps = Math.round(swipeDistance / Components.Sizes.slideWidth);
          this.enable();

          if (swipeDistance > threshold && swipeDeg < settings.touchAngle) {
            // While swipe is positive and greater than threshold move backward.
            if (settings.perTouch) {
              steps = Math.min(steps, toInt(settings.perTouch));
            }

            if (Components.Direction.is('rtl')) {
              steps = -steps;
            }

            Components.Run.make(Components.Direction.resolve('<' + steps));
          } else if (swipeDistance < -threshold && swipeDeg < settings.touchAngle) {
            // While swipe is negative and lower than negative threshold move forward.
            if (settings.perTouch) {
              steps = Math.max(steps, -toInt(settings.perTouch));
            }

            if (Components.Direction.is('rtl')) {
              steps = -steps;
            }

            Components.Run.make(Components.Direction.resolve('>' + steps));
          } else {
            // While swipe don't reach distance apply previous transform.
            Components.Move.make();
          }

          Components.Html.root.classList.remove(settings.classes.dragging);
          this.unbindSwipeMove();
          this.unbindSwipeEnd();
          Events.emit('swipe.end');
        }
      },

      /**
       * Binds swipe's starting event.
       *
       * @return {Void}
       */
      bindSwipeStart: function bindSwipeStart() {
        var _this = this;

        var settings = Glide.settings;

        if (settings.swipeThreshold) {
          Binder.on(START_EVENTS[0], Components.Html.wrapper, function (event) {
            _this.start(event);
          }, capture);
        }

        if (settings.dragThreshold) {
          Binder.on(START_EVENTS[1], Components.Html.wrapper, function (event) {
            _this.start(event);
          }, capture);
        }
      },

      /**
       * Unbinds swipe's starting event.
       *
       * @return {Void}
       */
      unbindSwipeStart: function unbindSwipeStart() {
        Binder.off(START_EVENTS[0], Components.Html.wrapper, capture);
        Binder.off(START_EVENTS[1], Components.Html.wrapper, capture);
      },

      /**
       * Binds swipe's moving event.
       *
       * @return {Void}
       */
      bindSwipeMove: function bindSwipeMove() {
        var _this2 = this;

        Binder.on(MOVE_EVENTS, Components.Html.wrapper, throttle(function (event) {
          _this2.move(event);
        }, Glide.settings.throttle), capture);
      },

      /**
       * Unbinds swipe's moving event.
       *
       * @return {Void}
       */
      unbindSwipeMove: function unbindSwipeMove() {
        Binder.off(MOVE_EVENTS, Components.Html.wrapper, capture);
      },

      /**
       * Binds swipe's ending event.
       *
       * @return {Void}
       */
      bindSwipeEnd: function bindSwipeEnd() {
        var _this3 = this;

        Binder.on(END_EVENTS, Components.Html.wrapper, function (event) {
          _this3.end(event);
        });
      },

      /**
       * Unbinds swipe's ending event.
       *
       * @return {Void}
       */
      unbindSwipeEnd: function unbindSwipeEnd() {
        Binder.off(END_EVENTS, Components.Html.wrapper);
      },

      /**
       * Normalizes event touches points accorting to different types.
       *
       * @param {Object} event
       */
      touches: function touches(event) {
        if (MOUSE_EVENTS.indexOf(event.type) > -1) {
          return event;
        }

        return event.touches[0] || event.changedTouches[0];
      },

      /**
       * Gets value of minimum swipe distance settings based on event type.
       *
       * @return {Number}
       */
      threshold: function threshold(event) {
        var settings = Glide.settings;

        if (MOUSE_EVENTS.indexOf(event.type) > -1) {
          return settings.dragThreshold;
        }

        return settings.swipeThreshold;
      },

      /**
       * Enables swipe event.
       *
       * @return {self}
       */
      enable: function enable() {
        disabled = false;
        Components.Transition.enable();
        return this;
      },

      /**
       * Disables swipe event.
       *
       * @return {self}
       */
      disable: function disable() {
        disabled = true;
        Components.Transition.disable();
        return this;
      }
    };
    /**
     * Add component class:
     * - after initial building
     */

    Events.on('build.after', function () {
      Components.Html.root.classList.add(Glide.settings.classes.swipeable);
    });
    /**
     * Remove swiping bindings:
     * - on destroying, to remove added EventListeners
     */

    Events.on('destroy', function () {
      Swipe.unbindSwipeStart();
      Swipe.unbindSwipeMove();
      Swipe.unbindSwipeEnd();
      Binder.destroy();
    });
    return Swipe;
  }

  function Images(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    var Images = {
      /**
       * Binds listener to glide wrapper.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.bind();
      },

      /**
       * Binds `dragstart` event on wrapper to prevent dragging images.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('dragstart', Components.Html.wrapper, this.dragstart);
      },

      /**
       * Unbinds `dragstart` event on wrapper.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('dragstart', Components.Html.wrapper);
      },

      /**
       * Event handler. Prevents dragging.
       *
       * @return {Void}
       */
      dragstart: function dragstart(event) {
        event.preventDefault();
      }
    };
    /**
     * Remove bindings from images:
     * - on destroying, to remove added EventListeners
     */

    Events.on('destroy', function () {
      Images.unbind();
      Binder.destroy();
    });
    return Images;
  }

  function Anchors(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    /**
     * Holds detaching status of anchors.
     * Prevents detaching of already detached anchors.
     *
     * @private
     * @type {Boolean}
     */

    var detached = false;
    /**
     * Holds preventing status of anchors.
     * If `true` redirection after click will be disabled.
     *
     * @private
     * @type {Boolean}
     */

    var prevented = false;
    var Anchors = {
      /**
       * Setups a initial state of anchors component.
       *
       * @returns {Void}
       */
      mount: function mount() {
        /**
         * Holds collection of anchors elements.
         *
         * @private
         * @type {HTMLCollection}
         */
        this._a = Components.Html.wrapper.querySelectorAll('a');
        this.bind();
      },

      /**
       * Binds events to anchors inside a track.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('click', Components.Html.wrapper, this.click);
      },

      /**
       * Unbinds events attached to anchors inside a track.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('click', Components.Html.wrapper);
      },

      /**
       * Handler for click event. Prevents clicks when glide is in `prevent` status.
       *
       * @param  {Object} event
       * @return {Void}
       */
      click: function click(event) {
        if (prevented) {
          event.stopPropagation();
          event.preventDefault();
        }
      },

      /**
       * Detaches anchors click event inside glide.
       *
       * @return {self}
       */
      detach: function detach() {
        prevented = true;

        if (!detached) {
          for (var i = 0; i < this.items.length; i++) {
            this.items[i].draggable = false;
            this.items[i].setAttribute('data-href', this.items[i].getAttribute('href'));
            this.items[i].removeAttribute('href');
          }

          detached = true;
        }

        return this;
      },

      /**
       * Attaches anchors click events inside glide.
       *
       * @return {self}
       */
      attach: function attach() {
        prevented = false;

        if (detached) {
          for (var i = 0; i < this.items.length; i++) {
            this.items[i].draggable = true;
            this.items[i].setAttribute('href', this.items[i].getAttribute('data-href'));
          }

          detached = false;
        }

        return this;
      }
    };
    define(Anchors, 'items', {
      /**
       * Gets collection of the arrows HTML elements.
       *
       * @return {HTMLElement[]}
       */
      get: function get() {
        return Anchors._a;
      }
    });
    /**
     * Detach anchors inside slides:
     * - on swiping, so they won't redirect to its `href` attributes
     */

    Events.on('swipe.move', function () {
      Anchors.detach();
    });
    /**
     * Attach anchors inside slides:
     * - after swiping and transitions ends, so they can redirect after click again
     */

    Events.on('swipe.end', function () {
      Components.Transition.after(function () {
        Anchors.attach();
      });
    });
    /**
     * Unbind anchors inside slides:
     * - on destroying, to bring anchors to its initial state
     */

    Events.on('destroy', function () {
      Anchors.attach();
      Anchors.unbind();
      Binder.destroy();
    });
    return Anchors;
  }

  var NAV_SELECTOR = '[data-glide-el="controls[nav]"]';
  var CONTROLS_SELECTOR = '[data-glide-el^="controls"]';

  function Controls(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    var capture = supportsPassive$1 ? {
      passive: true
    } : false;
    var Controls = {
      /**
       * Inits arrows. Binds events listeners
       * to the arrows HTML elements.
       *
       * @return {Void}
       */
      mount: function mount() {
        /**
         * Collection of navigation HTML elements.
         *
         * @private
         * @type {HTMLCollection}
         */
        this._n = Components.Html.root.querySelectorAll(NAV_SELECTOR);
        /**
         * Collection of controls HTML elements.
         *
         * @private
         * @type {HTMLCollection}
         */

        this._c = Components.Html.root.querySelectorAll(CONTROLS_SELECTOR);
        this.addBindings();
      },

      /**
       * Sets active class to current slide.
       *
       * @return {Void}
       */
      setActive: function setActive() {
        for (var i = 0; i < this._n.length; i++) {
          this.addClass(this._n[i].children);
        }
      },

      /**
       * Removes active class to current slide.
       *
       * @return {Void}
       */
      removeActive: function removeActive() {
        for (var i = 0; i < this._n.length; i++) {
          this.removeClass(this._n[i].children);
        }
      },

      /**
       * Toggles active class on items inside navigation.
       *
       * @param  {HTMLElement} controls
       * @return {Void}
       */
      addClass: function addClass(controls) {
        var settings = Glide.settings;
        var item = controls[Glide.index];

        if (item) {
          item.classList.add(settings.classes.activeNav);
          siblings(item).forEach(function (sibling) {
            sibling.classList.remove(settings.classes.activeNav);
          });
        }
      },

      /**
       * Removes active class from active control.
       *
       * @param  {HTMLElement} controls
       * @return {Void}
       */
      removeClass: function removeClass(controls) {
        var item = controls[Glide.index];

        if (item) {
          item.classList.remove(Glide.settings.classes.activeNav);
        }
      },

      /**
       * Adds handles to the each group of controls.
       *
       * @return {Void}
       */
      addBindings: function addBindings() {
        for (var i = 0; i < this._c.length; i++) {
          this.bind(this._c[i].children);
        }
      },

      /**
       * Removes handles from the each group of controls.
       *
       * @return {Void}
       */
      removeBindings: function removeBindings() {
        for (var i = 0; i < this._c.length; i++) {
          this.unbind(this._c[i].children);
        }
      },

      /**
       * Binds events to arrows HTML elements.
       *
       * @param {HTMLCollection} elements
       * @return {Void}
       */
      bind: function bind(elements) {
        for (var i = 0; i < elements.length; i++) {
          Binder.on('click', elements[i], this.click);
          Binder.on('touchstart', elements[i], this.click, capture);
        }
      },

      /**
       * Unbinds events binded to the arrows HTML elements.
       *
       * @param {HTMLCollection} elements
       * @return {Void}
       */
      unbind: function unbind(elements) {
        for (var i = 0; i < elements.length; i++) {
          Binder.off(['click', 'touchstart'], elements[i]);
        }
      },

      /**
       * Handles `click` event on the arrows HTML elements.
       * Moves slider in driection precised in
       * `data-glide-dir` attribute.
       *
       * @param {Object} event
       * @return {Void}
       */
      click: function click(event) {
        event.preventDefault();
        Components.Run.make(Components.Direction.resolve(event.currentTarget.getAttribute('data-glide-dir')));
      }
    };
    define(Controls, 'items', {
      /**
       * Gets collection of the controls HTML elements.
       *
       * @return {HTMLElement[]}
       */
      get: function get() {
        return Controls._c;
      }
    });
    /**
     * Swap active class of current navigation item:
     * - after mounting to set it to initial index
     * - after each move to the new index
     */

    Events.on(['mount.after', 'move.after'], function () {
      Controls.setActive();
    });
    /**
     * Remove bindings and HTML Classes:
     * - on destroying, to bring markup to its initial state
     */

    Events.on('destroy', function () {
      Controls.removeBindings();
      Controls.removeActive();
      Binder.destroy();
    });
    return Controls;
  }

  function Keyboard(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    var Keyboard = {
      /**
       * Binds keyboard events on component mount.
       *
       * @return {Void}
       */
      mount: function mount() {
        if (Glide.settings.keyboard) {
          this.bind();
        }
      },

      /**
       * Adds keyboard press events.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('keyup', document, this.press);
      },

      /**
       * Removes keyboard press events.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('keyup', document);
      },

      /**
       * Handles keyboard's arrows press and moving glide foward and backward.
       *
       * @param  {Object} event
       * @return {Void}
       */
      press: function press(event) {
        if (event.keyCode === 39) {
          Components.Run.make(Components.Direction.resolve('>'));
        }

        if (event.keyCode === 37) {
          Components.Run.make(Components.Direction.resolve('<'));
        }
      }
    };
    /**
     * Remove bindings from keyboard:
     * - on destroying to remove added events
     * - on updating to remove events before remounting
     */

    Events.on(['destroy', 'update'], function () {
      Keyboard.unbind();
    });
    /**
     * Remount component
     * - on updating to reflect potential changes in settings
     */

    Events.on('update', function () {
      Keyboard.mount();
    });
    /**
     * Destroy binder:
     * - on destroying to remove listeners
     */

    Events.on('destroy', function () {
      Binder.destroy();
    });
    return Keyboard;
  }

  function Autoplay(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    var Autoplay = {
      /**
       * Initializes autoplaying and events.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.start();

        if (Glide.settings.hoverpause) {
          this.bind();
        }
      },

      /**
       * Starts autoplaying in configured interval.
       *
       * @param {Boolean|Number} force Run autoplaying with passed interval regardless of `autoplay` settings
       * @return {Void}
       */
      start: function start() {
        var _this = this;

        if (Glide.settings.autoplay) {
          if (isUndefined(this._i)) {
            this._i = setInterval(function () {
              _this.stop();

              Components.Run.make('>');

              _this.start();
            }, this.time);
          }
        }
      },

      /**
       * Stops autorunning of the glide.
       *
       * @return {Void}
       */
      stop: function stop() {
        this._i = clearInterval(this._i);
      },

      /**
       * Stops autoplaying while mouse is over glide's area.
       *
       * @return {Void}
       */
      bind: function bind() {
        var _this2 = this;

        Binder.on('mouseover', Components.Html.root, function () {
          _this2.stop();
        });
        Binder.on('mouseout', Components.Html.root, function () {
          _this2.start();
        });
      },

      /**
       * Unbind mouseover events.
       *
       * @returns {Void}
       */
      unbind: function unbind() {
        Binder.off(['mouseover', 'mouseout'], Components.Html.root);
      }
    };
    define(Autoplay, 'time', {
      /**
       * Gets time period value for the autoplay interval. Prioritizes
       * times in `data-glide-autoplay` attrubutes over options.
       *
       * @return {Number}
       */
      get: function get() {
        var autoplay = Components.Html.slides[Glide.index].getAttribute('data-glide-autoplay');

        if (autoplay) {
          return toInt(autoplay);
        }

        return toInt(Glide.settings.autoplay);
      }
    });
    /**
     * Stop autoplaying and unbind events:
     * - on destroying, to clear defined interval
     * - on updating via API to reset interval that may changed
     */

    Events.on(['destroy', 'update'], function () {
      Autoplay.unbind();
    });
    /**
     * Stop autoplaying:
     * - before each run, to restart autoplaying
     * - on pausing via API
     * - on destroying, to clear defined interval
     * - while starting a swipe
     * - on updating via API to reset interval that may changed
     */

    Events.on(['run.before', 'pause', 'destroy', 'swipe.start', 'update'], function () {
      Autoplay.stop();
    });
    /**
     * Start autoplaying:
     * - after each run, to restart autoplaying
     * - on playing via API
     * - while ending a swipe
     */

    Events.on(['run.after', 'play', 'swipe.end'], function () {
      Autoplay.start();
    });
    /**
     * Remount autoplaying:
     * - on updating via API to reset interval that may changed
     */

    Events.on('update', function () {
      Autoplay.mount();
    });
    /**
     * Destroy a binder:
     * - on destroying glide instance to clearup listeners
     */

    Events.on('destroy', function () {
      Binder.destroy();
    });
    return Autoplay;
  }
  /**
   * Sorts keys of breakpoint object so they will be ordered from lower to bigger.
   *
   * @param {Object} points
   * @returns {Object}
   */


  function sortBreakpoints(points) {
    if (isObject(points)) {
      return sortKeys(points);
    } else {
      warn('Breakpoints option must be an object');
    }

    return {};
  }

  function Breakpoints(Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();
    /**
     * Holds reference to settings.
     *
     * @type {Object}
     */

    var settings = Glide.settings;
    /**
     * Holds reference to breakpoints object in settings. Sorts breakpoints
     * from smaller to larger. It is required in order to proper
     * matching currently active breakpoint settings.
     *
     * @type {Object}
     */

    var points = sortBreakpoints(settings.breakpoints);
    /**
     * Cache initial settings before overwritting.
     *
     * @type {Object}
     */

    var defaults = _extends({}, settings);

    var Breakpoints = {
      /**
       * Matches settings for currectly matching media breakpoint.
       *
       * @param {Object} points
       * @returns {Object}
       */
      match: function match(points) {
        if (typeof window.matchMedia !== 'undefined') {
          for (var point in points) {
            if (points.hasOwnProperty(point)) {
              if (window.matchMedia('(max-width: ' + point + 'px)').matches) {
                return points[point];
              }
            }
          }
        }

        return defaults;
      }
    };
    /**
     * Overwrite instance settings with currently matching breakpoint settings.
     * This happens right after component initialization.
     */

    _extends(settings, Breakpoints.match(points));
    /**
     * Update glide with settings of matched brekpoint:
     * - window resize to update slider
     */


    Binder.on('resize', window, throttle(function () {
      Glide.settings = mergeOptions(settings, Breakpoints.match(points));
    }, Glide.settings.throttle));
    /**
     * Resort and update default settings:
     * - on reinit via API, so breakpoint matching will be performed with options
     */

    Events.on('update', function () {
      points = sortBreakpoints(points);
      defaults = _extends({}, settings);
    });
    /**
     * Unbind resize listener:
     * - on destroying, to bring markup to its initial state
     */

    Events.on('destroy', function () {
      Binder.off('resize', window);
    });
    return Breakpoints;
  }

  var COMPONENTS = {
    // Required
    Html: Html,
    Translate: Translate,
    Transition: Transition,
    Direction: Direction,
    Peek: Peek,
    Sizes: Sizes,
    Gaps: Gaps,
    Move: Move,
    Clones: Clones,
    Resize: Resize,
    Build: Build,
    Run: Run,
    // Optional
    Swipe: Swipe,
    Images: Images,
    Anchors: Anchors,
    Controls: Controls,
    Keyboard: Keyboard,
    Autoplay: Autoplay,
    Breakpoints: Breakpoints
  };

  var Glide$1 = function (_Core) {
    inherits(Glide$$1, _Core);

    function Glide$$1() {
      classCallCheck(this, Glide$$1);
      return possibleConstructorReturn(this, (Glide$$1.__proto__ || Object.getPrototypeOf(Glide$$1)).apply(this, arguments));
    }

    createClass(Glide$$1, [{
      key: 'mount',
      value: function mount() {
        var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return get(Glide$$1.prototype.__proto__ || Object.getPrototypeOf(Glide$$1.prototype), 'mount', this).call(this, _extends({}, COMPONENTS, extensions));
      }
    }]);
    return Glide$$1;
  }(Glide);
  /**
   * Finds siblings nodes of the passed node.
   *
   * @param  {Element} node
   * @return {Array}
   */


  function siblings$1(node) {
    if (node && node.parentNode) {
      var n = node.parentNode.firstChild;
      var matched = [];

      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== node) {
          matched.push(n);
        }
      }

      return matched;
    }

    return [];
  }
  /**
    * Ads active classes before slide change so we can get smoother transitions between first and last slide
    */


  var MActiveClasses = function MActiveClasses(Glide, Components, Events) {
    var Component = {
      mount: function mount() {
        this.changeActiveSlide();
      },
      changeActiveSlide: function changeActiveSlide() {
        var slide = Components.Html.slides[Glide.index];
        slide.classList.remove('slide--next', 'slide--prev');
        slide.classList.add('slide--active');
        siblings$1(slide).forEach(function (sibling) {
          sibling.classList.remove('slide--active', 'slide--next', 'slide--prev');
        });

        if (slide.nextElementSibling) {
          slide.nextElementSibling.classList.add('slide--next');
        }

        if (slide.previousElementSibling) {
          slide.previousElementSibling.classList.add('slide--prev');
        }
      }
    };
    Events.on('run', function () {
      Component.changeActiveSlide();
    });
    return Component;
  };

  (function () {
    if (document.querySelector('.js-essays-carousel') == null) return;
    var essaysOptions = {
      type: 'carousel',
      startAt: 0,
      perView: 1,
      gap: 40,
      peek: 220,
      breakpoints: {
        1024: {
          peek: 0
        },
        1280: {
          peek: 80
        },
        1440: {
          peek: 160
        }
      },
      animationDuration: 520,
      animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
    };
    var essaysGlide = new Glide$1('.js-essays-carousel', essaysOptions);
    var essaysPrev = document.querySelector('.js-essays-carousel-prev'),
        essaysNext = document.querySelector('.js-essays-carousel-next');
    /* center the arrows with javascript so we can center on the image not the whole slide */

    essaysGlide.on("build.after", function () {
      var image = document.querySelector('.essays-carousel__image'),
          imageHeight = image.clientHeight,
          buttonHeight = essaysPrev.clientHeight,
          arrowTop = Math.round(imageHeight / 2 - buttonHeight / 2);
      essaysPrev.parentNode.style.top = "".concat(arrowTop, "px");
      essaysNext.parentNode.style.top = "".concat(arrowTop, "px");
    });
    listen(essaysPrev, 'click', function () {
      return essaysGlide.go('<');
    });
    listen(essaysNext, 'click', function () {
      return essaysGlide.go('>');
    });
    essaysGlide.mount({
      'MActiveClasses': MActiveClasses
    });
  })();

  (function () {
    if (document.querySelector('.js-species-carousel') == null) return;
    var speciesOptions = {
      type: 'carousel',
      startAt: 0,
      perView: 1,
      animationDuration: 520,
      animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
    };
    var thumbnailOptions = {
      type: 'carousel',
      startAt: 1,
      perView: 3,
      breakpoints: {
        600: {
          perView: 1,
          peek: {
            before: 0,
            after: 180
          }
        },
        900: {
          perView: 3,
          peek: 0
        },
        1024: {
          perView: 3,
          peek: 0
        }
      },
      swipeThreshold: false,
      dragThreshold: false,
      peek: 0,
      animationDuration: 520,
      animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
    };
    var speciesGlide = new Glide$1('.js-species-carousel', speciesOptions);
    var thumbnailGlide = new Glide$1('.js-species-thumbnail-carousel', thumbnailOptions);
    var speciesPrev = document.querySelector('.js-species-carousel-prev'),
        speciesNext = document.querySelector('.js-species-carousel-next');
    speciesGlide.on("build.after", function () {
      var image = document.querySelector('.species-carousel__image-holder'),
          imageHeight = image.clientHeight,
          buttonHeight = speciesPrev.clientHeight,
          arrowTop = Math.round(imageHeight / 2 - buttonHeight / 2);
      speciesPrev.parentNode.style.top = "".concat(arrowTop, "px");
      speciesNext.parentNode.style.top = "".concat(arrowTop, "px");
    });
    listen(speciesPrev, 'click', function () {
      return speciesGlide.go('<');
    });
    listen(speciesNext, 'click', function () {
      return speciesGlide.go('>');
    });
    speciesGlide.on('run', function (move) {
      thumbnailGlide.go("=".concat(speciesGlide.index + 1));
      var thumbnails = document.querySelectorAll('.js-thumbnail-slide');

      for (var i = 0, j = thumbnails.length; i < j; i++) {
        removeClass(thumbnails[i], 'large-active');
      }

      var activeThumbs = document.querySelectorAll(".js-thumbnail-slide[data-slide-index=\"" + speciesGlide.index + "\"]");

      for (var _i5 = 0, _j2 = activeThumbs.length; _i5 < _j2; _i5++) {
        addClass(activeThumbs[_i5], 'large-active');
      }
    });
    var thumbnails = document.querySelectorAll('.js-thumbnail-slide');

    for (var i = 0, j = thumbnails.length; i < j; i++) {
      thumbnails[i].setAttribute('data-slide-index', i);
      if (i == 0) addClass(thumbnails[i], 'large-active');
    }

    listen(document, 'click', function (e) {
      if (e.target.matches('.js-thumbnail-slide') || e.target.closest('.js-thumbnail-slide')) {
        var thumbnail = e.target.matches('.js-thumbnail-slide') ? e.target : e.target.closest('.js-thumbnail-slide');
        speciesGlide.go("=".concat(thumbnail.dataset.slideIndex));
      }
    });
    speciesGlide.mount();
    thumbnailGlide.mount();
  })();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, basedir, module) {
    return module = {
      path: basedir,
      exports: {},
      require: function require(path, base) {
        return commonjsRequire(path, base === undefined || base === null ? module.path : base);
      }
    }, fn(module, module.exports), module.exports;
  }

  function commonjsRequire() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var lgUtils = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      {
        factory(exports);
      }
    })(commonjsGlobal, function (exports) {
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var utils = {
        getAttribute: function getAttribute(el, label) {
          return el[label];
        },
        setAttribute: function setAttribute(el, label, value) {
          el[label] = value;
        },
        wrap: function wrap(el, className) {
          if (!el) {
            return;
          }

          var wrapper = document.createElement('div');
          wrapper.className = className;
          el.parentNode.insertBefore(wrapper, el);
          el.parentNode.removeChild(el);
          wrapper.appendChild(el);
        },
        addClass: function addClass(el, className) {
          if (!el) {
            return;
          }

          if (el.classList) {
            el.classList.add(className);
          } else {
            el.className += ' ' + className;
          }
        },
        removeClass: function removeClass(el, className) {
          if (!el) {
            return;
          }

          if (el.classList) {
            el.classList.remove(className);
          } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
          }
        },
        hasClass: function hasClass(el, className) {
          if (el.classList) {
            return el.classList.contains(className);
          } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
          }
        },
        // ex Transform
        // ex TransitionTimingFunction
        setVendor: function setVendor(el, property, value) {
          if (!el) {
            return;
          }

          el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
          el.style['webkit' + property] = value;
          el.style['moz' + property] = value;
          el.style['ms' + property] = value;
          el.style['o' + property] = value;
        },
        trigger: function trigger(el, event) {
          var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

          if (!el) {
            return;
          }

          var customEvent = new CustomEvent(event, {
            detail: detail
          });
          el.dispatchEvent(customEvent);
        },
        Listener: {
          uid: 0
        },
        on: function on(el, events, fn) {
          var _this = this;

          if (!el) {
            return;
          }

          events.split(' ').forEach(function (event) {
            var _id = _this.getAttribute(el, 'lg-event-uid') || '';

            utils.Listener.uid++;
            _id += '&' + utils.Listener.uid;

            _this.setAttribute(el, 'lg-event-uid', _id);

            utils.Listener[event + utils.Listener.uid] = fn;
            el.addEventListener(event.split('.')[0], fn, false);
          });
        },
        off: function off(el, event) {
          if (!el) {
            return;
          }

          var _id = this.getAttribute(el, 'lg-event-uid');

          if (_id) {
            _id = _id.split('&');

            for (var i = 0; i < _id.length; i++) {
              if (_id[i]) {
                var _event = event + _id[i];

                if (_event.substring(0, 1) === '.') {
                  for (var key in utils.Listener) {
                    if (utils.Listener.hasOwnProperty(key)) {
                      if (key.split('.').indexOf(_event.split('.')[1]) > -1) {
                        el.removeEventListener(key.split('.')[0], utils.Listener[key]);
                        this.setAttribute(el, 'lg-event-uid', this.getAttribute(el, 'lg-event-uid').replace('&' + _id[i], ''));
                        delete utils.Listener[key];
                      }
                    }
                  }
                } else {
                  el.removeEventListener(_event.split('.')[0], utils.Listener[_event]);
                  this.setAttribute(el, 'lg-event-uid', this.getAttribute(el, 'lg-event-uid').replace('&' + _id[i], ''));
                  delete utils.Listener[_event];
                }
              }
            }
          }
        },
        param: function param(obj) {
          return Object.keys(obj).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
          }).join('&');
        }
      };
      exports.default = utils;
    });
  });
  var lightgallery = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      {
        factory(lgUtils);
      }
    })(commonjsGlobal, function (_lgUtils) {
      var _lgUtils2 = _interopRequireDefault(_lgUtils);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };
      /** Polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher */


      (function () {
        if (typeof window.CustomEvent === 'function') {
          return false;
        }

        function CustomEvent(event, params) {
          params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
      })();

      window.utils = _lgUtils2.default;
      window.lgData = {
        uid: 0
      };
      window.lgModules = {};
      var defaults = {
        mode: 'lg-slide',
        // Ex : 'ease'
        cssEasing: 'ease',
        //'for jquery animation'
        easing: 'linear',
        speed: 600,
        height: '100%',
        width: '100%',
        addClass: '',
        startClass: 'lg-start-zoom',
        backdropDuration: 150,
        hideBarsDelay: 6000,
        useLeft: false,
        // aria-labelledby attribute fot gallery
        ariaLabelledby: '',
        //aria-describedby attribute for gallery
        ariaDescribedby: '',
        closable: true,
        loop: true,
        escKey: true,
        keyPress: true,
        controls: true,
        slideEndAnimatoin: true,
        hideControlOnEnd: false,
        mousewheel: false,
        getCaptionFromTitleOrAlt: true,
        // .lg-item || '.lg-sub-html'
        appendSubHtmlTo: '.lg-sub-html',
        subHtmlSelectorRelative: false,

        /**
         * @desc number of preload slides
         * will exicute only after the current slide is fully loaded.
         *
         * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
         * slide will be loaded in the background after the 4th slide is fully loaded..
         * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
         *
         */
        preload: 1,
        showAfterLoad: true,
        selector: '',
        selectWithin: '',
        nextHtml: '',
        prevHtml: '',
        // 0, 1
        index: false,
        iframeMaxWidth: '100%',
        download: true,
        counter: true,
        appendCounterTo: '.lg-toolbar',
        swipeThreshold: 50,
        enableSwipe: true,
        enableDrag: true,
        dynamic: false,
        dynamicEl: [],
        galleryId: 1
      };

      function Plugin(element, options) {
        // Current lightGallery element
        this.el = element; // lightGallery settings

        this.s = _extends({}, defaults, options); // When using dynamic mode, ensure dynamicEl is an array

        if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
          throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
        } // lightGallery modules


        this.modules = {}; // false when lightgallery complete first slide;

        this.lGalleryOn = false;
        this.lgBusy = false; // Timeout function for hiding controls;

        this.hideBartimeout = false; // To determine browser supports for touch events;

        this.isTouch = 'ontouchstart' in document.documentElement; // Disable hideControlOnEnd if sildeEndAnimation is true

        if (this.s.slideEndAnimatoin) {
          this.s.hideControlOnEnd = false;
        }

        this.items = []; // Gallery items

        if (this.s.dynamic) {
          this.items = this.s.dynamicEl;
        } else {
          if (this.s.selector === 'this') {
            this.items.push(this.el);
          } else if (this.s.selector !== '') {
            if (this.s.selectWithin) {
              this.items = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector);
            } else {
              this.items = this.el.querySelectorAll(this.s.selector);
            }
          } else {
            this.items = this.el.children;
          }
        } // .lg-item


        this.___slide = ''; // .lg-outer

        this.outer = '';
        this.init();
        return this;
      }

      Plugin.prototype.init = function () {
        var _this = this; // s.preload should not be more than $item.length


        if (_this.s.preload > _this.items.length) {
          _this.s.preload = _this.items.length;
        } // if dynamic option is enabled execute immediately


        var _hash = window.location.hash;

        if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
          _this.index = parseInt(_hash.split('&slide=')[1], 10);

          _lgUtils2.default.addClass(document.body, 'lg-from-hash');

          if (!_lgUtils2.default.hasClass(document.body, 'lg-on')) {
            _lgUtils2.default.addClass(document.body, 'lg-on');

            setTimeout(function () {
              _this.build(_this.index);
            });
          }
        }

        if (_this.s.dynamic) {
          _lgUtils2.default.trigger(this.el, 'onBeforeOpen');

          _this.index = _this.s.index || 0; // prevent accidental double execution

          if (!_lgUtils2.default.hasClass(document.body, 'lg-on')) {
            _lgUtils2.default.addClass(document.body, 'lg-on');

            setTimeout(function () {
              _this.build(_this.index);
            });
          }
        } else {
          for (var i = 0; i < _this.items.length; i++) {
            /*jshint loopfunc: true */
            (function (index) {
              // Using different namespace for click because click event should not unbind if selector is same object('this')
              _lgUtils2.default.on(_this.items[index], 'click.lgcustom', function (e) {
                e.preventDefault();

                _lgUtils2.default.trigger(_this.el, 'onBeforeOpen');

                _this.index = _this.s.index || index;

                if (!_lgUtils2.default.hasClass(document.body, 'lg-on')) {
                  _this.build(_this.index);

                  _lgUtils2.default.addClass(document.body, 'lg-on');
                }
              });
            })(i);
          }
        }
      };

      Plugin.prototype.build = function (index) {
        var _this = this;

        _this.structure();

        for (var key in window.lgModules) {
          _this.modules[key] = new window.lgModules[key](_this.el);
        } // initiate slide function


        _this.slide(index, false, false);

        if (_this.s.keyPress) {
          _this.keyPress();
        }

        if (_this.items.length > 1) {
          _this.arrow();

          setTimeout(function () {
            _this.enableDrag();

            _this.enableSwipe();
          }, 50);

          if (_this.s.mousewheel) {
            _this.mousewheel();
          }
        }

        _this.counter();

        _this.closeGallery();

        _lgUtils2.default.trigger(_this.el, 'onAfterOpen'); // Hide controllers if mouse doesn't move for some period


        _lgUtils2.default.on(_this.outer, 'mousemove.lg click.lg touchstart.lg', function () {
          _lgUtils2.default.removeClass(_this.outer, 'lg-hide-items');

          clearTimeout(_this.hideBartimeout); // Timeout will be cleared on each slide movement also

          _this.hideBartimeout = setTimeout(function () {
            _lgUtils2.default.addClass(_this.outer, 'lg-hide-items');
          }, _this.s.hideBarsDelay);
        });
      };

      Plugin.prototype.structure = function () {
        var list = '';
        var controls = '';
        var i = 0;
        var subHtmlCont = '';
        var template;

        var _this = this;

        document.body.insertAdjacentHTML('beforeend', '<div class="lg-backdrop"></div>');

        _lgUtils2.default.setVendor(document.querySelector('.lg-backdrop'), 'TransitionDuration', this.s.backdropDuration + 'ms'); // Create gallery items


        for (i = 0; i < this.items.length; i++) {
          list += '<div class="lg-item"></div>';
        } // Create controlls


        if (this.s.controls && this.items.length > 1) {
          controls = '<div class="lg-actions">' + '<button aria-label="Previous slide" class="lg-prev lg-icon">' + this.s.prevHtml + '</button>' + '<button aria-label="Next slide" class="lg-next lg-icon">' + this.s.nextHtml + '</button>' + '</div>';
        }

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
          subHtmlCont = '<div role="status" aria-live="polite" class="lg-sub-html"></div>';
        }

        var ariaLabelledby = this.s.ariaLabelledby ? 'aria-labelledby="' + this.s.ariaLabelledby + '"' : '';
        var ariaDescribedby = this.s.ariaDescribedby ? 'aria-describedby="' + this.s.ariaDescribedby + '"' : '';
        template = '<div tabindex="-1" aria-modal="true" ' + ariaLabelledby + ' ' + ariaDescribedby + ' role="dialog" class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' + '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' + '<div class="lg-inner">' + list + '</div>' + '<div class="lg-toolbar group">' + '<button aria-label="Close gallery" class="lg-close lg-icon"></button>' + '</div>' + controls + subHtmlCont + '</div>' + '</div>';
        document.body.insertAdjacentHTML('beforeend', template);
        this.outer = document.querySelector('.lg-outer');
        this.outer.focus();
        this.___slide = this.outer.querySelectorAll('.lg-item');

        if (this.s.useLeft) {
          _lgUtils2.default.addClass(this.outer, 'lg-use-left'); // Set mode lg-slide if use left is true;


          this.s.mode = 'lg-slide';
        } else {
          _lgUtils2.default.addClass(this.outer, 'lg-use-css3');
        } // For fixed height gallery


        _this.setTop();

        _lgUtils2.default.on(window, 'resize.lg orientationchange.lg', function () {
          setTimeout(function () {
            _this.setTop();
          }, 100);
        }); // add class lg-current to remove initial transition


        _lgUtils2.default.addClass(this.___slide[this.index], 'lg-current'); // add Class for css support and transition mode


        if (this.doCss()) {
          _lgUtils2.default.addClass(this.outer, 'lg-css3');
        } else {
          _lgUtils2.default.addClass(this.outer, 'lg-css'); // Set speed 0 because no animation will happen if browser doesn't support css3


          this.s.speed = 0;
        }

        _lgUtils2.default.addClass(this.outer, this.s.mode);

        if (this.s.enableDrag && this.items.length > 1) {
          _lgUtils2.default.addClass(this.outer, 'lg-grab');
        }

        if (this.s.showAfterLoad) {
          _lgUtils2.default.addClass(this.outer, 'lg-show-after-load');
        }

        if (this.doCss()) {
          var inner = this.outer.querySelector('.lg-inner');

          _lgUtils2.default.setVendor(inner, 'TransitionTimingFunction', this.s.cssEasing);

          _lgUtils2.default.setVendor(inner, 'TransitionDuration', this.s.speed + 'ms');
        }

        setTimeout(function () {
          _lgUtils2.default.addClass(document.querySelector('.lg-backdrop'), 'in');
        });
        setTimeout(function () {
          _lgUtils2.default.addClass(_this.outer, 'lg-visible');
        }, this.s.backdropDuration);

        if (this.s.download) {
          this.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', '<a id="lg-download" aria-label="Download" target="_blank" download class="lg-download lg-icon"></a>');
        } // Store the current scroll top value to scroll back after closing the gallery..


        this.prevScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      }; // For fixed height gallery


      Plugin.prototype.setTop = function () {
        if (this.s.height !== '100%') {
          var wH = window.innerHeight;
          var top = (wH - parseInt(this.s.height, 10)) / 2;
          var lGallery = this.outer.querySelector('.lg');

          if (wH >= parseInt(this.s.height, 10)) {
            lGallery.style.top = top + 'px';
          } else {
            lGallery.style.top = '0px';
          }
        }
      }; // Find css3 support


      Plugin.prototype.doCss = function () {
        // check for css animation support
        var support = function support() {
          var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
          var root = document.documentElement;
          var i = 0;

          for (i = 0; i < transition.length; i++) {
            if (transition[i] in root.style) {
              return true;
            }
          }
        };

        if (support()) {
          return true;
        }

        return false;
      };
      /**
       *  @desc Check the given src is video
       *  @param {String} src
       *  @return {Object} video type
       *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
       */


      Plugin.prototype.isVideo = function (src, index) {
        var html;

        if (this.s.dynamic) {
          html = this.s.dynamicEl[index].html;
        } else {
          html = this.items[index].getAttribute('data-html');
        }

        if (!src && html) {
          return {
            html5: true
          };
        }

        var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
        var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
        var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
        var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

        if (youtube) {
          return {
            youtube: youtube
          };
        } else if (vimeo) {
          return {
            vimeo: vimeo
          };
        } else if (dailymotion) {
          return {
            dailymotion: dailymotion
          };
        } else if (vk) {
          return {
            vk: vk
          };
        }
      };
      /**
       *  @desc Create image counter
       *  Ex: 1/10
       */


      Plugin.prototype.counter = function () {
        if (this.s.counter) {
          this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML('beforeend', '<div id="lg-counter" role="status" aria-live="polite"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.items.length + '</span></div>');
        }
      };
      /**
       *  @desc add sub-html into the slide
       *  @param {Number} index - index of the slide
       */


      Plugin.prototype.addHtml = function (index) {
        var subHtml = null;
        var currentEle;

        if (this.s.dynamic) {
          subHtml = this.s.dynamicEl[index].subHtml;
        } else {
          currentEle = this.items[index];
          subHtml = currentEle.getAttribute('data-sub-html');

          if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
            subHtml = currentEle.getAttribute('title');

            if (subHtml && currentEle.querySelector('img')) {
              subHtml = currentEle.querySelector('img').getAttribute('alt');
            }
          }
        }

        if (typeof subHtml !== 'undefined' && subHtml !== null) {
          // get first letter of subhtml
          // if first letter starts with . or # get the html form the jQuery object
          var fL = subHtml.substring(0, 1);

          if (fL === '.' || fL === '#') {
            if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
              subHtml = currentEle.querySelector(subHtml).innerHTML;
            } else {
              subHtml = document.querySelector(subHtml).innerHTML;
            }
          }
        } else {
          subHtml = '';
        }

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
          this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML = subHtml;
        } else {
          this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
        } // Add lg-empty-html class if title doesn't exist


        if (typeof subHtml !== 'undefined' && subHtml !== null) {
          if (subHtml === '') {
            _lgUtils2.default.addClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
          } else {
            _lgUtils2.default.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
          }
        }

        _lgUtils2.default.trigger(this.el, 'onAfterAppendSubHtml', {
          index: index
        });
      };
      /**
       *  @desc Preload slides
       *  @param {Number} index - index of the slide
       */


      Plugin.prototype.preload = function (index) {
        var i = 1;
        var j = 1;

        for (i = 1; i <= this.s.preload; i++) {
          if (i >= this.items.length - index) {
            break;
          }

          this.loadContent(index + i, false, 0);
        }

        for (j = 1; j <= this.s.preload; j++) {
          if (index - j < 0) {
            break;
          }

          this.loadContent(index - j, false, 0);
        }
      };
      /**
       *  @desc Load slide content into slide.
       *  @param {Number} index - index of the slide.
       *  @param {Boolean} rec - if true call loadcontent() function again.
       *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
       */


      Plugin.prototype.loadContent = function (index, rec, delay) {
        var _this = this;

        var _hasPoster = false;

        var _img;

        var _src;

        var _poster;

        var _srcset;

        var _sizes;

        var _html;

        var _alt;

        var getResponsiveSrc = function getResponsiveSrc(srcItms) {
          var rsWidth = [];
          var rsSrc = [];

          for (var i = 0; i < srcItms.length; i++) {
            var __src = srcItms[i].split(' '); // Manage empty space


            if (__src[0] === '') {
              __src.splice(0, 1);
            }

            rsSrc.push(__src[0]);
            rsWidth.push(__src[1]);
          }

          var wWidth = window.innerWidth;

          for (var j = 0; j < rsWidth.length; j++) {
            if (parseInt(rsWidth[j], 10) > wWidth) {
              _src = rsSrc[j];
              break;
            }
          }
        };

        if (_this.s.dynamic) {
          if (_this.s.dynamicEl[index].poster) {
            _hasPoster = true;
            _poster = _this.s.dynamicEl[index].poster;
          }

          _html = _this.s.dynamicEl[index].html;
          _src = _this.s.dynamicEl[index].src;
          _alt = _this.s.dynamicEl[index].alt;

          if (_this.s.dynamicEl[index].responsive) {
            var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');

            getResponsiveSrc(srcDyItms);
          }

          _srcset = _this.s.dynamicEl[index].srcset;
          _sizes = _this.s.dynamicEl[index].sizes;
        } else {
          if (_this.items[index].getAttribute('data-poster')) {
            _hasPoster = true;
            _poster = _this.items[index].getAttribute('data-poster');
          }

          _html = _this.items[index].getAttribute('data-html');
          _src = _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src');
          _alt = _this.items[index].getAttribute('title');

          if (_this.items[index].querySelector('img')) {
            _alt = _alt || _this.items[index].querySelector('img').getAttribute('alt');
          }

          if (_this.items[index].getAttribute('data-responsive')) {
            var srcItms = _this.items[index].getAttribute('data-responsive').split(',');

            getResponsiveSrc(srcItms);
          }

          _srcset = _this.items[index].getAttribute('data-srcset');
          _sizes = _this.items[index].getAttribute('data-sizes');
        } //if (_src || _srcset || _sizes || _poster) {


        var iframe = false;

        if (_this.s.dynamic) {
          if (_this.s.dynamicEl[index].iframe) {
            iframe = true;
          }
        } else {
          if (_this.items[index].getAttribute('data-iframe') === 'true') {
            iframe = true;
          }
        }

        var _isVideo = _this.isVideo(_src, index);

        if (!_lgUtils2.default.hasClass(_this.___slide[index], 'lg-loaded')) {
          if (iframe) {
            _this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
          } else if (_hasPoster) {
            var videoClass = '';

            if (_isVideo && _isVideo.youtube) {
              videoClass = 'lg-has-youtube';
            } else if (_isVideo && _isVideo.vimeo) {
              videoClass = 'lg-has-vimeo';
            } else {
              videoClass = 'lg-has-html5';
            }

            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');
          } else if (_isVideo) {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');

            _lgUtils2.default.trigger(_this.el, 'hasVideo', {
              index: index,
              src: _src,
              html: _html
            });
          } else {
            _alt = _alt ? 'alt="' + _alt + '"' : '';

            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" ' + _alt + ' src="' + _src + '" /></div>');
          }

          _lgUtils2.default.trigger(_this.el, 'onAferAppendSlide', {
            index: index
          });

          _img = _this.___slide[index].querySelector('.lg-object');

          if (_sizes) {
            _img.setAttribute('sizes', _sizes);
          }

          if (_srcset) {
            _img.setAttribute('srcset', _srcset);

            try {
              picturefill({
                elements: [_img[0]]
              });
            } catch (e) {
              console.error('Make sure you have included Picturefill version 2');
            }
          }

          if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
            _this.addHtml(index);
          }

          _lgUtils2.default.addClass(_this.___slide[index], 'lg-loaded');
        }

        _lgUtils2.default.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function () {
          // For first time add some delay for displaying the start animation.
          var _speed = 0; // Do not change the delay value because it is required for zoom plugin.
          // If gallery opened from direct url (hash) speed value should be 0

          if (delay && !_lgUtils2.default.hasClass(document.body, 'lg-from-hash')) {
            _speed = delay;
          }

          setTimeout(function () {
            _lgUtils2.default.addClass(_this.___slide[index], 'lg-complete');

            _lgUtils2.default.trigger(_this.el, 'onSlideItemLoad', {
              index: index,
              delay: delay || 0
            });
          }, _speed);
        }); // @todo check load state for html5 videos


        if (_isVideo && _isVideo.html5 && !_hasPoster) {
          _lgUtils2.default.addClass(_this.___slide[index], 'lg-complete');
        }

        if (rec === true) {
          if (!_lgUtils2.default.hasClass(_this.___slide[index], 'lg-complete')) {
            _lgUtils2.default.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function () {
              _this.preload(index);
            });
          } else {
            _this.preload(index);
          }
        } //}

      };
      /**
      *   @desc slide function for lightgallery
          ** Slide() gets call on start
          ** ** Set lg.on true once slide() function gets called.
          ** Call loadContent() on slide() function inside setTimeout
          ** ** On first slide we do not want any animation like slide of fade
          ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
          ** ** Else loadContent() should wait for the transition to complete.
          ** ** So set timeout s.speed + 50
      <=> ** loadContent() will load slide content in to the particular slide
          ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
          ** ** preload will execute only when the previous slide is fully loaded (images iframe)
          ** ** avoid simultaneous image load
      <=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
          ** loadContent()  <====> Preload();
      
      *   @param {Number} index - index of the slide
      *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
      *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
      */


      Plugin.prototype.slide = function (index, fromTouch, fromThumb) {
        var _prevIndex = 0;

        for (var i = 0; i < this.___slide.length; i++) {
          if (_lgUtils2.default.hasClass(this.___slide[i], 'lg-current')) {
            _prevIndex = i;
            break;
          }
        }

        var _this = this; // Prevent if multiple call
        // Required for hsh plugin


        if (_this.lGalleryOn && _prevIndex === index) {
          return;
        }

        var _length = this.___slide.length;

        var _time = _this.lGalleryOn ? this.s.speed : 0;

        var _next = false;
        var _prev = false;

        if (!_this.lgBusy) {
          if (this.s.download) {
            var _src;

            if (_this.s.dynamic) {
              _src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
            } else {
              _src = _this.items[index].getAttribute('data-download-url') !== 'false' && (_this.items[index].getAttribute('data-download-url') || _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src'));
            }

            if (_src) {
              document.getElementById('lg-download').setAttribute('href', _src);

              _lgUtils2.default.removeClass(_this.outer, 'lg-hide-download');
            } else {
              _lgUtils2.default.addClass(_this.outer, 'lg-hide-download');
            }
          }

          _lgUtils2.default.trigger(_this.el, 'onBeforeSlide', {
            prevIndex: _prevIndex,
            index: index,
            fromTouch: fromTouch,
            fromThumb: fromThumb
          });

          _this.lgBusy = true;
          clearTimeout(_this.hideBartimeout); // Add title if this.s.appendSubHtmlTo === lg-sub-html

          if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            // wait for slide animation to complete
            setTimeout(function () {
              _this.addHtml(index);
            }, _time);
          }

          this.arrowDisable(index);

          if (!fromTouch) {
            // remove all transitions
            _lgUtils2.default.addClass(_this.outer, 'lg-no-trans');

            for (var j = 0; j < this.___slide.length; j++) {
              _lgUtils2.default.removeClass(this.___slide[j], 'lg-prev-slide');

              _lgUtils2.default.removeClass(this.___slide[j], 'lg-next-slide');
            }

            if (index < _prevIndex) {
              _prev = true;

              if (index === 0 && _prevIndex === _length - 1 && !fromThumb) {
                _prev = false;
                _next = true;
              }
            } else if (index > _prevIndex) {
              _next = true;

              if (index === _length - 1 && _prevIndex === 0 && !fromThumb) {
                _prev = true;
                _next = false;
              }
            }

            if (_prev) {
              //prevslide
              _lgUtils2.default.addClass(this.___slide[index], 'lg-prev-slide');

              _lgUtils2.default.addClass(this.___slide[_prevIndex], 'lg-next-slide');
            } else if (_next) {
              // next slide
              _lgUtils2.default.addClass(this.___slide[index], 'lg-next-slide');

              _lgUtils2.default.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
            } // give 50 ms for browser to add/remove class


            setTimeout(function () {
              _lgUtils2.default.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current'); //_this.$slide.eq(_prevIndex).removeClass('lg-current');


              _lgUtils2.default.addClass(_this.___slide[index], 'lg-current'); // reset all transitions


              _lgUtils2.default.removeClass(_this.outer, 'lg-no-trans');
            }, 50);
          } else {
            var touchPrev = index - 1;
            var touchNext = index + 1;

            if (index === 0 && _prevIndex === _length - 1) {
              // next slide
              touchNext = 0;
              touchPrev = _length - 1;
            } else if (index === _length - 1 && _prevIndex === 0) {
              // prev slide
              touchNext = 0;
              touchPrev = _length - 1;
            }

            _lgUtils2.default.removeClass(_this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');

            _lgUtils2.default.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');

            _lgUtils2.default.removeClass(_this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');

            _lgUtils2.default.addClass(_this.___slide[touchPrev], 'lg-prev-slide');

            _lgUtils2.default.addClass(_this.___slide[touchNext], 'lg-next-slide');

            _lgUtils2.default.addClass(_this.___slide[index], 'lg-current');
          }

          if (_this.lGalleryOn) {
            setTimeout(function () {
              _this.loadContent(index, true, 0);
            }, this.s.speed + 50);
            setTimeout(function () {
              _this.lgBusy = false;

              _lgUtils2.default.trigger(_this.el, 'onAfterSlide', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb
              });
            }, this.s.speed);
          } else {
            _this.loadContent(index, true, _this.s.backdropDuration);

            _this.lgBusy = false;

            _lgUtils2.default.trigger(_this.el, 'onAfterSlide', {
              prevIndex: _prevIndex,
              index: index,
              fromTouch: fromTouch,
              fromThumb: fromThumb
            });
          }

          _this.lGalleryOn = true;

          if (this.s.counter) {
            if (document.getElementById('lg-counter-current')) {
              document.getElementById('lg-counter-current').innerHTML = index + 1;
            }
          }
        }
      };
      /**
       *  @desc Go to next slide
       *  @param {Boolean} fromTouch - true if slide function called via touch event
       */


      Plugin.prototype.goToNextSlide = function (fromTouch) {
        var _this = this;

        if (!_this.lgBusy) {
          if (_this.index + 1 < _this.___slide.length) {
            _this.index++;

            _lgUtils2.default.trigger(_this.el, 'onBeforeNextSlide', {
              index: _this.index
            });

            _this.slide(_this.index, fromTouch, false);
          } else {
            if (_this.s.loop) {
              _this.index = 0;

              _lgUtils2.default.trigger(_this.el, 'onBeforeNextSlide', {
                index: _this.index
              });

              _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
              _lgUtils2.default.addClass(_this.outer, 'lg-right-end');

              setTimeout(function () {
                _lgUtils2.default.removeClass(_this.outer, 'lg-right-end');
              }, 400);
            }
          }
        }
      };
      /**
       *  @desc Go to previous slide
       *  @param {Boolean} fromTouch - true if slide function called via touch event
       */


      Plugin.prototype.goToPrevSlide = function (fromTouch) {
        var _this = this;

        if (!_this.lgBusy) {
          if (_this.index > 0) {
            _this.index--;

            _lgUtils2.default.trigger(_this.el, 'onBeforePrevSlide', {
              index: _this.index,
              fromTouch: fromTouch
            });

            _this.slide(_this.index, fromTouch, false);
          } else {
            if (_this.s.loop) {
              _this.index = _this.items.length - 1;

              _lgUtils2.default.trigger(_this.el, 'onBeforePrevSlide', {
                index: _this.index,
                fromTouch: fromTouch
              });

              _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
              _lgUtils2.default.addClass(_this.outer, 'lg-left-end');

              setTimeout(function () {
                _lgUtils2.default.removeClass(_this.outer, 'lg-left-end');
              }, 400);
            }
          }
        }
      };

      Plugin.prototype.keyPress = function () {
        var _this = this;

        if (this.items.length > 1) {
          _lgUtils2.default.on(window, 'keyup.lg', function (e) {
            if (_this.items.length > 1) {
              if (e.keyCode === 37) {
                e.preventDefault();

                _this.goToPrevSlide();
              }

              if (e.keyCode === 39) {
                e.preventDefault();

                _this.goToNextSlide();
              }
            }
          });
        }

        _lgUtils2.default.on(window, 'keydown.lg', function (e) {
          if (_this.s.escKey === true && e.keyCode === 27) {
            e.preventDefault();

            if (!_lgUtils2.default.hasClass(_this.outer, 'lg-thumb-open')) {
              _this.destroy();
            } else {
              _lgUtils2.default.removeClass(_this.outer, 'lg-thumb-open');
            }
          }
        });
      };

      Plugin.prototype.arrow = function () {
        var _this = this;

        _lgUtils2.default.on(this.outer.querySelector('.lg-prev'), 'click.lg', function () {
          _this.goToPrevSlide();
        });

        _lgUtils2.default.on(this.outer.querySelector('.lg-next'), 'click.lg', function () {
          _this.goToNextSlide();
        });
      };

      Plugin.prototype.arrowDisable = function (index) {
        // Disable arrows if s.hideControlOnEnd is true
        if (!this.s.loop && this.s.hideControlOnEnd) {
          var next = this.outer.querySelector('.lg-next');
          var prev = this.outer.querySelector('.lg-prev');

          if (index + 1 < this.___slide.length) {
            next.removeAttribute('disabled');

            _lgUtils2.default.removeClass(next, 'disabled');
          } else {
            next.setAttribute('disabled', 'disabled');

            _lgUtils2.default.addClass(next, 'disabled');
          }

          if (index > 0) {
            prev.removeAttribute('disabled');

            _lgUtils2.default.removeClass(prev, 'disabled');
          } else {
            prev.setAttribute('disabled', 'disabled');

            _lgUtils2.default.addClass(prev, 'disabled');
          }
        }
      };

      Plugin.prototype.setTranslate = function (el, xValue, yValue) {
        // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
        if (this.s.useLeft) {
          el.style.left = xValue;
        } else {
          _lgUtils2.default.setVendor(el, 'Transform', 'translate3d(' + xValue + 'px, ' + yValue + 'px, 0px)');
        }
      };

      Plugin.prototype.touchMove = function (startCoords, endCoords) {
        var distance = endCoords - startCoords;

        if (Math.abs(distance) > 15) {
          // reset opacity and transition duration
          _lgUtils2.default.addClass(this.outer, 'lg-dragging'); // move current slide


          this.setTranslate(this.___slide[this.index], distance, 0); // move next and prev slide with current slide

          this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
          this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
        }
      };

      Plugin.prototype.touchEnd = function (distance) {
        var _this = this; // keep slide animation for any mode while dragg/swipe


        if (_this.s.mode !== 'lg-slide') {
          _lgUtils2.default.addClass(_this.outer, 'lg-slide');
        }

        for (var i = 0; i < this.___slide.length; i++) {
          if (!_lgUtils2.default.hasClass(this.___slide[i], 'lg-current') && !_lgUtils2.default.hasClass(this.___slide[i], 'lg-prev-slide') && !_lgUtils2.default.hasClass(this.___slide[i], 'lg-next-slide')) {
            this.___slide[i].style.opacity = '0';
          }
        } // set transition duration


        setTimeout(function () {
          _lgUtils2.default.removeClass(_this.outer, 'lg-dragging');

          if (distance < 0 && Math.abs(distance) > _this.s.swipeThreshold) {
            _this.goToNextSlide(true);
          } else if (distance > 0 && Math.abs(distance) > _this.s.swipeThreshold) {
            _this.goToPrevSlide(true);
          } else if (Math.abs(distance) < 5) {
            // Trigger click if distance is less than 5 pix
            _lgUtils2.default.trigger(_this.el, 'onSlideClick');
          }

          for (var i = 0; i < _this.___slide.length; i++) {
            _this.___slide[i].removeAttribute('style');
          }
        }); // remove slide class once drag/swipe is completed if mode is not slide

        setTimeout(function () {
          if (!_lgUtils2.default.hasClass(_this.outer, 'lg-dragging') && _this.s.mode !== 'lg-slide') {
            _lgUtils2.default.removeClass(_this.outer, 'lg-slide');
          }
        }, _this.s.speed + 100);
      };

      Plugin.prototype.enableSwipe = function () {
        var _this = this;

        var startCoords = 0;
        var endCoords = 0;
        var isMoved = false;

        if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {
          for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            _lgUtils2.default.on(_this.___slide[i], 'touchstart.lg', function (e) {
              if (!_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed') && !_this.lgBusy) {
                e.preventDefault();

                _this.manageSwipeClass();

                startCoords = e.targetTouches[0].pageX;
              }
            });
          }

          for (var j = 0; j < _this.___slide.length; j++) {
            /*jshint loopfunc: true */
            _lgUtils2.default.on(_this.___slide[j], 'touchmove.lg', function (e) {
              if (!_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed')) {
                e.preventDefault();
                endCoords = e.targetTouches[0].pageX;

                _this.touchMove(startCoords, endCoords);

                isMoved = true;
              }
            });
          }

          for (var k = 0; k < _this.___slide.length; k++) {
            /*jshint loopfunc: true */
            _lgUtils2.default.on(_this.___slide[k], 'touchend.lg', function () {
              if (!_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed')) {
                if (isMoved) {
                  isMoved = false;

                  _this.touchEnd(endCoords - startCoords);
                } else {
                  _lgUtils2.default.trigger(_this.el, 'onSlideClick');
                }
              }
            });
          }
        }
      };

      Plugin.prototype.enableDrag = function () {
        var _this = this;

        var startCoords = 0;
        var endCoords = 0;
        var isDraging = false;
        var isMoved = false;

        if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
          for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            _lgUtils2.default.on(_this.___slide[i], 'mousedown.lg', function (e) {
              // execute only on .lg-object
              if (!_lgUtils2.default.hasClass(_this.outer, 'lg-zoomed')) {
                if (_lgUtils2.default.hasClass(e.target, 'lg-object') || _lgUtils2.default.hasClass(e.target, 'lg-video-play')) {
                  e.preventDefault();

                  if (!_this.lgBusy) {
                    _this.manageSwipeClass();

                    startCoords = e.pageX;
                    isDraging = true; // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723

                    _this.outer.scrollLeft += 1;
                    _this.outer.scrollLeft -= 1; // *

                    _lgUtils2.default.removeClass(_this.outer, 'lg-grab');

                    _lgUtils2.default.addClass(_this.outer, 'lg-grabbing');

                    _lgUtils2.default.trigger(_this.el, 'onDragstart');
                  }
                }
              }
            });
          }

          _lgUtils2.default.on(window, 'mousemove.lg', function (e) {
            if (isDraging) {
              isMoved = true;
              endCoords = e.pageX;

              _this.touchMove(startCoords, endCoords);

              _lgUtils2.default.trigger(_this.el, 'onDragmove');
            }
          });

          _lgUtils2.default.on(window, 'mouseup.lg', function (e) {
            if (isMoved) {
              isMoved = false;

              _this.touchEnd(endCoords - startCoords);

              _lgUtils2.default.trigger(_this.el, 'onDragend');
            } else if (_lgUtils2.default.hasClass(e.target, 'lg-object') || _lgUtils2.default.hasClass(e.target, 'lg-video-play')) {
              _lgUtils2.default.trigger(_this.el, 'onSlideClick');
            } // Prevent execution on click


            if (isDraging) {
              isDraging = false;

              _lgUtils2.default.removeClass(_this.outer, 'lg-grabbing');

              _lgUtils2.default.addClass(_this.outer, 'lg-grab');
            }
          });
        }
      };

      Plugin.prototype.manageSwipeClass = function () {
        var touchNext = this.index + 1;
        var touchPrev = this.index - 1;
        var length = this.___slide.length;

        if (this.s.loop) {
          if (this.index === 0) {
            touchPrev = length - 1;
          } else if (this.index === length - 1) {
            touchNext = 0;
          }
        }

        for (var i = 0; i < this.___slide.length; i++) {
          _lgUtils2.default.removeClass(this.___slide[i], 'lg-next-slide');

          _lgUtils2.default.removeClass(this.___slide[i], 'lg-prev-slide');
        }

        if (touchPrev > -1) {
          _lgUtils2.default.addClass(this.___slide[touchPrev], 'lg-prev-slide');
        }

        _lgUtils2.default.addClass(this.___slide[touchNext], 'lg-next-slide');
      };

      Plugin.prototype.mousewheel = function () {
        var _this = this;

        _lgUtils2.default.on(_this.outer, 'mousewheel.lg', function (e) {
          if (!e.deltaY) {
            return;
          }

          if (e.deltaY > 0) {
            _this.goToPrevSlide();
          } else {
            _this.goToNextSlide();
          }

          e.preventDefault();
        });
      };

      Plugin.prototype.closeGallery = function () {
        var _this = this;

        var mousedown = false;

        _lgUtils2.default.on(this.outer.querySelector('.lg-close'), 'click.lg', function () {
          _this.destroy();
        });

        if (_this.s.closable) {
          // If you drag the slide and release outside gallery gets close on chrome
          // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
          _lgUtils2.default.on(_this.outer, 'mousedown.lg', function (e) {
            if (_lgUtils2.default.hasClass(e.target, 'lg-outer') || _lgUtils2.default.hasClass(e.target, 'lg-item') || _lgUtils2.default.hasClass(e.target, 'lg-img-wrap')) {
              mousedown = true;
            } else {
              mousedown = false;
            }
          });

          _lgUtils2.default.on(_this.outer, 'mouseup.lg', function (e) {
            if (_lgUtils2.default.hasClass(e.target, 'lg-outer') || _lgUtils2.default.hasClass(e.target, 'lg-item') || _lgUtils2.default.hasClass(e.target, 'lg-img-wrap') && mousedown) {
              if (!_lgUtils2.default.hasClass(_this.outer, 'lg-dragging')) {
                _this.destroy();
              }
            }
          });
        }
      };

      Plugin.prototype.destroy = function (d) {
        var _this = this;

        if (!d) {
          _lgUtils2.default.trigger(_this.el, 'onBeforeClose');
        }

        document.body.scrollTop = _this.prevScrollTop;
        document.documentElement.scrollTop = _this.prevScrollTop;
        /**
         * if d is false or undefined destroy will only close the gallery
         * plugins instance remains with the element
         *
         * if d is true destroy will completely remove the plugin
         */

        if (d) {
          if (!_this.s.dynamic) {
            // only when not using dynamic mode is $items a jquery collection
            for (var i = 0; i < this.items.length; i++) {
              _lgUtils2.default.off(this.items[i], '.lg');

              _lgUtils2.default.off(this.items[i], '.lgcustom');
            }
          }

          var lguid = _this.el.getAttribute('lg-uid');

          delete window.lgData[lguid];

          _this.el.removeAttribute('lg-uid');
        } // Unbind all events added by lightGallery


        _lgUtils2.default.off(this.el, '.lgtm'); // Distroy all lightGallery modules


        for (var key in window.lgModules) {
          if (_this.modules[key]) {
            _this.modules[key].destroy(d);
          }
        }

        this.lGalleryOn = false;
        clearTimeout(_this.hideBartimeout);
        this.hideBartimeout = false;

        _lgUtils2.default.off(window, '.lg');

        _lgUtils2.default.removeClass(document.body, 'lg-on');

        _lgUtils2.default.removeClass(document.body, 'lg-from-hash');

        if (_this.outer) {
          _lgUtils2.default.removeClass(_this.outer, 'lg-visible');
        }

        _lgUtils2.default.removeClass(document.querySelector('.lg-backdrop'), 'in');

        setTimeout(function () {
          try {
            if (_this.outer) {
              _this.outer.parentNode.removeChild(_this.outer);
            }

            if (document.querySelector('.lg-backdrop')) {
              document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
            }

            if (!d) {
              _lgUtils2.default.trigger(_this.el, 'onCloseAfter');
            }

            _this.el.focus();
          } catch (err) {}
        }, _this.s.backdropDuration + 50);
      };

      window.lightGallery = function (el, options) {
        if (!el) {
          return;
        }

        try {
          if (!el.getAttribute('lg-uid')) {
            var uid = 'lg' + window.lgData.uid++;
            window.lgData[uid] = new Plugin(el, options);
            el.setAttribute('lg-uid', uid);
          } else {
            try {
              window.lgData[el.getAttribute('lg-uid')].init();
            } catch (err) {
              console.error('lightGallery has not initiated properly');
            }
          }
        } catch (err) {
          console.error('lightGallery has not initiated properly');
        }
      };
    });
  });
  var lgFullscreen = createCommonjsModule(function (module, exports) {
    /**!
     * lg-fullscreen.js | 1.2.0 | May 20th 2020
     * http://sachinchoolur.github.io/lg-fullscreen.js
     * Copyright (c) 2016 Sachin N; 
     * @license GPLv3 
     */
    (function (f) {
      {
        module.exports = f();
      }
    })(function () {
      return function () {
        function r(e, n, t) {
          function o(i, f) {
            if (!n[i]) {
              if (!e[i]) {
                var c = "function" == typeof commonjsRequire && commonjsRequire;
                if (!f && c) return c(i, !0);
                if (u) return u(i, !0);
                var a = new Error("Cannot find module '" + i + "'");
                throw a.code = "MODULE_NOT_FOUND", a;
              }

              var p = n[i] = {
                exports: {}
              };
              e[i][0].call(p.exports, function (r) {
                var n = e[i][1][r];
                return o(n || r);
              }, p, p.exports, r, e, n, t);
            }

            return n[i].exports;
          }

          for (var u = "function" == typeof commonjsRequire && commonjsRequire, i = 0; i < t.length; i++) {
            o(t[i]);
          }

          return o;
        }

        return r;
      }()({
        1: [function (require, module, exports) {
          (function (global, factory) {
            if (typeof exports !== "undefined") {
              factory();
            } else {
              var mod = {
                exports: {}
              };
              factory();
              global.lgFullscreen = mod.exports;
            }
          })(this, function () {
            var _extends = Object.assign || function (target) {
              for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];

                for (var key in source) {
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                  }
                }
              }

              return target;
            };

            var fullscreenDefaults = {
              fullScreen: true
            };

            function isFullScreen() {
              return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
            }

            var Fullscreen = function Fullscreen(element) {
              this.el = element;
              this.core = window.lgData[this.el.getAttribute('lg-uid')];
              this.core.s = _extends({}, fullscreenDefaults, this.core.s);
              this.init();
              return this;
            };

            Fullscreen.prototype.init = function () {
              var fullScreen = '';

              if (this.core.s.fullScreen) {
                // check for fullscreen browser support
                if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
                  return;
                } else {
                  fullScreen = '<button aria-label="Toggle fullscreen" class="lg-fullscreen lg-icon"></button>';
                  this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', fullScreen);
                  this.fullScreen();
                }
              }
            };

            Fullscreen.prototype.requestFullscreen = function () {
              var el = document.documentElement;

              if (el.requestFullscreen) {
                el.requestFullscreen();
              } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
              } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
              } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
              }
            };

            Fullscreen.prototype.exitFullscreen = function () {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
              } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
              } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
              }
            }; // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode


            Fullscreen.prototype.fullScreen = function () {
              var _this = this;

              utils.on(document, 'fullscreenchange.lgfullscreen webkitfullscreenchange.lgfullscreen mozfullscreenchange.lgfullscreen MSFullscreenChange.lgfullscreen', function () {
                if (utils.hasClass(_this.core.outer, 'lg-fullscreen-on')) {
                  utils.removeClass(_this.core.outer, 'lg-fullscreen-on');
                } else {
                  utils.addClass(_this.core.outer, 'lg-fullscreen-on');
                }
              });
              utils.on(this.core.outer.querySelector('.lg-fullscreen'), 'click.lg', function () {
                if (isFullScreen()) {
                  _this.exitFullscreen();
                } else {
                  _this.requestFullscreen();
                }
              });
            };

            Fullscreen.prototype.destroy = function () {
              // exit from fullscreen if activated
              if (isFullScreen()) {
                this.exitFullscreen();
              }

              utils.off(document, '.lgfullscreen');
            };

            window.lgModules.fullscreen = Fullscreen;
          });
        }, {}]
      }, {}, [1])(1);
    });
  });
  var lgAutoplay = createCommonjsModule(function (module, exports) {
    /**!
     * lg-autoplay.js | 1.2.0 | May 20th 2020
     * http://sachinchoolur.github.io/lg-autoplay.js
     * Copyright (c) 2016 Sachin N; 
     * @license GPLv3 
     */
    (function (f) {
      {
        module.exports = f();
      }
    })(function () {
      return function () {
        function r(e, n, t) {
          function o(i, f) {
            if (!n[i]) {
              if (!e[i]) {
                var c = "function" == typeof commonjsRequire && commonjsRequire;
                if (!f && c) return c(i, !0);
                if (u) return u(i, !0);
                var a = new Error("Cannot find module '" + i + "'");
                throw a.code = "MODULE_NOT_FOUND", a;
              }

              var p = n[i] = {
                exports: {}
              };
              e[i][0].call(p.exports, function (r) {
                var n = e[i][1][r];
                return o(n || r);
              }, p, p.exports, r, e, n, t);
            }

            return n[i].exports;
          }

          for (var u = "function" == typeof commonjsRequire && commonjsRequire, i = 0; i < t.length; i++) {
            o(t[i]);
          }

          return o;
        }

        return r;
      }()({
        1: [function (require, module, exports) {
          (function (global, factory) {
            if (typeof exports !== "undefined") {
              factory();
            } else {
              var mod = {
                exports: {}
              };
              factory();
              global.lgAutoplay = mod.exports;
            }
          })(this, function () {
            var _extends = Object.assign || function (target) {
              for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];

                for (var key in source) {
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                  }
                }
              }

              return target;
            };

            var autoplayDefaults = {
              autoplay: false,
              pause: 5000,
              progressBar: true,
              fourceAutoplay: false,
              autoplayControls: true,
              appendAutoplayControlsTo: '.lg-toolbar'
            };
            /**
             * Creates the autoplay plugin.
             * @param {object} element - lightGallery element
             */

            var Autoplay = function Autoplay(element) {
              this.el = element;
              this.core = window.lgData[this.el.getAttribute('lg-uid')]; // Execute only if items are above 1

              if (this.core.items.length < 2) {
                return false;
              }

              this.core.s = _extends({}, autoplayDefaults, this.core.s);
              this.interval = false; // Identify if slide happened from autoplay

              this.fromAuto = true; // Identify if autoplay canceled from touch/drag

              this.canceledOnTouch = false; // save fourceautoplay value

              this.fourceAutoplayTemp = this.core.s.fourceAutoplay; // do not allow progress bar if browser does not support css3 transitions

              if (!this.core.doCss()) {
                this.core.s.progressBar = false;
              }

              this.init();
              return this;
            };

            Autoplay.prototype.init = function () {
              var _this = this; // append autoplay controls


              if (_this.core.s.autoplayControls) {
                _this.controls();
              } // Create progress bar


              if (_this.core.s.progressBar) {
                _this.core.outer.querySelector('.lg').insertAdjacentHTML('beforeend', '<div class="lg-progress-bar"><div class="lg-progress"></div></div>');
              } // set progress


              _this.progress(); // Start autoplay


              if (_this.core.s.autoplay) {
                _this.startlAuto();
              } // cancel interval on touchstart and dragstart


              utils.on(_this.el, 'onDragstart.lgtm touchstart.lgtm', function () {
                if (_this.interval) {
                  _this.cancelAuto();

                  _this.canceledOnTouch = true;
                }
              }); // restore autoplay if autoplay canceled from touchstart / dragstart

              utils.on(_this.el, 'onDragend.lgtm touchend.lgtm onSlideClick.lgtm', function () {
                if (!_this.interval && _this.canceledOnTouch) {
                  _this.startlAuto();

                  _this.canceledOnTouch = false;
                }
              });
            };

            Autoplay.prototype.progress = function () {
              var _this = this;

              var _progressBar;

              var _progress;

              utils.on(_this.el, 'onBeforeSlide.lgtm', function () {
                // start progress bar animation
                if (_this.core.s.progressBar && _this.fromAuto) {
                  _progressBar = _this.core.outer.querySelector('.lg-progress-bar');
                  _progress = _this.core.outer.querySelector('.lg-progress');

                  if (_this.interval) {
                    _progress.removeAttribute('style');

                    utils.removeClass(_progressBar, 'lg-start');
                    setTimeout(function () {
                      utils.setVendor(_progress, 'Transition', 'width ' + (_this.core.s.speed + _this.core.s.pause) + 'ms ease 0s');
                      utils.addClass(_progressBar, 'lg-start');
                    }, 20);
                  }
                } // Remove setinterval if slide is triggered manually and fourceautoplay is false


                if (!_this.fromAuto && !_this.core.s.fourceAutoplay) {
                  _this.cancelAuto();
                }

                _this.fromAuto = false;
              });
            }; // Manage autoplay via play/stop buttons


            Autoplay.prototype.controls = function () {
              var _this = this;

              var _html = '<button aria-label="Toggle autoplay" class="lg-autoplay-button lg-icon"></button>'; // Append autoplay controls

              _this.core.outer.querySelector(this.core.s.appendAutoplayControlsTo).insertAdjacentHTML('beforeend', _html);

              utils.on(_this.core.outer.querySelector('.lg-autoplay-button'), 'click.lg', function () {
                if (utils.hasClass(_this.core.outer, 'lg-show-autoplay')) {
                  _this.cancelAuto();

                  _this.core.s.fourceAutoplay = false;
                } else {
                  if (!_this.interval) {
                    _this.startlAuto();

                    _this.core.s.fourceAutoplay = _this.fourceAutoplayTemp;
                  }
                }
              });
            }; // Autostart gallery


            Autoplay.prototype.startlAuto = function () {
              var _this = this;

              utils.setVendor(_this.core.outer.querySelector('.lg-progress'), 'Transition', 'width ' + (_this.core.s.speed + _this.core.s.pause) + 'ms ease 0s');
              utils.addClass(_this.core.outer, 'lg-show-autoplay');
              utils.addClass(_this.core.outer.querySelector('.lg-progress-bar'), 'lg-start');
              _this.interval = setInterval(function () {
                if (_this.core.index + 1 < _this.core.items.length) {
                  _this.core.index++;
                } else {
                  _this.core.index = 0;
                }

                _this.fromAuto = true;

                _this.core.slide(_this.core.index, false, false);
              }, _this.core.s.speed + _this.core.s.pause);
            }; // cancel Autostart


            Autoplay.prototype.cancelAuto = function () {
              clearInterval(this.interval);
              this.interval = false;

              if (this.core.outer.querySelector('.lg-progress')) {
                this.core.outer.querySelector('.lg-progress').removeAttribute('style');
              }

              utils.removeClass(this.core.outer, 'lg-show-autoplay');
              utils.removeClass(this.core.outer.querySelector('.lg-progress-bar'), 'lg-start');
            };

            Autoplay.prototype.destroy = function () {
              this.cancelAuto();

              if (this.core.outer.querySelector('.lg-progress-bar')) {
                this.core.outer.querySelector('.lg-progress-bar').parentNode.removeChild(this.core.outer.querySelector('.lg-progress-bar'));
              }
            };

            window.lgModules.autoplay = Autoplay;
          });
        }, {}]
      }, {}, [1])(1);
    });
  });

  (function () {
    var fsButton = document.querySelector('.js-species-carousel-fs');

    if (fsButton) {
      lightGallery(document.querySelector('.js-species-carousel'), {
        selector: '.glide__slide:not(.glide__slide--clone) .lightgallery-image',
        cssEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        download: false,
        fullscreen: true
      });
      listen(fsButton, 'click', function () {
        document.querySelector('.glide__slide:not(.glide__slide--clone) .lightgallery-image > img').click();
      });
    }
  })();

  var BeerSlider = createCommonjsModule(function (module, exports) {
    !function (t, e) {
      module.exports = e();
    }(window, function () {
      return function (t) {
        var e = {};

        function n(r) {
          if (e[r]) return e[r].exports;
          var o = e[r] = {
            i: r,
            l: !1,
            exports: {}
          };
          return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
        }

        return n.m = t, n.c = e, n.d = function (t, e, r) {
          n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: r
          });
        }, n.r = function (t) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
          }), Object.defineProperty(t, "__esModule", {
            value: !0
          });
        }, n.t = function (t, e) {
          if (1 & e && (t = n(t)), 8 & e) return t;
          if (4 & e && "object" == _typeof2(t) && t && t.__esModule) return t;
          var r = Object.create(null);
          if (n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: t
          }), 2 & e && "string" != typeof t) for (var o in t) {
            n.d(r, o, function (e) {
              return t[e];
            }.bind(null, o));
          }
          return r;
        }, n.n = function (t) {
          var e = t && t.__esModule ? function () {
            return t.default;
          } : function () {
            return t;
          };
          return n.d(e, "a", e), e;
        }, n.o = function (t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        }, n.p = "", n(n.s = 47);
      }([function (t, e) {
        t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
      }, function (t, e, n) {
        var r = n(11)("wks"),
            o = n(33),
            i = n(0).Symbol,
            c = n(54);

        t.exports = function (t) {
          return r[t] || (r[t] = c && i[t] || (c ? i : o)("Symbol." + t));
        };
      }, function (t, e, n) {
        var r = n(5);

        t.exports = function (t) {
          if (!r(t)) throw TypeError(String(t) + " is not an object!");
          return t;
        };
      }, function (t, e, n) {
        var r = n(8),
            o = n(21);
        t.exports = n(6) ? function (t, e, n) {
          return r.f(t, e, o(1, n));
        } : function (t, e, n) {
          return t[e] = n, t;
        };
      }, function (t, e) {
        var n = {}.hasOwnProperty;

        t.exports = function (t, e) {
          return n.call(t, e);
        };
      }, function (t, e) {
        t.exports = function (t) {
          return "object" == _typeof2(t) ? null !== t : "function" == typeof t;
        };
      }, function (t, e, n) {
        t.exports = !n(12)(function () {
          return 7 != Object.defineProperty({}, "a", {
            get: function get() {
              return 7;
            }
          }).a;
        });
      }, function (t, e) {
        var n = {}.toString;

        t.exports = function (t) {
          return n.call(t).slice(8, -1);
        };
      }, function (t, e, n) {
        var r = n(6),
            o = n(31),
            i = n(2),
            c = n(32),
            u = Object.defineProperty;
        e.f = r ? u : function (t, e, n) {
          if (i(t), e = c(e, !0), i(n), o) try {
            return u(t, e, n);
          } catch (t) {}
          if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
          return "value" in n && (t[e] = n.value), t;
        };
      }, function (t, e, n) {
        var r = n(0),
            o = n(3),
            i = n(14),
            c = n(19),
            u = n(57);

        t.exports = function (t, e) {
          var n,
              a,
              s,
              f,
              l = t.target;
          if (n = t.global ? r : t.stat ? r[l] || c(l, {}) : (r[l] || {}).prototype) for (a in e) {
            if (s = n[a], f = e[a], !t.forced && void 0 !== s) {
              if (_typeof2(f) == _typeof2(s)) continue;
              u(f, s);
            }

            (t.sham || s && s.sham) && o(f, "sham", !0), i(n, a, f, t.unsafe);
          }
        };
      }, function (t, e) {
        t.exports = {};
      }, function (t, e, n) {
        var r = n(0),
            o = n(19),
            i = r["__core-js_shared__"] || o("__core-js_shared__", {});
        (t.exports = function (t, e) {
          return i[t] || (i[t] = void 0 !== e ? e : {});
        })("versions", []).push({
          version: "3.0.0-beta.3",
          mode: n(13) ? "pure" : "global",
          copyright: "© 2018 Denis Pushkarev (zloirock.ru)"
        });
      }, function (t, e) {
        t.exports = function (t) {
          try {
            return !!t();
          } catch (t) {
            return !0;
          }
        };
      }, function (t, e) {
        t.exports = !1;
      }, function (t, e, n) {
        var r = n(0),
            o = n(3),
            i = n(4),
            c = n(19),
            u = n(34),
            a = n(15),
            s = a.get,
            f = a.enforce,
            l = String(u).split("toString");
        n(11)("inspectSource", function (t) {
          return u.call(t);
        }), (t.exports = function (t, e, n, u) {
          "function" == typeof n && ("string" != typeof e || i(n, "name") || o(n, "name", e), f(n).source = l.join("string" == typeof e ? e : "")), t === r ? c(e, n) : u ? t[e] ? t[e] = n : o(t, e, n) : (delete t[e], o(t, e, n));
        })(Function.prototype, "toString", function () {
          return "function" == typeof this && s(this).source || u.call(this);
        });
      }, function (t, e, n) {
        var r,
            o,
            i,
            c = n(0),
            u = n(34),
            a = n(5),
            s = n(3),
            f = n(4),
            l = n(22),
            p = n(23),
            v = c.WeakMap;

        if ("function" == typeof v && /native code/.test(u.call(v))) {
          var d = new v(),
              h = d.get,
              y = d.has,
              g = d.set;
          r = function r(t, e) {
            return g.call(d, t, e), e;
          }, o = function o(t) {
            return h.call(d, t) || {};
          }, i = function i(t) {
            return y.call(d, t);
          };
        } else {
          var m = l("state");
          p[m] = !0, r = function r(t, e) {
            return s(t, m, e), e;
          }, o = function o(t) {
            return f(t, m) ? t[m] : {};
          }, i = function i(t) {
            return f(t, m);
          };
        }

        t.exports = {
          set: r,
          get: o,
          has: i,
          enforce: function enforce(t) {
            return i(t) ? o(t) : r(t, {});
          },
          getterFor: function getterFor(t) {
            return function (e) {
              var n;
              if (!a(e) || (n = o(e)).type !== t) throw TypeError("Incompatible receiver, " + t + " required!");
              return n;
            };
          }
        };
      }, function (t, e, n) {
        var r = n(60),
            o = n(25);

        t.exports = function (t) {
          return r(o(t));
        };
      }, function (t, e) {
        t.exports = function (t) {
          if ("function" != typeof t) throw TypeError(String(t) + " is not a function!");
          return t;
        };
      }, function (t, e, n) {
        var r = n(17);

        t.exports.f = function (t) {
          return new function (t) {
            var e, n;
            this.promise = new t(function (t, r) {
              if (void 0 !== e || void 0 !== n) throw TypeError("Bad Promise constructor");
              e = t, n = r;
            }), this.resolve = r(e), this.reject = r(n);
          }(t);
        };
      }, function (t, e, n) {
        var r = n(0),
            o = n(3);

        t.exports = function (t, e) {
          try {
            o(r, t, e);
          } catch (n) {
            r[t] = e;
          }

          return e;
        };
      }, function (t, e, n) {
        var r = n(5),
            o = n(0).document,
            i = r(o) && r(o.createElement);

        t.exports = function (t) {
          return i ? o.createElement(t) : {};
        };
      }, function (t, e) {
        t.exports = function (t, e) {
          return {
            enumerable: !(1 & t),
            configurable: !(2 & t),
            writable: !(4 & t),
            value: e
          };
        };
      }, function (t, e, n) {
        var r = n(11)("keys"),
            o = n(33);

        t.exports = function (t) {
          return r[t] || (r[t] = o(t));
        };
      }, function (t, e) {
        t.exports = {};
      }, function (t, e) {
        var n = Math.ceil,
            r = Math.floor;

        t.exports = function (t) {
          return isNaN(t = +t) ? 0 : (t > 0 ? r : n)(t);
        };
      }, function (t, e) {
        t.exports = function (t) {
          if (void 0 == t) throw TypeError("Can't call method on  " + t);
          return t;
        };
      }, function (t, e) {
        t.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
      }, function (t, e, n) {
        var r = n(8).f,
            o = n(4),
            i = n(1)("toStringTag");

        t.exports = function (t, e, n) {
          t && !o(t = n ? t : t.prototype, i) && r(t, i, {
            configurable: !0,
            value: e
          });
        };
      }, function (t, e) {
        t.exports = function (t) {
          try {
            return {
              e: !1,
              v: t()
            };
          } catch (t) {
            return {
              e: !0,
              v: t
            };
          }
        };
      }, function (t, e, n) {
        t.exports = n(0);
      }, function (t, e, n) {
        var r = n(7),
            o = n(1)("toStringTag"),
            i = "Arguments" == r(function () {
          return arguments;
        }());

        t.exports = function (t) {
          var e, n, c;
          return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (n = function (t, e) {
            try {
              return t[e];
            } catch (t) {}
          }(e = Object(t), o)) ? n : i ? r(e) : "Object" == (c = r(e)) && "function" == typeof e.callee ? "Arguments" : c;
        };
      }, function (t, e, n) {
        t.exports = !n(6) && !n(12)(function () {
          return 7 != Object.defineProperty(n(20)("div"), "a", {
            get: function get() {
              return 7;
            }
          }).a;
        });
      }, function (t, e, n) {
        var r = n(5);

        t.exports = function (t, e) {
          if (!r(t)) return t;
          var n, o;
          if (e && "function" == typeof (n = t.toString) && !r(o = n.call(t))) return o;
          if ("function" == typeof (n = t.valueOf) && !r(o = n.call(t))) return o;
          if (!e && "function" == typeof (n = t.toString) && !r(o = n.call(t))) return o;
          throw TypeError("Can't convert object to primitive value");
        };
      }, function (t, e) {
        var n = 0,
            r = Math.random();

        t.exports = function (t) {
          return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++n + r).toString(36));
        };
      }, function (t, e, n) {
        t.exports = n(11)("native-function-to-string", Function.toString);
      }, function (t, e, n) {
        var r = n(9),
            o = n(66),
            i = n(39),
            c = n(71),
            u = n(27),
            a = n(3),
            s = n(14),
            f = n(13),
            l = n(1)("iterator"),
            p = n(10),
            v = n(38),
            d = v.IteratorPrototype,
            h = v.BUGGY_SAFARI_ITERATORS,
            y = function y() {
          return this;
        };

        t.exports = function (t, e, n, v, g, m, x) {
          o(n, e, v);

          var b,
              j,
              S,
              w = function w(t) {
            if (t === g && _) return _;
            if (!h && t in E) return E[t];

            switch (t) {
              case "keys":
              case "values":
              case "entries":
                return function () {
                  return new n(this, t);
                };
            }

            return function () {
              return new n(this);
            };
          },
              O = e + " Iterator",
              P = !1,
              E = t.prototype,
              T = E[l] || E["@@iterator"] || g && E[g],
              _ = !h && T || w(g),
              L = "Array" == e && E.entries || T;

          if (L && (b = i(L.call(new t())), d !== Object.prototype && b.next && (f || i(b) === d || (c ? c(b, d) : "function" != typeof b[l] && a(b, l, y)), u(b, O, !0, !0), f && (p[O] = y))), "values" == g && T && "values" !== T.name && (P = !0, _ = function _() {
            return T.call(this);
          }), f && !x || E[l] === _ || a(E, l, _), p[e] = _, g) if (j = {
            values: w("values"),
            keys: m ? _ : w("keys"),
            entries: w("entries")
          }, x) for (S in j) {
            !h && !P && S in E || s(E, S, j[S]);
          } else r({
            target: e,
            proto: !0,
            forced: h || P
          }, j);
          return j;
        };
      }, function (t, e, n) {
        var r = n(4),
            o = n(16),
            i = n(61)(!1),
            c = n(23);

        t.exports = function (t, e) {
          var n,
              u = o(t),
              a = 0,
              s = [];

          for (n in u) {
            !r(c, n) && r(u, n) && s.push(n);
          }

          for (; e.length > a;) {
            r(u, n = e[a++]) && (~i(s, n) || s.push(n));
          }

          return s;
        };
      }, function (t, e, n) {
        var r = n(24),
            o = Math.min;

        t.exports = function (t) {
          return t > 0 ? o(r(t), 9007199254740991) : 0;
        };
      }, function (t, e, n) {
        var r,
            o,
            i,
            c = n(39),
            u = n(3),
            a = n(4),
            s = n(13),
            f = n(1)("iterator"),
            l = !1;
        [].keys && ("next" in (i = [].keys()) ? (o = c(c(i))) !== Object.prototype && (r = o) : l = !0), void 0 == r && (r = {}), s || a(r, f) || u(r, f, function () {
          return this;
        }), t.exports = {
          IteratorPrototype: r,
          BUGGY_SAFARI_ITERATORS: l
        };
      }, function (t, e, n) {
        var r = n(4),
            o = n(67),
            i = n(22)("IE_PROTO"),
            c = n(68),
            u = Object.prototype;
        t.exports = c ? Object.getPrototypeOf : function (t) {
          return t = o(t), r(t, i) ? t[i] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? u : null;
        };
      }, function (t, e, n) {
        var r = n(2),
            o = n(69),
            i = n(26),
            c = n(41),
            u = n(20),
            a = n(22)("IE_PROTO"),
            s = function s() {},
            _f2 = function f() {
          var t,
              e = u("iframe"),
              n = i.length;

          for (e.style.display = "none", c.appendChild(e), e.src = "javascript:", (t = e.contentWindow.document).open(), t.write("<script>document.F=Object<\/script>"), t.close(), _f2 = t.F; n--;) {
            delete _f2.prototype[i[n]];
          }

          return _f2();
        };

        t.exports = Object.create || function (t, e) {
          var n;
          return null !== t ? (s.prototype = r(t), n = new s(), s.prototype = null, n[a] = t) : n = _f2(), void 0 === e ? n : o(n, e);
        }, n(23)[a] = !0;
      }, function (t, e, n) {
        var r = n(0).document;
        t.exports = r && r.documentElement;
      }, function (t, e, n) {
        var r = n(2),
            o = n(79),
            i = n(37),
            c = n(43),
            u = n(80),
            a = n(81),
            s = {};
        (t.exports = function (t, e, n, f, l) {
          var p,
              v,
              d,
              h,
              y,
              g = c(e, n, f ? 2 : 1);
          if (l) p = t;else {
            if ("function" != typeof (v = u(t))) throw TypeError("Target is not iterable!");

            if (o(v)) {
              for (d = 0, h = i(t.length); h > d; d++) {
                if ((f ? g(r(y = t[d])[0], y[1]) : g(t[d])) === s) return;
              }

              return;
            }

            p = v.call(t);
          }

          for (; !(y = p.next()).done;) {
            if (a(p, g, y.value, f) === s) return;
          }
        }).BREAK = s;
      }, function (t, e, n) {
        var r = n(17);

        t.exports = function (t, e, n) {
          if (r(t), void 0 === e) return t;

          switch (n) {
            case 0:
              return function () {
                return t.call(e);
              };

            case 1:
              return function (n) {
                return t.call(e, n);
              };

            case 2:
              return function (n, r) {
                return t.call(e, n, r);
              };

            case 3:
              return function (n, r, o) {
                return t.call(e, n, r, o);
              };
          }

          return function () {
            return t.apply(e, arguments);
          };
        };
      }, function (t, e, n) {
        var r = n(2),
            o = n(17),
            i = n(1)("species");

        t.exports = function (t, e) {
          var n,
              c = r(t).constructor;
          return void 0 === c || void 0 == (n = r(c)[i]) ? e : o(n);
        };
      }, function (t, e, n) {
        var r,
            o,
            i,
            c = n(0),
            u = n(7),
            a = n(43),
            s = n(41),
            f = n(20),
            l = c.setImmediate,
            p = c.clearImmediate,
            v = c.process,
            d = c.MessageChannel,
            h = c.Dispatch,
            y = 0,
            g = {},
            m = function m() {
          var t = +this;

          if (g.hasOwnProperty(t)) {
            var e = g[t];
            delete g[t], e();
          }
        },
            x = function x(t) {
          m.call(t.data);
        };

        l && p || (l = function l(t) {
          for (var e = [], n = 1; arguments.length > n;) {
            e.push(arguments[n++]);
          }

          return g[++y] = function () {
            ("function" == typeof t ? t : Function(t)).apply(void 0, e);
          }, r(y), y;
        }, p = function p(t) {
          delete g[t];
        }, "process" == u(v) ? r = function r(t) {
          v.nextTick(a(m, t, 1));
        } : h && h.now ? r = function r(t) {
          h.now(a(m, t, 1));
        } : d ? (i = (o = new d()).port2, o.port1.onmessage = x, r = a(i.postMessage, i, 1)) : c.addEventListener && "function" == typeof postMessage && !c.importScripts ? (r = function r(t) {
          c.postMessage(t + "", "*");
        }, c.addEventListener("message", x, !1)) : r = "onreadystatechange" in f("script") ? function (t) {
          s.appendChild(f("script")).onreadystatechange = function () {
            s.removeChild(this), m.call(t);
          };
        } : function (t) {
          setTimeout(a(m, t, 1), 0);
        }), t.exports = {
          set: l,
          clear: p
        };
      }, function (t, e, n) {
        var r = n(2),
            o = n(5),
            i = n(18);

        t.exports = function (t, e) {
          if (r(t), o(e) && e.constructor === t) return e;
          var n = i.f(t);
          return (0, n.resolve)(e), n.promise;
        };
      }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
          value: !0
        }), n(48);
        !function (t) {
          t && t.__esModule;
        }(n(50));
        var r = n(91);
        e.default = r.BeerSlider;
      }, function (t, e, n) {},, function (t, e, n) {
        t.exports = n(51), n(89), n(90);
      }, function (t, e, n) {
        n(52), n(55), n(73), n(77), n(88), t.exports = n(29).Promise;
      }, function (t, e, n) {
        var r = n(53);
        r !== {}.toString && n(14)(Object.prototype, "toString", r, !0);
      }, function (t, e, n) {
        var r = n(30),
            o = {};
        o[n(1)("toStringTag")] = "z", t.exports = "[object z]" !== String(o) ? function () {
          return "[object " + r(this) + "]";
        } : o.toString;
      }, function (t, e, n) {
        t.exports = !n(12)(function () {});
      }, function (t, e, n) {
        var r = n(56)(!0),
            o = n(15),
            i = n(35),
            c = o.set,
            u = o.getterFor("String Iterator");
        i(String, "String", function (t) {
          c(this, {
            type: "String Iterator",
            string: String(t),
            index: 0
          });
        }, function () {
          var t,
              e = u(this),
              n = e.string,
              o = e.index;
          return o >= n.length ? {
            value: void 0,
            done: !0
          } : (t = r(n, o), e.index += t.length, {
            value: t,
            done: !1
          });
        });
      }, function (t, e, n) {
        var r = n(24),
            o = n(25);

        t.exports = function (t) {
          return function (e, n) {
            var i,
                c,
                u = String(o(e)),
                a = r(n),
                s = u.length;
            return a < 0 || a >= s ? t ? "" : void 0 : (i = u.charCodeAt(a)) < 55296 || i > 56319 || a + 1 === s || (c = u.charCodeAt(a + 1)) < 56320 || c > 57343 ? t ? u.charAt(a) : i : t ? u.slice(a, a + 2) : c - 56320 + (i - 55296 << 10) + 65536;
          };
        };
      }, function (t, e, n) {
        var r = n(4),
            o = n(58),
            i = n(64),
            c = n(8);

        t.exports = function (t, e) {
          for (var n = o(e), u = c.f, a = i.f, s = 0; s < n.length; s++) {
            var f = n[s];
            r(t, f) || u(t, f, a(e, f));
          }
        };
      }, function (t, e, n) {
        var r = n(59),
            o = n(63),
            i = n(2),
            c = n(0).Reflect;

        t.exports = c && c.ownKeys || function (t) {
          var e = r.f(i(t)),
              n = o.f;
          return n ? e.concat(n(t)) : e;
        };
      }, function (t, e, n) {
        var r = n(36),
            o = n(26).concat("length", "prototype");

        e.f = Object.getOwnPropertyNames || function (t) {
          return r(t, o);
        };
      }, function (t, e, n) {
        var r = n(7),
            o = "".split;
        t.exports = Object("z").propertyIsEnumerable(0) ? Object : function (t) {
          return "String" == r(t) ? o.call(t, "") : Object(t);
        };
      }, function (t, e, n) {
        var r = n(16),
            o = n(37),
            i = n(62);

        t.exports = function (t) {
          return function (e, n, c) {
            var u,
                a = r(e),
                s = o(a.length),
                f = i(c, s);

            if (t && n != n) {
              for (; s > f;) {
                if ((u = a[f++]) != u) return !0;
              }
            } else for (; s > f; f++) {
              if ((t || f in a) && a[f] === n) return t || f || 0;
            }

            return !t && -1;
          };
        };
      }, function (t, e, n) {
        var r = n(24),
            o = Math.max,
            i = Math.min;

        t.exports = function (t, e) {
          var n = r(t);
          return n < 0 ? o(n + e, 0) : i(n, e);
        };
      }, function (t, e) {
        e.f = Object.getOwnPropertySymbols;
      }, function (t, e, n) {
        var r = n(6),
            o = n(65),
            i = n(21),
            c = n(16),
            u = n(32),
            a = n(4),
            s = n(31),
            f = Object.getOwnPropertyDescriptor;
        e.f = r ? f : function (t, e) {
          if (t = c(t), e = u(e, !0), s) try {
            return f(t, e);
          } catch (t) {}
          if (a(t, e)) return i(!o.f.call(t, e), t[e]);
        };
      }, function (t, e, n) {
        var r = {}.propertyIsEnumerable,
            o = Object.getOwnPropertyDescriptor,
            i = o && !r.call({
          1: 2
        }, 1);
        e.f = i ? function (t) {
          var e = o(this, t);
          return !!e && e.enumerable;
        } : r;
      }, function (t, e, n) {
        var r = n(38).IteratorPrototype,
            o = n(40),
            i = n(21),
            c = n(27),
            u = n(10),
            a = function a() {
          return this;
        };

        t.exports = function (t, e, n) {
          var s = e + " Iterator";
          return t.prototype = o(r, {
            next: i(1, n)
          }), c(t, s, !1, !0), u[s] = a, t;
        };
      }, function (t, e, n) {
        var r = n(25);

        t.exports = function (t) {
          return Object(r(t));
        };
      }, function (t, e, n) {
        t.exports = !n(12)(function () {
          function t() {}

          return t.prototype.constructor = null, Object.getPrototypeOf(new t()) !== t.prototype;
        });
      }, function (t, e, n) {
        var r = n(6),
            o = n(8),
            i = n(2),
            c = n(70);
        t.exports = r ? Object.defineProperties : function (t, e) {
          i(t);

          for (var n, r = c(e), u = r.length, a = 0; u > a;) {
            o.f(t, n = r[a++], e[n]);
          }

          return t;
        };
      }, function (t, e, n) {
        var r = n(36),
            o = n(26);

        t.exports = Object.keys || function (t) {
          return r(t, o);
        };
      }, function (t, e, n) {
        var r = n(72);
        t.exports = Object.setPrototypeOf || ("__proto__" in {} ? function () {
          var t,
              e = {},
              n = !0;

          try {
            (t = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set).call(e, []), n = e instanceof Array;
          } catch (t) {
            n = !1;
          }

          return function (e, o) {
            return r(e, o), n ? t.call(e, o) : e.__proto__ = o, e;
          };
        }() : void 0);
      }, function (t, e, n) {
        var r = n(5),
            o = n(2);

        t.exports = function (t, e) {
          if (o(t), !r(e) && null !== e) throw TypeError(String(e) + ": can't set as a prototype!");
        };
      }, function (t, e, n) {
        var r = n(74),
            o = n(75),
            i = n(0),
            c = n(3),
            u = n(1),
            a = u("iterator"),
            s = u("toStringTag"),
            f = o.values;

        for (var l in r) {
          var p = i[l],
              v = p && p.prototype;

          if (v) {
            if (v[a] !== f) try {
              c(v, a, f);
            } catch (t) {
              v[a] = f;
            }
            if (v[s] || c(v, s, l), r[l]) for (var d in o) {
              if (v[d] !== o[d]) try {
                c(v, d, o[d]);
              } catch (t) {
                v[d] = o[d];
              }
            }
          }
        }
      }, function (t, e) {
        t.exports = {
          CSSRuleList: 0,
          CSSStyleDeclaration: 0,
          CSSValueList: 0,
          ClientRectList: 0,
          DOMRectList: 0,
          DOMStringList: 0,
          DOMTokenList: 1,
          DataTransferItemList: 0,
          FileList: 0,
          HTMLAllCollection: 0,
          HTMLCollection: 0,
          HTMLFormElement: 0,
          HTMLSelectElement: 0,
          MediaList: 0,
          MimeTypeArray: 0,
          NamedNodeMap: 0,
          NodeList: 1,
          PaintRequestList: 0,
          Plugin: 0,
          PluginArray: 0,
          SVGLengthList: 0,
          SVGNumberList: 0,
          SVGPathSegList: 0,
          SVGPointList: 0,
          SVGStringList: 0,
          SVGTransformList: 0,
          SourceBufferList: 0,
          StyleSheetList: 0,
          TextTrackCueList: 0,
          TextTrackList: 0,
          TouchList: 0
        };
      }, function (t, e, n) {
        var r = n(16),
            o = n(76),
            i = n(10),
            c = n(15),
            u = n(35),
            a = c.set,
            s = c.getterFor("Array Iterator");
        t.exports = u(Array, "Array", function (t, e) {
          a(this, {
            type: "Array Iterator",
            target: r(t),
            index: 0,
            kind: e
          });
        }, function () {
          var t = s(this),
              e = t.target,
              n = t.kind,
              r = t.index++;
          return !e || r >= e.length ? (t.target = void 0, {
            value: void 0,
            done: !0
          }) : "keys" == n ? {
            value: r,
            done: !1
          } : "values" == n ? {
            value: e[r],
            done: !1
          } : {
            value: [r, e[r]],
            done: !1
          };
        }, "values"), i.Arguments = i.Array, o("keys"), o("values"), o("entries");
      }, function (t, e, n) {
        var r = n(1)("unscopables"),
            o = n(40),
            i = n(3),
            c = Array.prototype;
        void 0 == c[r] && i(c, r, o(null)), t.exports = function (t) {
          c[r][t] = !0;
        };
      }, function (t, e, n) {
        var r,
            o,
            i,
            c = "Promise",
            u = n(13),
            a = n(0),
            s = n(9),
            f = n(5),
            l = n(17),
            p = n(78),
            v = n(7),
            d = n(42),
            h = n(82),
            y = n(44),
            g = n(45).set,
            m = n(83)(),
            x = n(46),
            b = n(84),
            j = n(18),
            S = n(28),
            w = n(85),
            O = n(1)("species"),
            P = n(15),
            E = P.get,
            T = P.set,
            _ = P.getterFor(c),
            _L = a.Promise,
            M = a.TypeError,
            I = a.document,
            A = a.process,
            k = A && A.versions,
            C = k && k.v8 || "",
            R = j.f,
            F = R,
            B = "process" == v(A),
            D = !!(I && I.createEvent && a.dispatchEvent),
            G = !!function () {
          try {
            var t = _L.resolve(1),
                e = function e() {},
                n = (t.constructor = {})[O] = function (t) {
              t(e, e);
            };

            return (B || "function" == typeof PromiseRejectionEvent) && (!u || t.finally) && t.then(e) instanceof n && 0 !== C.indexOf("6.6") && -1 === w.indexOf("Chrome/66");
          } catch (t) {}
        }(),
            N = function N(t) {
          var e;
          return !(!f(t) || "function" != typeof (e = t.then)) && e;
        },
            V = function V(t, e, n) {
          if (!e.notified) {
            e.notified = !0;
            var r = e.reactions;
            m(function () {
              for (var o = e.value, i = 1 == e.state, c = 0, u = function u(n) {
                var r,
                    c,
                    u,
                    a = i ? n.ok : n.fail,
                    s = n.resolve,
                    f = n.reject,
                    l = n.domain;

                try {
                  a ? (i || (2 === e.rejection && U(t, e), e.rejection = 1), !0 === a ? r = o : (l && l.enter(), r = a(o), l && (l.exit(), u = !0)), r === n.promise ? f(M("Promise-chain cycle")) : (c = N(r)) ? c.call(r, s, f) : s(r)) : f(o);
                } catch (t) {
                  l && !u && l.exit(), f(t);
                }
              }; r.length > c;) {
                u(r[c++]);
              }

              e.reactions = [], e.notified = !1, n && !e.rejection && z(t, e);
            });
          }
        },
            W = function W(t, e, n) {
          var r, o;
          D ? ((r = I.createEvent("Event")).promise = e, r.reason = n, r.initEvent(t, !1, !0), a.dispatchEvent(r)) : r = {
            promise: e,
            reason: n
          }, (o = a["on" + t]) ? o(r) : "unhandledrejection" === t && b("Unhandled promise rejection", n);
        },
            z = function z(t, e) {
          g.call(a, function () {
            var n,
                r = e.value,
                o = H(e);
            if (o && (n = S(function () {
              B ? A.emit("unhandledRejection", r, t) : W("unhandledrejection", t, r);
            }), e.rejection = B || H(e) ? 2 : 1), o && n.e) throw n.v;
          });
        },
            H = function H(t) {
          return 1 !== t.rejection && !t.parent;
        },
            U = function U(t, e) {
          g.call(a, function () {
            B ? A.emit("rejectionHandled", t) : W("rejectionhandled", t, e.value);
          });
        },
            K = function K(t, e, n, r) {
          return function (o) {
            t(e, n, o, r);
          };
        },
            q = function q(t, e, n, r) {
          e.done || (e.done = !0, r && (e = r), e.value = n, e.state = 2, V(t, e, !0));
        },
            Y = function Y(t, e, n, r) {
          if (!e.done) {
            e.done = !0, r && (e = r);

            try {
              if (t === n) throw M("Promise can't be resolved itself!");
              var o = N(n);
              o ? m(function () {
                var r = {
                  done: !1
                };

                try {
                  o.call(n, K(Y, t, r, e), K(q, t, r, e));
                } catch (n) {
                  q(t, r, n, e);
                }
              }) : (e.value = n, e.state = 1, V(t, e, !1));
            } catch (n) {
              q(t, {
                done: !1
              }, n, e);
            }
          }
        };

        G || (_L = function L(t) {
          p(this, _L, c), l(t), r.call(this);
          var e = E(this);

          try {
            t(K(Y, this, e), K(q, this, e));
          } catch (t) {
            q(this, e, t);
          }
        }, (r = function r(t) {
          T(this, {
            type: c,
            done: !1,
            notified: !1,
            parent: !1,
            reactions: [],
            rejection: !1,
            state: 0,
            value: void 0
          });
        }).prototype = n(86)(_L.prototype, {
          then: function then(t, e) {
            var n = _(this),
                r = R(y(this, _L));

            return r.ok = "function" != typeof t || t, r.fail = "function" == typeof e && e, r.domain = B ? A.domain : void 0, n.parent = !0, n.reactions.push(r), 0 != n.state && V(this, n, !1), r.promise;
          },
          catch: function _catch(t) {
            return this.then(void 0, t);
          }
        }), o = function o() {
          var t = new r(),
              e = E(t);
          this.promise = t, this.resolve = K(Y, t, e), this.reject = K(q, t, e);
        }, j.f = R = function R(t) {
          return t === _L || t === i ? new o(t) : F(t);
        }), s({
          global: !0,
          wrap: !0,
          forced: !G
        }, {
          Promise: _L
        }), n(27)(_L, c, !1, !0), n(87)(c), i = n(29).Promise, s({
          target: c,
          stat: !0,
          forced: !G
        }, {
          reject: function reject(t) {
            var e = R(this);
            return e.reject.call(void 0, t), e.promise;
          }
        }), s({
          target: c,
          stat: !0,
          forced: u || !G
        }, {
          resolve: function resolve(t) {
            return x(u && this === i ? _L : this, t);
          }
        }), s({
          target: c,
          stat: !0,
          forced: !(G && h(function (t) {
            _L.all(t).catch(function () {});
          }))
        }, {
          all: function all(t) {
            var e = this,
                n = R(e),
                r = n.resolve,
                o = n.reject,
                i = S(function () {
              var n = [],
                  i = 0,
                  c = 1;
              d(t, function (t) {
                var u = i++,
                    a = !1;
                n.push(void 0), c++, e.resolve(t).then(function (t) {
                  a || (a = !0, n[u] = t, --c || r(n));
                }, o);
              }), --c || r(n);
            });
            return i.e && o(i.v), n.promise;
          },
          race: function race(t) {
            var e = this,
                n = R(e),
                r = n.reject,
                o = S(function () {
              d(t, function (t) {
                e.resolve(t).then(n.resolve, r);
              });
            });
            return o.e && r(o.v), n.promise;
          }
        });
      }, function (t, e) {
        t.exports = function (t, e, n) {
          if (!(t instanceof e)) throw TypeError((n ? n + ": i" : "I") + "ncorrect invocation!");
          return t;
        };
      }, function (t, e, n) {
        var r = n(10),
            o = n(1)("iterator"),
            i = Array.prototype;

        t.exports = function (t) {
          return void 0 !== t && (r.Array === t || i[o] === t);
        };
      }, function (t, e, n) {
        var r = n(30),
            o = n(1)("iterator"),
            i = n(10);

        t.exports = function (t) {
          if (void 0 != t) return t[o] || t["@@iterator"] || i[r(t)];
        };
      }, function (t, e, n) {
        var r = n(2);

        t.exports = function (t, e, n, o) {
          try {
            return o ? e(r(n)[0], n[1]) : e(n);
          } catch (e) {
            var i = t.return;
            throw void 0 !== i && r(i.call(t)), e;
          }
        };
      }, function (t, e, n) {
        var r = n(1)("iterator"),
            o = !1;

        try {
          var i = 0,
              c = {
            next: function next() {
              return {
                done: !!i++
              };
            },
            return: function _return() {
              o = !0;
            }
          };
          c[r] = function () {
            return this;
          }, Array.from(c, function () {
            throw 2;
          });
        } catch (t) {}

        t.exports = function (t, e) {
          if (!e && !o) return !1;
          var n = !1;

          try {
            var i = {};
            i[r] = function () {
              return {
                next: function next() {
                  return {
                    done: n = !0
                  };
                }
              };
            }, t(i);
          } catch (t) {}

          return n;
        };
      }, function (t, e, n) {
        var r = n(0),
            o = n(7),
            i = n(45).set,
            c = r.MutationObserver || r.WebKitMutationObserver,
            u = r.process,
            a = r.Promise,
            s = "process" == o(u);

        t.exports = function () {
          var t,
              e,
              n,
              o = function o() {
            var r, o;

            for (s && (r = u.domain) && r.exit(); t;) {
              o = t.fn, t = t.next;

              try {
                o();
              } catch (r) {
                throw t ? n() : e = void 0, r;
              }
            }

            e = void 0, r && r.enter();
          };

          if (s) n = function n() {
            u.nextTick(o);
          };else if (!c || r.navigator && r.navigator.standalone) {
            if (a && a.resolve) {
              var f = a.resolve(void 0);

              n = function n() {
                f.then(o);
              };
            } else n = function n() {
              i.call(r, o);
            };
          } else {
            var l = !0,
                p = document.createTextNode("");
            new c(o).observe(p, {
              characterData: !0
            }), n = function n() {
              p.data = l = !l;
            };
          }
          return function (r) {
            var o = {
              fn: r,
              next: void 0
            };
            e && (e.next = o), t || (t = o, n()), e = o;
          };
        };
      }, function (t, e, n) {
        var r = n(0);

        t.exports = function (t, e) {
          var n = r.console;
          n && n.error && (1 === arguments.length ? n.error(t) : n.error(t, e));
        };
      }, function (t, e, n) {
        var r = n(0).navigator;
        t.exports = r && r.userAgent || "";
      }, function (t, e, n) {
        var r = n(14);

        t.exports = function (t, e, n) {
          for (var o in e) {
            r(t, o, e[o], n);
          }

          return t;
        };
      }, function (t, e, n) {
        var r = n(0),
            o = n(8),
            i = n(6),
            c = n(1)("species");

        t.exports = function (t) {
          var e = r[t];
          i && e && !e[c] && o.f(e, c, {
            configurable: !0,
            get: function get() {
              return this;
            }
          });
        };
      }, function (t, e, n) {
        var r = n(29),
            o = n(0),
            i = n(44),
            c = n(46);
        n(9)({
          target: "Promise",
          proto: !0,
          real: !0
        }, {
          finally: function _finally(t) {
            var e = i(this, "function" == typeof r.Promise ? r.Promise : o.Promise),
                n = "function" == typeof t;
            return this.then(n ? function (n) {
              return c(e, t()).then(function () {
                return n;
              });
            } : t, n ? function (n) {
              return c(e, t()).then(function () {
                throw n;
              });
            } : t);
          }
        });
      }, function (t, e, n) {
        var r = n(18),
            o = n(28),
            i = n(42);
        n(9)({
          target: "Promise",
          stat: !0
        }, {
          allSettled: function allSettled(t) {
            var e = this,
                n = r.f(e),
                c = n.resolve,
                u = n.reject,
                a = o(function () {
              var n = [],
                  r = 0,
                  o = 1;
              i(t, function (t) {
                var i = r++,
                    u = !1;
                n.push(void 0), o++, e.resolve(t).then(function (t) {
                  u || (u = !0, n[i] = {
                    value: t,
                    status: "fulfilled"
                  }, --o || c(n));
                }, function (t) {
                  u || (u = !0, n[i] = {
                    reason: t,
                    status: "rejected"
                  }, --o || c(n));
                });
              }), --o || c(n);
            });
            return a.e && u(a.v), n.promise;
          }
        });
      }, function (t, e, n) {
        var r = n(18),
            o = n(28);
        n(9)({
          target: "Promise",
          stat: !0
        }, {
          try: function _try(t) {
            var e = r.f(this),
                n = o(t);
            return (n.e ? e.reject : e.resolve)(n.v), e.promise;
          }
        });
      }, function (t, e, n) {
        Object.defineProperty(e, "__esModule", {
          value: !0
        });

        var r = function () {
          function t(t, e) {
            for (var n = 0; n < e.length; n++) {
              var r = e[n];
              r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
            }
          }

          return function (e, n, r) {
            return n && t(e.prototype, n), r && t(e, r), e;
          };
        }();

        e.BeerSlider = function () {
          function t(e) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                r = n.start,
                o = void 0 === r ? "50" : r,
                i = n.prefix,
                c = void 0 === i ? "beer" : i;
            !function (t, e) {
              if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
            }(this, t), this.start = parseInt(o) ? Math.min(100, Math.max(0, parseInt(o))) : 50, this.prefix = c, e && 2 === e.children.length && (this.element = e, this.revealContainer = this.element.children[1], this.revealContainer.children.length < 1 || (this.revealElement = this.revealContainer.children[0], this.range = this.addElement("input", {
              type: "range",
              class: this.prefix + "-range",
              "aria-label": "Percent of revealed content",
              "aria-valuemin": "0",
              "aria-valuemax": "100",
              "aria-valuenow": this.start,
              value: this.start,
              min: "0",
              max: "100"
            }), this.handle = this.addElement("span", {
              class: this.prefix + "-handle"
            }), this.onImagesLoad()));
          }

          return r(t, [{
            key: "init",
            value: function value() {
              this.element.classList.add(this.prefix + "-ready"), this.setImgWidth(), this.move(), this.addListeners();
            }
          }, {
            key: "loadingImg",
            value: function value(t) {
              return new Promise(function (e, n) {
                t || e();
                var r = new Image();
                r.onload = function () {
                  return e();
                }, r.onerror = function () {
                  return n();
                }, r.src = t;
              });
            }
          }, {
            key: "loadedBoth",
            value: function value() {
              var t = this.element.children[0].src || this.element.children[0].getAttribute("data-" + this.prefix + "-src"),
                  e = this.revealElement.src || this.revealElement.getAttribute("data-" + this.prefix + "-src");
              return Promise.all([this.loadingImg(t), this.loadingImg(e)]);
            }
          }, {
            key: "onImagesLoad",
            value: function value() {
              var t = this;
              this.revealElement && this.loadedBoth().then(function () {
                t.init();
              }, function () {
                console.error("Some errors occurred and images are not loaded.");
              });
            }
          }, {
            key: "addElement",
            value: function value(t, e) {
              var n = document.createElement(t);
              return Object.keys(e).forEach(function (t) {
                n.setAttribute(t, e[t]);
              }), this.element.appendChild(n), n;
            }
          }, {
            key: "setImgWidth",
            value: function value() {
              this.revealElement.style.width = getComputedStyle(this.element).width;
            }
          }, {
            key: "addListeners",
            value: function value() {
              var t = this;
              ["input", "change"].forEach(function (e) {
                t.range.addEventListener(e, function () {
                  t.move();
                });
              }), window.addEventListener("resize", function () {
                t.setImgWidth();
              });
            }
          }, {
            key: "move",
            value: function value() {
              this.revealContainer.style.width = this.range.value + "%", this.handle.style.left = this.range.value + "%", this.range.setAttribute("aria-valuenow", this.range.value);
            }
          }]), t;
        }();
      }]).default;
    });
  });
  var BeerSlider$1 = /*@__PURE__*/unwrapExports(BeerSlider);
  /**
   * Before/after image slider
   */

  (function () {
    var slider = document.querySelector('.js-before-after-slider');
    if (slider == null) return;
    var slide = new BeerSlider$1(slider, {
      start: 42
    });
  })();
  /**
   * Before/after - click to change
   */


  (function () {
    var button = document.querySelector('.js-before-after-click-button'),
        container = document.querySelector('.js-before-after-click');
    if (container == null) return;
    listen(button, 'mousedown', function (e) {
      return addClass(container, 'click-hold');
    });
    listen(button, 'touchstart', function (e) {
      return addClass(container, 'click-hold');
    });
    listen(button, 'mouseup', function (e) {
      return removeClass(container, 'click-hold');
    });
    listen(button, 'mouseleave', function (e) {
      return removeClass(container, 'click-hold');
    });
    listen(button, 'touchend', function (e) {
      return removeClass(container, 'click-hold');
    });
    listen(button, 'touchcancel', function (e) {
      return removeClass(container, 'click-hold');
    });
  })();

  var glightbox_min = createCommonjsModule(function (module, exports) {
    !function (t, e) {
      module.exports = e();
    }(commonjsGlobal, function () {
      function t(e) {
        return (t = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (t) {
          return _typeof2(t);
        } : function (t) {
          return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof2(t);
        })(e);
      }

      function e(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }

      function i(t, e) {
        for (var i = 0; i < e.length; i++) {
          var n = e[i];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
        }
      }

      function n(t, e, n) {
        return e && i(t.prototype, e), n && i(t, n), t;
      }

      function s(t) {
        return function (t) {
          if (Array.isArray(t)) return o(t);
        }(t) || function (t) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
        }(t) || function (t, e) {
          if (!t) return;
          if ("string" == typeof t) return o(t, e);
          var i = Object.prototype.toString.call(t).slice(8, -1);
          "Object" === i && t.constructor && (i = t.constructor.name);
          if ("Map" === i || "Set" === i) return Array.from(t);
          if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return o(t, e);
        }(t) || function () {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }

      function o(t, e) {
        (null == e || e > t.length) && (e = t.length);

        for (var i = 0, n = new Array(e); i < e; i++) {
          n[i] = t[i];
        }

        return n;
      }

      function l(t) {
        return Math.sqrt(t.x * t.x + t.y * t.y);
      }

      function r(t, e) {
        var i = function (t, e) {
          var i = l(t) * l(e);
          if (0 === i) return 0;

          var n = function (t, e) {
            return t.x * e.x + t.y * e.y;
          }(t, e) / i;

          return n > 1 && (n = 1), Math.acos(n);
        }(t, e);

        return function (t, e) {
          return t.x * e.y - e.x * t.y;
        }(t, e) > 0 && (i *= -1), 180 * i / Math.PI;
      }

      var a = function () {
        function t(i) {
          e(this, t), this.handlers = [], this.el = i;
        }

        return n(t, [{
          key: "add",
          value: function value(t) {
            this.handlers.push(t);
          }
        }, {
          key: "del",
          value: function value(t) {
            t || (this.handlers = []);

            for (var e = this.handlers.length; e >= 0; e--) {
              this.handlers[e] === t && this.handlers.splice(e, 1);
            }
          }
        }, {
          key: "dispatch",
          value: function value() {
            for (var t = 0, e = this.handlers.length; t < e; t++) {
              var i = this.handlers[t];
              "function" == typeof i && i.apply(this.el, arguments);
            }
          }
        }]), t;
      }();

      function h(t, e) {
        var i = new a(t);
        return i.add(e), i;
      }

      var c = function () {
        function t(i, n) {
          e(this, t), this.element = "string" == typeof i ? document.querySelector(i) : i, this.start = this.start.bind(this), this.move = this.move.bind(this), this.end = this.end.bind(this), this.cancel = this.cancel.bind(this), this.element.addEventListener("touchstart", this.start, !1), this.element.addEventListener("touchmove", this.move, !1), this.element.addEventListener("touchend", this.end, !1), this.element.addEventListener("touchcancel", this.cancel, !1), this.preV = {
            x: null,
            y: null
          }, this.pinchStartLen = null, this.zoom = 1, this.isDoubleTap = !1;

          var s = function s() {};

          this.rotate = h(this.element, n.rotate || s), this.touchStart = h(this.element, n.touchStart || s), this.multipointStart = h(this.element, n.multipointStart || s), this.multipointEnd = h(this.element, n.multipointEnd || s), this.pinch = h(this.element, n.pinch || s), this.swipe = h(this.element, n.swipe || s), this.tap = h(this.element, n.tap || s), this.doubleTap = h(this.element, n.doubleTap || s), this.longTap = h(this.element, n.longTap || s), this.singleTap = h(this.element, n.singleTap || s), this.pressMove = h(this.element, n.pressMove || s), this.twoFingerPressMove = h(this.element, n.twoFingerPressMove || s), this.touchMove = h(this.element, n.touchMove || s), this.touchEnd = h(this.element, n.touchEnd || s), this.touchCancel = h(this.element, n.touchCancel || s), this._cancelAllHandler = this.cancelAll.bind(this), window.addEventListener("scroll", this._cancelAllHandler), this.delta = null, this.last = null, this.now = null, this.tapTimeout = null, this.singleTapTimeout = null, this.longTapTimeout = null, this.swipeTimeout = null, this.x1 = this.x2 = this.y1 = this.y2 = null, this.preTapPosition = {
            x: null,
            y: null
          };
        }

        return n(t, [{
          key: "start",
          value: function value(t) {
            if (t.touches) {
              this.now = Date.now(), this.x1 = t.touches[0].pageX, this.y1 = t.touches[0].pageY, this.delta = this.now - (this.last || this.now), this.touchStart.dispatch(t, this.element), null !== this.preTapPosition.x && (this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30, this.isDoubleTap && clearTimeout(this.singleTapTimeout)), this.preTapPosition.x = this.x1, this.preTapPosition.y = this.y1, this.last = this.now;
              var e = this.preV;

              if (t.touches.length > 1) {
                this._cancelLongTap(), this._cancelSingleTap();
                var i = {
                  x: t.touches[1].pageX - this.x1,
                  y: t.touches[1].pageY - this.y1
                };
                e.x = i.x, e.y = i.y, this.pinchStartLen = l(e), this.multipointStart.dispatch(t, this.element);
              }

              this._preventTap = !1, this.longTapTimeout = setTimeout(function () {
                this.longTap.dispatch(t, this.element), this._preventTap = !0;
              }.bind(this), 750);
            }
          }
        }, {
          key: "move",
          value: function value(t) {
            if (t.touches) {
              var e = this.preV,
                  i = t.touches.length,
                  n = t.touches[0].pageX,
                  s = t.touches[0].pageY;

              if (this.isDoubleTap = !1, i > 1) {
                var o = t.touches[1].pageX,
                    a = t.touches[1].pageY,
                    h = {
                  x: t.touches[1].pageX - n,
                  y: t.touches[1].pageY - s
                };
                null !== e.x && (this.pinchStartLen > 0 && (t.zoom = l(h) / this.pinchStartLen, this.pinch.dispatch(t, this.element)), t.angle = r(h, e), this.rotate.dispatch(t, this.element)), e.x = h.x, e.y = h.y, null !== this.x2 && null !== this.sx2 ? (t.deltaX = (n - this.x2 + o - this.sx2) / 2, t.deltaY = (s - this.y2 + a - this.sy2) / 2) : (t.deltaX = 0, t.deltaY = 0), this.twoFingerPressMove.dispatch(t, this.element), this.sx2 = o, this.sy2 = a;
              } else {
                if (null !== this.x2) {
                  t.deltaX = n - this.x2, t.deltaY = s - this.y2;
                  var c = Math.abs(this.x1 - this.x2),
                      d = Math.abs(this.y1 - this.y2);
                  (c > 10 || d > 10) && (this._preventTap = !0);
                } else t.deltaX = 0, t.deltaY = 0;

                this.pressMove.dispatch(t, this.element);
              }

              this.touchMove.dispatch(t, this.element), this._cancelLongTap(), this.x2 = n, this.y2 = s, i > 1 && t.preventDefault();
            }
          }
        }, {
          key: "end",
          value: function value(t) {
            if (t.changedTouches) {
              this._cancelLongTap();

              var e = this;
              t.touches.length < 2 && (this.multipointEnd.dispatch(t, this.element), this.sx2 = this.sy2 = null), this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30 ? (t.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2), this.swipeTimeout = setTimeout(function () {
                e.swipe.dispatch(t, e.element);
              }, 0)) : (this.tapTimeout = setTimeout(function () {
                e._preventTap || e.tap.dispatch(t, e.element), e.isDoubleTap && (e.doubleTap.dispatch(t, e.element), e.isDoubleTap = !1);
              }, 0), e.isDoubleTap || (e.singleTapTimeout = setTimeout(function () {
                e.singleTap.dispatch(t, e.element);
              }, 250))), this.touchEnd.dispatch(t, this.element), this.preV.x = 0, this.preV.y = 0, this.zoom = 1, this.pinchStartLen = null, this.x1 = this.x2 = this.y1 = this.y2 = null;
            }
          }
        }, {
          key: "cancelAll",
          value: function value() {
            this._preventTap = !0, clearTimeout(this.singleTapTimeout), clearTimeout(this.tapTimeout), clearTimeout(this.longTapTimeout), clearTimeout(this.swipeTimeout);
          }
        }, {
          key: "cancel",
          value: function value(t) {
            this.cancelAll(), this.touchCancel.dispatch(t, this.element);
          }
        }, {
          key: "_cancelLongTap",
          value: function value() {
            clearTimeout(this.longTapTimeout);
          }
        }, {
          key: "_cancelSingleTap",
          value: function value() {
            clearTimeout(this.singleTapTimeout);
          }
        }, {
          key: "_swipeDirection",
          value: function value(t, e, i, n) {
            return Math.abs(t - e) >= Math.abs(i - n) ? t - e > 0 ? "Left" : "Right" : i - n > 0 ? "Up" : "Down";
          }
        }, {
          key: "on",
          value: function value(t, e) {
            this[t] && this[t].add(e);
          }
        }, {
          key: "off",
          value: function value(t, e) {
            this[t] && this[t].del(e);
          }
        }, {
          key: "destroy",
          value: function value() {
            return this.singleTapTimeout && clearTimeout(this.singleTapTimeout), this.tapTimeout && clearTimeout(this.tapTimeout), this.longTapTimeout && clearTimeout(this.longTapTimeout), this.swipeTimeout && clearTimeout(this.swipeTimeout), this.element.removeEventListener("touchstart", this.start), this.element.removeEventListener("touchmove", this.move), this.element.removeEventListener("touchend", this.end), this.element.removeEventListener("touchcancel", this.cancel), this.rotate.del(), this.touchStart.del(), this.multipointStart.del(), this.multipointEnd.del(), this.pinch.del(), this.swipe.del(), this.tap.del(), this.doubleTap.del(), this.longTap.del(), this.singleTap.del(), this.pressMove.del(), this.twoFingerPressMove.del(), this.touchMove.del(), this.touchEnd.del(), this.touchCancel.del(), this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null, window.removeEventListener("scroll", this._cancelAllHandler), null;
          }
        }]), t;
      }(),
          d = function () {
        function t(i, n) {
          var s = this,
              o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
          if (e(this, t), this.img = i, this.slide = n, this.onclose = o, this.img.setZoomEvents) return !1;
          this.active = !1, this.zoomedIn = !1, this.dragging = !1, this.currentX = null, this.currentY = null, this.initialX = null, this.initialY = null, this.xOffset = 0, this.yOffset = 0, this.img.addEventListener("mousedown", function (t) {
            return s.dragStart(t);
          }, !1), this.img.addEventListener("mouseup", function (t) {
            return s.dragEnd(t);
          }, !1), this.img.addEventListener("mousemove", function (t) {
            return s.drag(t);
          }, !1), this.img.addEventListener("click", function (t) {
            if (!s.zoomedIn) return s.zoomIn();
            s.zoomedIn && !s.dragging && s.zoomOut();
          }, !1), this.img.setZoomEvents = !0;
        }

        return n(t, [{
          key: "zoomIn",
          value: function value() {
            var t = this.widowWidth();

            if (!(this.zoomedIn || t <= 768)) {
              var e = this.img;

              if (e.setAttribute("data-style", e.getAttribute("style")), e.style.maxWidth = e.naturalWidth + "px", e.style.maxHeight = e.naturalHeight + "px", e.naturalWidth > t) {
                var i = t / 2 - e.naturalWidth / 2;
                this.setTranslate(this.img.parentNode, i, 0);
              }

              this.slide.classList.add("zoomed"), this.zoomedIn = !0;
            }
          }
        }, {
          key: "zoomOut",
          value: function value() {
            this.img.parentNode.setAttribute("style", ""), this.img.setAttribute("style", this.img.getAttribute("data-style")), this.slide.classList.remove("zoomed"), this.zoomedIn = !1, this.currentX = null, this.currentY = null, this.initialX = null, this.initialY = null, this.xOffset = 0, this.yOffset = 0, this.onclose && "function" == typeof this.onclose && this.onclose();
          }
        }, {
          key: "dragStart",
          value: function value(t) {
            t.preventDefault(), this.zoomedIn ? ("touchstart" === t.type ? (this.initialX = t.touches[0].clientX - this.xOffset, this.initialY = t.touches[0].clientY - this.yOffset) : (this.initialX = t.clientX - this.xOffset, this.initialY = t.clientY - this.yOffset), t.target === this.img && (this.active = !0, this.img.classList.add("dragging"))) : this.active = !1;
          }
        }, {
          key: "dragEnd",
          value: function value(t) {
            var e = this;
            t.preventDefault(), this.initialX = this.currentX, this.initialY = this.currentY, this.active = !1, setTimeout(function () {
              e.dragging = !1, e.img.isDragging = !1, e.img.classList.remove("dragging");
            }, 100);
          }
        }, {
          key: "drag",
          value: function value(t) {
            this.active && (t.preventDefault(), "touchmove" === t.type ? (this.currentX = t.touches[0].clientX - this.initialX, this.currentY = t.touches[0].clientY - this.initialY) : (this.currentX = t.clientX - this.initialX, this.currentY = t.clientY - this.initialY), this.xOffset = this.currentX, this.yOffset = this.currentY, this.img.isDragging = !0, this.dragging = !0, this.setTranslate(this.img, this.currentX, this.currentY));
          }
        }, {
          key: "onMove",
          value: function value(t) {
            if (this.zoomedIn) {
              var e = t.clientX - this.img.naturalWidth / 2,
                  i = t.clientY - this.img.naturalHeight / 2;
              this.setTranslate(this.img, e, i);
            }
          }
        }, {
          key: "setTranslate",
          value: function value(t, e, i) {
            t.style.transform = "translate3d(" + e + "px, " + i + "px, 0)";
          }
        }, {
          key: "widowWidth",
          value: function value() {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          }
        }]), t;
      }(),
          u = "navigator" in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i),
          g = null !== u || void 0 !== document.createTouch || "ontouchstart" in window || "onmsgesturechange" in window || navigator.msMaxTouchPoints,
          p = document.getElementsByTagName("html")[0],
          v = function () {
        var t,
            e = document.createElement("fakeelement"),
            i = {
          transition: "transitionend",
          OTransition: "oTransitionEnd",
          MozTransition: "transitionend",
          WebkitTransition: "webkitTransitionEnd"
        };

        for (t in i) {
          if (void 0 !== e.style[t]) return i[t];
        }
      }(),
          f = function () {
        var t,
            e = document.createElement("fakeelement"),
            i = {
          animation: "animationend",
          OAnimation: "oAnimationEnd",
          MozAnimation: "animationend",
          WebkitAnimation: "webkitAnimationEnd"
        };

        for (t in i) {
          if (void 0 !== e.style[t]) return i[t];
        }
      }(),
          m = Date.now(),
          y = {},
          b = {
        selector: ".glightbox",
        elements: null,
        skin: "clean",
        closeButton: !0,
        startAt: null,
        autoplayVideos: !0,
        descPosition: "bottom",
        width: "900px",
        height: "506px",
        videosWidth: "960px",
        beforeSlideChange: null,
        afterSlideChange: null,
        beforeSlideLoad: null,
        afterSlideLoad: null,
        slideInserted: null,
        slideRemoved: null,
        onOpen: null,
        onClose: null,
        loop: !1,
        touchNavigation: !0,
        touchFollowAxis: !0,
        keyboardNavigation: !0,
        closeOnOutsideClick: !0,
        plyr: {
          css: "https://cdn.plyr.io/3.5.6/plyr.css",
          js: "https://cdn.plyr.io/3.5.6/plyr.js",
          config: {
            ratio: "16:9",
            youtube: {
              noCookie: !0,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3
            },
            vimeo: {
              byline: !1,
              portrait: !1,
              title: !1,
              transparent: !1
            }
          }
        },
        openEffect: "zoomIn",
        closeEffect: "zoomOut",
        slideEffect: "slide",
        moreText: "See more",
        moreLength: 60,
        lightboxHtml: "",
        cssEfects: {
          fade: {
            in: "fadeIn",
            out: "fadeOut"
          },
          zoom: {
            in: "zoomIn",
            out: "zoomOut"
          },
          slide: {
            in: "slideInRight",
            out: "slideOutLeft"
          },
          slide_back: {
            in: "slideInLeft",
            out: "slideOutRight"
          }
        },
        svg: {
          close: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
          next: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
          prev: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
        }
      };

      b.slideHtml = '<div class="gslide">\n    <div class="gslide-inner-content">\n        <div class="ginner-container">\n            <div class="gslide-media">\n            </div>\n            <div class="gslide-description">\n                <div class="gdesc-inner">\n                    <h4 class="gslide-title"></h4>\n                    <div class="gslide-desc"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>';
      b.lightboxHtml = '<div id="glightbox-body" class="glightbox-container">\n    <div class="gloader visible"></div>\n    <div class="goverlay"></div>\n    <div class="gcontainer">\n    <div id="glightbox-slider" class="gslider"></div>\n    <button class="gnext gbtn" tabindex="0" aria-label="Next">{nextSVG}</button>\n    <button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>\n    <button class="gclose gbtn" tabindex="2" aria-label="Close">{closeSVG}</button>\n</div>\n</div>';
      var x = {
        href: "",
        title: "",
        type: "",
        description: "",
        descPosition: "",
        effect: "",
        width: "",
        height: "",
        node: !1,
        content: !1
      };

      function w() {
        var t = {},
            e = !0,
            i = 0,
            n = arguments.length;
        "[object Boolean]" === Object.prototype.toString.call(arguments[0]) && (e = arguments[0], i++);

        for (var s = function s(i) {
          for (var n in i) {
            Object.prototype.hasOwnProperty.call(i, n) && (e && "[object Object]" === Object.prototype.toString.call(i[n]) ? t[n] = w(!0, t[n], i[n]) : t[n] = i[n]);
          }
        }; i < n; i++) {
          var o = arguments[i];
          s(o);
        }

        return t;
      }

      var S = {
        isFunction: function isFunction(t) {
          return "function" == typeof t;
        },
        isString: function isString(t) {
          return "string" == typeof t;
        },
        isNode: function isNode(t) {
          return !(!t || !t.nodeType || 1 != t.nodeType);
        },
        isArray: function isArray(t) {
          return Array.isArray(t);
        },
        isArrayLike: function isArrayLike(t) {
          return t && t.length && isFinite(t.length);
        },
        isObject: function isObject(e) {
          return "object" === t(e) && null != e && !S.isFunction(e) && !S.isArray(e);
        },
        isNil: function isNil(t) {
          return null == t;
        },
        has: function has(t, e) {
          return null !== t && hasOwnProperty.call(t, e);
        },
        size: function size(t) {
          if (S.isObject(t)) {
            if (t.keys) return t.keys().length;
            var e = 0;

            for (var i in t) {
              S.has(t, i) && e++;
            }

            return e;
          }

          return t.length;
        },
        isNumber: function isNumber(t) {
          return !isNaN(parseFloat(t)) && isFinite(t);
        }
      };

      function T(t, e) {
        if ((S.isNode(t) || t === window || t === document) && (t = [t]), S.isArrayLike(t) || S.isObject(t) || (t = [t]), 0 != S.size(t)) if (S.isArrayLike(t) && !S.isObject(t)) for (var i = t.length, n = 0; n < i && !1 !== e.call(t[n], t[n], n, t); n++) {
          ;
        } else if (S.isObject(t)) for (var s in t) {
          if (S.has(t, s) && !1 === e.call(t[s], t[s], s, t)) break;
        }
      }

      function k(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
            i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
            n = t[m] = t[m] || [],
            s = {
          all: n,
          evt: null,
          found: null
        };
        return e && i && S.size(n) > 0 && T(n, function (t, n) {
          if (t.eventName == e && t.fn.toString() == i.toString()) return s.found = !0, s.evt = n, !1;
        }), s;
      }

      function E(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            i = e.onElement,
            n = e.withCallback,
            s = e.avoidDuplicate,
            o = void 0 === s || s,
            l = e.once,
            r = void 0 !== l && l,
            a = e.useCapture,
            h = void 0 !== a && a,
            c = arguments.length > 2 ? arguments[2] : void 0,
            d = i || [];

        function u(t) {
          S.isFunction(n) && n.call(c, t, this), r && u.destroy();
        }

        return S.isString(d) && (d = document.querySelectorAll(d)), u.destroy = function () {
          T(d, function (e) {
            var i = k(e, t, u);
            i.found && i.all.splice(i.evt, 1), e.removeEventListener && e.removeEventListener(t, u, h);
          });
        }, T(d, function (e) {
          var i = k(e, t, u);
          (e.addEventListener && o && !i.found || !o) && (e.addEventListener(t, u, h), i.all.push({
            eventName: t,
            fn: u
          }));
        }), u;
      }

      function A(t, e) {
        T(e.split(" "), function (e) {
          return t.classList.add(e);
        });
      }

      function C(t, e) {
        T(e.split(" "), function (e) {
          return t.classList.remove(e);
        });
      }

      function L(t, e) {
        return t.classList.contains(e);
      }

      function I(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (!t || "" === e) return !1;
        if ("none" == e) return S.isFunction(i) && i(), !1;
        var n = e.split(" ");
        T(n, function (e) {
          A(t, "g" + e);
        }), E(f, {
          onElement: t,
          avoidDuplicate: !1,
          once: !0,
          withCallback: function withCallback(t, e) {
            T(n, function (t) {
              C(e, "g" + t);
            }), S.isFunction(i) && i();
          }
        });
      }

      function N(t) {
        var e = document.createDocumentFragment(),
            i = document.createElement("div");

        for (i.innerHTML = t; i.firstChild;) {
          e.appendChild(i.firstChild);
        }

        return e;
      }

      function O(t, e) {
        for (; t !== document.body;) {
          if ("function" == typeof (t = t.parentElement).matches ? t.matches(e) : t.msMatchesSelector(e)) return t;
        }
      }

      function M(t) {
        t.style.display = "block";
      }

      function q(t) {
        t.style.display = "none";
      }

      function z() {
        return {
          width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
          height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        };
      }

      function P(t) {
        if (L(t.target, "plyr--html5")) {
          var e = O(t.target, ".gslide-media");
          "enterfullscreen" == t.type && A(e, "fullscreen"), "exitfullscreen" == t.type && C(e, "fullscreen");
        }
      }

      function D(t) {
        return S.isNumber(t) ? "".concat(t, "px") : t;
      }

      function X(t, e) {
        var i = "video" == t.type ? D(e.videosWidth) : D(e.width),
            n = D(e.height);
        return t.width = S.has(t, "width") && "" !== t.width ? D(t.width) : i, t.height = S.has(t, "height") && "" !== t.height ? D(t.height) : n, t;
      }

      var B = function B() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
            e = arguments.length > 1 ? arguments[1] : void 0,
            i = w({
          descPosition: e.descPosition
        }, x);

        if (S.isObject(t) && !S.isNode(t)) {
          S.has(t, "type") || (S.has(t, "content") && t.content ? t.type = "inline" : S.has(t, "href") && (t.type = V(t.href)));
          var n = w(i, t);
          return X(n, e), n;
        }

        var s = "",
            o = t.getAttribute("data-glightbox"),
            l = t.nodeName.toLowerCase();

        if ("a" === l && (s = t.href), "img" === l && (s = t.src), i.href = s, T(i, function (n, s) {
          S.has(e, s) && "width" !== s && (i[s] = e[s]);
          var o = t.dataset[s];
          S.isNil(o) || (i[s] = o);
        }), i.content && (i.type = "inline"), !i.type && s && (i.type = V(s)), S.isNil(o)) {
          if ("a" == l) {
            var r = t.title;
            S.isNil(r) || "" === r || (i.title = r);
          }

          if ("img" == l) {
            var a = t.alt;
            S.isNil(a) || "" === a || (i.title = a);
          }

          var h = t.getAttribute("data-description");
          S.isNil(h) || "" === h || (i.description = h);
        } else {
          var c = [];
          T(i, function (t, e) {
            c.push(";\\s?" + e);
          }), c = c.join("\\s?:|"), "" !== o.trim() && T(i, function (t, e) {
            var n = o,
                s = new RegExp("s?" + e + "s?:s?(.*?)(" + c + "s?:|$)"),
                l = n.match(s);

            if (l && l.length && l[1]) {
              var r = l[1].trim().replace(/;\s*$/, "");
              i[e] = r;
            }
          });
        }

        if (i.description && "." == i.description.substring(0, 1) && document.querySelector(i.description)) i.description = document.querySelector(i.description).innerHTML;else {
          var d = t.querySelector(".glightbox-desc");
          d && (i.description = d.innerHTML);
        }
        return X(i, e), i;
      },
          F = function F() {
        var t = this,
            e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
            i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (L(e, "loaded")) return !1;
        S.isFunction(this.settings.beforeSlideLoad) && this.settings.beforeSlideLoad({
          index: i.index,
          slide: e,
          player: !1
        });
        var s = i.type,
            o = i.descPosition,
            l = e.querySelector(".gslide-media"),
            r = e.querySelector(".gslide-title"),
            a = e.querySelector(".gslide-desc"),
            h = e.querySelector(".gdesc-inner"),
            c = n,
            g = "gSlideTitle_" + i.index,
            p = "gSlideDesc_" + i.index;
        if (S.isFunction(this.settings.afterSlideLoad) && (c = function c() {
          S.isFunction(n) && n(), t.settings.afterSlideLoad({
            index: i.index,
            slide: e,
            player: t.getSlidePlayerInstance(i.index)
          });
        }), "" == i.title && "" == i.description ? h && h.parentNode.parentNode.removeChild(h.parentNode) : (r && "" !== i.title ? (r.id = g, r.innerHTML = i.title) : r.parentNode.removeChild(r), a && "" !== i.description ? (a.id = p, u && this.settings.moreLength > 0 ? (i.smallDescription = U(i.description, this.settings.moreLength, this.settings.moreText), a.innerHTML = i.smallDescription, J.apply(this, [a, i])) : a.innerHTML = i.description) : a.parentNode.removeChild(a), A(l.parentNode, "desc-".concat(o)), A(h.parentNode, "description-".concat(o))), A(l, "gslide-".concat(s)), A(e, "loaded"), "video" === s) return A(l.parentNode, "gvideo-container"), l.insertBefore(N('<div class="gvideo-wrapper"></div>'), l.firstChild), void Y.apply(this, [e, i, c]);

        if ("external" === s) {
          var v = _({
            url: i.href,
            callback: c
          });

          return l.parentNode.style.maxWidth = i.width, l.parentNode.style.height = i.height, void l.appendChild(v);
        }

        if ("inline" !== s) {
          if ("image" === s) {
            var f = new Image();
            return f.addEventListener("load", function () {
              f.naturalWidth > f.offsetWidth && (A(f, "zoomable"), new d(f, e, function () {
                t.resize(e);
              })), S.isFunction(c) && c();
            }, !1), f.src = i.href, f.alt = "", "" !== i.title && f.setAttribute("aria-labelledby", g), "" !== i.description && f.setAttribute("aria-describedby", p), void l.insertBefore(f, l.firstChild);
          }

          S.isFunction(c) && c();
        } else W.apply(this, [e, i, c]);
      };

      function Y(t, e, i) {
        var n = this,
            s = "gvideo" + e.index,
            o = t.querySelector(".gvideo-wrapper");
        j(this.settings.plyr.css);
        var l = e.href,
            r = location.protocol.replace(":", ""),
            a = "",
            h = "",
            c = !1;
        "file" == r && (r = "http"), o.parentNode.style.maxWidth = e.width, j(this.settings.plyr.js, "Plyr", function () {
          if (l.match(/vimeo\.com\/([0-9]*)/)) {
            var t = /vimeo.*\/(\d+)/i.exec(l);
            a = "vimeo", h = t[1];
          }

          if (l.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || l.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || l.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
            var r = function (t) {
              var e = "";
              e = void 0 !== (t = t.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/))[2] ? (e = t[2].split(/[^0-9a-z_\-]/i))[0] : t;
              return e;
            }(l);

            a = "youtube", h = r;
          }

          if (null !== l.match(/\.(mp4|ogg|webm|mov)$/)) {
            a = "local";
            var d = '<video id="' + s + '" ';
            d += 'style="background:#000; max-width: '.concat(e.width, ';" '), d += 'preload="metadata" ', d += 'x-webkit-airplay="allow" ', d += 'webkit-playsinline="" ', d += "controls ", d += 'class="gvideo-local">';
            var u = l.toLowerCase().split(".").pop(),
                g = {
              mp4: "",
              ogg: "",
              webm: ""
            };

            for (var p in g[u = "mov" == u ? "mp4" : u] = l, g) {
              if (g.hasOwnProperty(p)) {
                var v = g[p];
                e.hasOwnProperty(p) && (v = e[p]), "" !== v && (d += '<source src="'.concat(v, '" type="video/').concat(p, '">'));
              }
            }

            c = N(d += "</video>");
          }

          var f = c || N('<div id="'.concat(s, '" data-plyr-provider="').concat(a, '" data-plyr-embed-id="').concat(h, '"></div>'));
          A(o, "".concat(a, "-video gvideo")), o.appendChild(f), o.setAttribute("data-id", s), o.setAttribute("data-index", e.index);
          var m = S.has(n.settings.plyr, "config") ? n.settings.plyr.config : {},
              b = new Plyr("#" + s, m);
          b.on("ready", function (t) {
            var e = t.detail.plyr;
            y[s] = e, S.isFunction(i) && i();
          }), b.on("enterfullscreen", P), b.on("exitfullscreen", P);
        });
      }

      function _(t) {
        var e = t.url,
            i = t.allow,
            n = t.callback,
            s = t.appendTo,
            o = document.createElement("iframe");
        return o.className = "vimeo-video gvideo", o.src = e, o.style.width = "100%", o.style.height = "100%", i && o.setAttribute("allow", i), o.onload = function () {
          A(o, "node-ready"), S.isFunction(n) && n();
        }, s && s.appendChild(o), o;
      }

      function j(t, e, i) {
        if (S.isNil(t)) console.error("Inject videos api error");else {
          var n;

          if (S.isFunction(e) && (i = e, e = !1), -1 !== t.indexOf(".css")) {
            if ((n = document.querySelectorAll('link[href="' + t + '"]')) && n.length > 0) return void (S.isFunction(i) && i());
            var s = document.getElementsByTagName("head")[0],
                o = s.querySelectorAll('link[rel="stylesheet"]'),
                l = document.createElement("link");
            return l.rel = "stylesheet", l.type = "text/css", l.href = t, l.media = "all", o ? s.insertBefore(l, o[0]) : s.appendChild(l), void (S.isFunction(i) && i());
          }

          if ((n = document.querySelectorAll('script[src="' + t + '"]')) && n.length > 0) {
            if (S.isFunction(i)) {
              if (S.isString(e)) return H(function () {
                return void 0 !== window[e];
              }, function () {
                i();
              }), !1;
              i();
            }
          } else {
            var r = document.createElement("script");
            r.type = "text/javascript", r.src = t, r.onload = function () {
              if (S.isFunction(i)) {
                if (S.isString(e)) return H(function () {
                  return void 0 !== window[e];
                }, function () {
                  i();
                }), !1;
                i();
              }
            }, document.body.appendChild(r);
          }
        }
      }

      function H(t, e, i, n) {
        if (t()) e();else {
          var s;
          i || (i = 100);
          var o = setInterval(function () {
            t() && (clearInterval(o), s && clearTimeout(s), e());
          }, i);
          n && (s = setTimeout(function () {
            clearInterval(o);
          }, n));
        }
      }

      function W(t, e, i) {
        var n,
            s = this,
            o = t.querySelector(".gslide-media"),
            l = !(!S.has(e, "href") || !e.href) && e.href.split("#").pop().trim(),
            r = !(!S.has(e, "content") || !e.content) && e.content;

        if (r && (S.isString(r) && (n = N('<div class="ginlined-content">'.concat(r, "</div>"))), S.isNode(r))) {
          "none" == r.style.display && (r.style.display = "block");
          var a = document.createElement("div");
          a.className = "ginlined-content", a.appendChild(r), n = a;
        }

        if (l) {
          var h = document.getElementById(l);
          if (!h) return !1;
          var c = h.cloneNode(!0);
          c.style.height = e.height, c.style.maxWidth = e.width, A(c, "ginlined-content"), n = c;
        }

        if (!n) return console.error("Unable to append inline slide content", e), !1;
        o.style.height = e.height, o.style.width = e.width, o.appendChild(n), this.events["inlineclose" + l] = E("click", {
          onElement: o.querySelectorAll(".gtrigger-close"),
          withCallback: function withCallback(t) {
            t.preventDefault(), s.close();
          }
        }), S.isFunction(i) && i();
      }

      var V = function V(t) {
        var e = t;
        if (null !== (t = t.toLowerCase()).match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|svg)$/)) return "image";
        if (t.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || t.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || t.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) return "video";
        if (t.match(/vimeo\.com\/([0-9]*)/)) return "video";
        if (null !== t.match(/\.(mp4|ogg|webm|mov)$/)) return "video";
        if (t.indexOf("#") > -1 && "" !== e.split("#").pop().trim()) return "inline";
        return t.includes("gajax=true") ? "ajax" : "external";
      };

      function G() {
        var t = this;
        if (this.events.hasOwnProperty("keyboard")) return !1;
        this.events.keyboard = E("keydown", {
          onElement: window,
          withCallback: function withCallback(e, i) {
            var n = (e = e || window.event).keyCode;

            if (9 == n) {
              var o = !(!document.activeElement || !document.activeElement.nodeName) && document.activeElement.nodeName.toLocaleLowerCase();
              if ("input" == o || "textarea" == o || "button" == o) return;
              e.preventDefault();
              var l = document.querySelectorAll(".gbtn");
              if (!l || l.length <= 0) return;
              var r = s(l).filter(function (t) {
                return L(t, "focused");
              });

              if (!r.length) {
                var a = document.querySelector('.gbtn[tabindex="0"]');
                return void (a && (a.focus(), A(a, "focused")));
              }

              l.forEach(function (t) {
                return C(t, "focused");
              });
              var h = r[0].getAttribute("tabindex");
              h = h || "0";
              var c = parseInt(h) + 1;
              c > l.length - 1 && (c = "0");
              var d = document.querySelector('.gbtn[tabindex="'.concat(c, '"]'));
              d && (d.focus(), A(d, "focused"));
            }

            39 == n && t.nextSlide(), 37 == n && t.prevSlide(), 27 == n && t.close();
          }
        });
      }

      function R() {
        var t = this;
        if (this.events.hasOwnProperty("touch")) return !1;
        var e,
            i,
            n,
            s = z(),
            o = s.width,
            l = s.height,
            r = !1,
            a = null,
            h = null,
            d = null,
            u = !1,
            g = 1,
            p = 1,
            v = !1,
            f = !1,
            m = null,
            y = null,
            b = null,
            x = null,
            w = 0,
            S = 0,
            T = !1,
            k = !1,
            E = {},
            I = {},
            N = 0,
            M = 0,
            q = this,
            P = document.getElementById("glightbox-slider"),
            D = document.querySelector(".goverlay"),
            X = (this.loop(), new c(P, {
          touchStart: function touchStart(t) {
            if (L(t.targetTouches[0].target, "ginner-container") || O(t.targetTouches[0].target, ".gslide-desc")) return r = !1, !1;
            r = !0, I = t.targetTouches[0], E.pageX = t.targetTouches[0].pageX, E.pageY = t.targetTouches[0].pageY, N = t.targetTouches[0].clientX, M = t.targetTouches[0].clientY, a = q.activeSlide, h = a.querySelector(".gslide-media"), n = a.querySelector(".gslide-inline"), d = null, L(h, "gslide-image") && (d = h.querySelector("img")), C(D, "greset");
          },
          touchMove: function touchMove(s) {
            if (r && (I = s.targetTouches[0], !v && !f)) {
              if (n && n.offsetHeight > l) {
                var a = E.pageX - I.pageX;
                if (Math.abs(a) <= 13) return !1;
              }

              u = !0;
              var c,
                  g = s.targetTouches[0].clientX,
                  p = s.targetTouches[0].clientY,
                  m = N - g,
                  y = M - p;
              if (Math.abs(m) > Math.abs(y) ? (T = !1, k = !0) : (k = !1, T = !0), e = I.pageX - E.pageX, w = 100 * e / o, i = I.pageY - E.pageY, S = 100 * i / l, T && d && (c = 1 - Math.abs(i) / l, D.style.opacity = c, t.settings.touchFollowAxis && (w = 0)), k && (c = 1 - Math.abs(e) / o, h.style.opacity = c, t.settings.touchFollowAxis && (S = 0)), !d) return Z(h, "translate3d(".concat(w, "%, 0, 0)"));
              Z(h, "translate3d(".concat(w, "%, ").concat(S, "%, 0)"));
            }
          },
          touchEnd: function touchEnd() {
            if (r) {
              if (u = !1, f || v) return b = m, void (x = y);
              var e = Math.abs(parseInt(S)),
                  i = Math.abs(parseInt(w));
              if (!(e > 29 && d)) return e < 29 && i < 25 ? (A(D, "greset"), D.style.opacity = 1, $(h)) : void 0;
              t.close();
            }
          },
          multipointEnd: function multipointEnd() {
            setTimeout(function () {
              v = !1;
            }, 50);
          },
          multipointStart: function multipointStart() {
            v = !0, g = p || 1;
          },
          pinch: function pinch(t) {
            if (!d || u) return !1;
            v = !0, d.scaleX = d.scaleY = g * t.zoom;
            var e = g * t.zoom;
            if (f = !0, e <= 1) return f = !1, e = 1, x = null, b = null, m = null, y = null, void d.setAttribute("style", "");
            e > 4.5 && (e = 4.5), d.style.transform = "scale3d(".concat(e, ", ").concat(e, ", 1)"), p = e;
          },
          pressMove: function pressMove(t) {
            if (f && !v) {
              var e = I.pageX - E.pageX,
                  i = I.pageY - E.pageY;
              b && (e += b), x && (i += x), m = e, y = i;
              var n = "translate3d(".concat(e, "px, ").concat(i, "px, 0)");
              p && (n += " scale3d(".concat(p, ", ").concat(p, ", 1)")), Z(d, n);
            }
          },
          swipe: function swipe(e) {
            if (!f) if (v) v = !1;else {
              if ("Left" == e.direction) {
                if (t.index == t.elements.length - 1) return $(h);
                t.nextSlide();
              }

              if ("Right" == e.direction) {
                if (0 == t.index) return $(h);
                t.prevSlide();
              }
            }
          }
        }));
        this.events.touch = X;
      }

      function Z(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
        if ("" == e) return t.style.webkitTransform = "", t.style.MozTransform = "", t.style.msTransform = "", t.style.OTransform = "", t.style.transform = "", !1;
        t.style.webkitTransform = e, t.style.MozTransform = e, t.style.msTransform = e, t.style.OTransform = e, t.style.transform = e;
      }

      function $(t) {
        var e = L(t, "gslide-media") ? t : t.querySelector(".gslide-media"),
            i = t.querySelector(".gslide-description");
        A(e, "greset"), Z(e, "translate3d(0, 0, 0)");
        E(v, {
          onElement: e,
          once: !0,
          withCallback: function withCallback(t, i) {
            C(e, "greset");
          }
        });
        e.style.opacity = "", i && (i.style.opacity = "");
      }

      function U(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50,
            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            n = i;
        if ((t = t.trim()).length <= e) return t;
        var s = t.substr(0, e - 1);
        return n ? s + '... <a href="#" class="desc-more">' + i + "</a>" : s;
      }

      function J(t, e) {
        var i = t.querySelector(".desc-more");
        if (!i) return !1;
        E("click", {
          onElement: i,
          withCallback: function withCallback(t, i) {
            t.preventDefault();
            var n = document.body,
                s = O(i, ".gslide-desc");
            if (!s) return !1;
            s.innerHTML = e.description, A(n, "gdesc-open");
            var o = E("click", {
              onElement: [n, O(s, ".gslide-description")],
              withCallback: function withCallback(t, i) {
                "a" !== t.target.nodeName.toLowerCase() && (C(n, "gdesc-open"), A(n, "gdesc-closed"), s.innerHTML = e.smallDescription, J(s, e), setTimeout(function () {
                  C(n, "gdesc-closed");
                }, 400), o.destroy());
              }
            });
          }
        });
      }

      var K = function () {
        function t() {
          var i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          e(this, t), this.settings = w(b, i), this.effectsClasses = this.getAnimationClasses(), this.slidesData = {};
        }

        return n(t, [{
          key: "init",
          value: function value() {
            var t = this,
                e = this.getSelector();
            e && (this.baseEvents = E("click", {
              onElement: e,
              withCallback: function withCallback(e, i) {
                e.preventDefault(), t.open(i);
              }
            })), this.elements = this.getElements();
          }
        }, {
          key: "open",
          value: function value() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
            if (0 == this.elements.length) return !1;
            this.activeSlide = null, this.prevActiveSlideIndex = null, this.prevActiveSlide = null;
            var i = S.isNumber(e) ? e : this.settings.startAt;
            S.isNode(t) && S.isNil(i) && (i = this.getElementIndex(t)) < 0 && (i = 0), S.isNumber(i) || (i = 0), this.build(), I(this.overlay, "none" == this.settings.openEffect ? "none" : this.settings.cssEfects.fade.in);
            var n = document.body,
                s = window.innerWidth - document.documentElement.clientWidth;

            if (s > 0) {
              var o = document.createElement("style");
              o.type = "text/css", o.className = "gcss-styles", o.innerText = ".gscrollbar-fixer {margin-right: ".concat(s, "px}"), document.head.appendChild(o), A(n, "gscrollbar-fixer");
            }

            if (A(n, "glightbox-open"), A(p, "glightbox-open"), u && (A(document.body, "glightbox-mobile"), this.settings.slideEffect = "slide"), this.showSlide(i, !0), 1 == this.elements.length ? (q(this.prevButton), q(this.nextButton)) : (M(this.prevButton), M(this.nextButton)), this.lightboxOpen = !0, S.isFunction(this.settings.onOpen) && this.settings.onOpen(), g && this.settings.touchNavigation) return R.apply(this), !1;
            this.settings.keyboardNavigation && G.apply(this);
          }
        }, {
          key: "openAt",
          value: function value() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            this.open(null, t);
          }
        }, {
          key: "showSlide",
          value: function value() {
            var t = this,
                e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            M(this.loader), this.index = parseInt(e);
            var n = this.slidesContainer.querySelector(".current");
            n && C(n, "current"), this.slideAnimateOut();
            var s = this.slidesContainer.querySelectorAll(".gslide")[e];
            if (L(s, "loaded")) this.slideAnimateIn(s, i), q(this.loader);else {
              M(this.loader);
              var o = this.elements[e];
              o.index = e, this.slidesData[e] = o, F.apply(this, [s, o, function () {
                q(t.loader), t.resize(), t.slideAnimateIn(s, i);
              }]);
            }
            this.slideDescription = s.querySelector(".gslide-description"), this.slideDescriptionContained = this.slideDescription && L(this.slideDescription.parentNode, "gslide-media"), this.preloadSlide(e + 1), this.preloadSlide(e - 1), this.updateNavigationClasses(), this.activeSlide = s;
          }
        }, {
          key: "preloadSlide",
          value: function value(t) {
            var e = this;
            if (t < 0 || t > this.elements.length - 1) return !1;
            if (S.isNil(this.elements[t])) return !1;
            var i = this.slidesContainer.querySelectorAll(".gslide")[t];
            if (L(i, "loaded")) return !1;
            var n = this.elements[t];
            n.index = t, this.slidesData[t] = n;
            var s = n.sourcetype;
            "video" == s || "external" == s ? setTimeout(function () {
              F.apply(e, [i, n]);
            }, 200) : F.apply(this, [i, n]);
          }
        }, {
          key: "prevSlide",
          value: function value() {
            this.goToSlide(this.index - 1);
          }
        }, {
          key: "nextSlide",
          value: function value() {
            this.goToSlide(this.index + 1);
          }
        }, {
          key: "goToSlide",
          value: function value() {
            var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            this.prevActiveSlide = this.activeSlide, this.prevActiveSlideIndex = this.index;
            var e = this.loop();
            if (!e && (t < 0 || t > this.elements.length - 1)) return !1;
            t < 0 ? t = this.elements.length - 1 : t >= this.elements.length && (t = 0), this.showSlide(t);
          }
        }, {
          key: "insertSlide",
          value: function value() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1,
                i = w({
              descPosition: this.settings.descPosition
            }, x),
                n = N(this.settings.slideHtml),
                s = this.elements.length - 1;

            if (e < 0 && (e = this.elements.length), (t = w(i, t)).index = e, t.node = !1, this.elements.splice(e, 0, t), this.slidesContainer) {
              if (e > s) this.slidesContainer.appendChild(n);else {
                var o = this.slidesContainer.querySelectorAll(".gslide")[e];
                this.slidesContainer.insertBefore(n, o);
              }
              (0 == this.index && 0 == e || this.index - 1 == e || this.index + 1 == e) && this.preloadSlide(e), 0 == this.index && 0 == e && (this.index = 1), this.updateNavigationClasses();
            }

            S.isFunction(this.settings.slideInserted) && this.settings.slideInserted({
              index: e,
              slide: this.slidesContainer.querySelectorAll(".gslide")[e],
              player: this.getSlidePlayerInstance(e)
            });
          }
        }, {
          key: "removeSlide",
          value: function value() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1;
            if (t < 0 || t > this.elements.length - 1) return !1;
            var e = this.slidesContainer && this.slidesContainer.querySelectorAll(".gslide")[t];
            e && (this.getActiveSlideIndex() == t && (t == this.elements.length - 1 ? this.prevSlide() : this.nextSlide()), e.parentNode.removeChild(e)), this.elements.splice(t, 1), S.isFunction(this.settings.slideRemoved) && this.settings.slideRemoved(t);
          }
        }, {
          key: "slideAnimateIn",
          value: function value(t, e) {
            var i = this,
                n = t.querySelector(".gslide-media"),
                s = t.querySelector(".gslide-description"),
                o = {
              index: this.prevActiveSlideIndex,
              slide: this.prevActiveSlide,
              player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
            },
                l = {
              index: this.index,
              slide: this.activeSlide,
              player: this.getSlidePlayerInstance(this.index)
            };
            if (n.offsetWidth > 0 && s && (q(s), s.style.display = ""), C(t, this.effectsClasses), e) I(t, this.settings.openEffect, function () {
              !u && i.settings.autoplayVideos && i.playSlideVideo(t), S.isFunction(i.settings.afterSlideChange) && i.settings.afterSlideChange.apply(i, [o, l]);
            });else {
              var r = this.settings.slideEffect,
                  a = "none" !== r ? this.settings.cssEfects[r].in : r;
              this.prevActiveSlideIndex > this.index && "slide" == this.settings.slideEffect && (a = this.settings.cssEfects.slide_back.in), I(t, a, function () {
                !u && i.settings.autoplayVideos && i.playSlideVideo(t), S.isFunction(i.settings.afterSlideChange) && i.settings.afterSlideChange.apply(i, [o, l]);
              });
            }
            setTimeout(function () {
              i.resize(t);
            }, 100), A(t, "current");
          }
        }, {
          key: "slideAnimateOut",
          value: function value() {
            if (!this.prevActiveSlide) return !1;
            var t = this.prevActiveSlide;
            C(t, this.effectsClasses), A(t, "prev");
            var e = this.settings.slideEffect,
                i = "none" !== e ? this.settings.cssEfects[e].out : e;
            this.stopSlideVideo(t), S.isFunction(this.settings.beforeSlideChange) && this.settings.beforeSlideChange.apply(this, [{
              index: this.prevActiveSlideIndex,
              slide: this.prevActiveSlide,
              player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
            }, {
              index: this.index,
              slide: this.activeSlide,
              player: this.getSlidePlayerInstance(this.index)
            }]), this.prevActiveSlideIndex > this.index && "slide" == this.settings.slideEffect && (i = this.settings.cssEfects.slide_back.out), I(t, i, function () {
              var e = t.querySelector(".gslide-media"),
                  i = t.querySelector(".gslide-description");
              e.style.transform = "", C(e, "greset"), e.style.opacity = "", i && (i.style.opacity = ""), C(t, "prev");
            });
          }
        }, {
          key: "getAllPlayers",
          value: function value() {
            return y;
          }
        }, {
          key: "getSlidePlayerInstance",
          value: function value(t) {
            var e = "gvideo" + t;
            return !(!S.has(y, e) || !y[e]) && y[e];
          }
        }, {
          key: "stopSlideVideo",
          value: function value(t) {
            if (S.isNode(t)) {
              var e = t.querySelector(".gvideo-wrapper");
              e && (t = e.getAttribute("data-index"));
            }

            var i = this.getSlidePlayerInstance(t);
            i && i.playing && i.pause();
          }
        }, {
          key: "playSlideVideo",
          value: function value(t) {
            if (S.isNode(t)) {
              var e = t.querySelector(".gvideo-wrapper");
              e && (t = e.getAttribute("data-index"));
            }

            var i = this.getSlidePlayerInstance(t);
            i && !i.playing && i.play();
          }
        }, {
          key: "setElements",
          value: function value(t) {
            var e = this;
            this.settings.elements = !1;
            var i = [];
            T(t, function (t) {
              var n = B(t, e.settings);
              i.push(n);
            }), this.elements = i, this.lightboxOpen && (this.slidesContainer.innerHTML = "", T(this.elements, function () {
              var t = N(e.settings.slideHtml);
              e.slidesContainer.appendChild(t);
            }), this.showSlide(0, !0));
          }
        }, {
          key: "getElementIndex",
          value: function value(t) {
            var e = !1;
            return T(this.elements, function (i, n) {
              if (S.has(i, "node") && i.node == t) return e = n, !0;
            }), e;
          }
        }, {
          key: "getElements",
          value: function value() {
            var t = this,
                e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                i = [];
            this.elements = this.elements ? this.elements : [], !S.isNil(this.settings.elements) && S.isArray(this.settings.elements) && (i = this.settings.elements);
            var n = !1,
                s = this.getSelector();

            if (null !== e) {
              var o = e.getAttribute("data-gallery");
              o && "" !== o && (n = document.querySelectorAll('[data-gallery="'.concat(o, '"]')));
            }

            return 0 == n && s && (n = document.querySelectorAll(this.getSelector())), n ? (T(n, function (e, n) {
              var s = B(e, t.settings);
              s.node = e, s.index = n, i.push(s);
            }), i) : i;
          }
        }, {
          key: "getSelector",
          value: function value() {
            return this.settings.selector && "data-" == this.settings.selector.substring(0, 5) ? "*[".concat(this.settings.selector, "]") : this.settings.selector;
          }
        }, {
          key: "getActiveSlide",
          value: function value() {
            return this.slidesContainer.querySelectorAll(".gslide")[this.index];
          }
        }, {
          key: "getActiveSlideIndex",
          value: function value() {
            return this.index;
          }
        }, {
          key: "getAnimationClasses",
          value: function value() {
            var t = [];

            for (var e in this.settings.cssEfects) {
              if (this.settings.cssEfects.hasOwnProperty(e)) {
                var i = this.settings.cssEfects[e];
                t.push("g".concat(i.in)), t.push("g".concat(i.out));
              }
            }

            return t.join(" ");
          }
        }, {
          key: "build",
          value: function value() {
            var t = this;
            if (this.built) return !1;
            var e = S.has(this.settings.svg, "next") ? this.settings.svg.next : "",
                i = S.has(this.settings.svg, "prev") ? this.settings.svg.prev : "",
                n = S.has(this.settings.svg, "close") ? this.settings.svg.close : "",
                s = this.settings.lightboxHtml;
            s = N(s = (s = (s = s.replace(/{nextSVG}/g, e)).replace(/{prevSVG}/g, i)).replace(/{closeSVG}/g, n)), document.body.appendChild(s);
            var o = document.getElementById("glightbox-body");
            this.modal = o;
            var l = o.querySelector(".gclose");
            this.prevButton = o.querySelector(".gprev"), this.nextButton = o.querySelector(".gnext"), this.overlay = o.querySelector(".goverlay"), this.loader = o.querySelector(".gloader"), this.slidesContainer = document.getElementById("glightbox-slider"), this.events = {}, A(this.modal, "glightbox-" + this.settings.skin), this.settings.closeButton && l && (this.events.close = E("click", {
              onElement: l,
              withCallback: function withCallback(e, i) {
                e.preventDefault(), t.close();
              }
            })), l && !this.settings.closeButton && l.parentNode.removeChild(l), this.nextButton && (this.events.next = E("click", {
              onElement: this.nextButton,
              withCallback: function withCallback(e, i) {
                e.preventDefault(), t.nextSlide();
              }
            })), this.prevButton && (this.events.prev = E("click", {
              onElement: this.prevButton,
              withCallback: function withCallback(e, i) {
                e.preventDefault(), t.prevSlide();
              }
            })), this.settings.closeOnOutsideClick && (this.events.outClose = E("click", {
              onElement: o,
              withCallback: function withCallback(e, i) {
                L(document.body, "glightbox-mobile") || O(e.target, ".ginner-container") || O(e.target, ".gbtn") || L(e.target, "gnext") || L(e.target, "gprev") || t.close();
              }
            })), T(this.elements, function () {
              var e = N(t.settings.slideHtml);
              t.slidesContainer.appendChild(e);
            }), g && A(document.body, "glightbox-touch"), this.events.resize = E("resize", {
              onElement: window,
              withCallback: function withCallback() {
                t.resize();
              }
            }), this.built = !0;
          }
        }, {
          key: "resize",
          value: function value() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;

            if ((t = t || this.activeSlide) && !L(t, "zoomed")) {
              var e = z(),
                  i = t.querySelector(".gvideo-wrapper"),
                  n = t.querySelector(".gslide-image"),
                  s = this.slideDescription,
                  o = e.width,
                  l = e.height;

              if (o <= 768 ? A(document.body, "glightbox-mobile") : C(document.body, "glightbox-mobile"), i || n) {
                var r = !1;
                if (s && (L(s, "description-bottom") || L(s, "description-top")) && !L(s, "gabsolute") && (r = !0), n) if (o <= 768) {
                  var a = n.querySelector("img");
                  a.setAttribute("style", "");
                } else if (r) {
                  var h = s.offsetHeight,
                      c = this.slidesData[this.index].width;
                  c = c <= o ? c + "px" : "100%";
                  var d = n.querySelector("img");
                  d.setAttribute("style", "max-height: calc(100vh - ".concat(h, "px)")), s.setAttribute("style", "max-width: ".concat(d.offsetWidth, "px;"));
                }

                if (i) {
                  var u = S.has(this.settings.plyr.config, "ratio") ? this.settings.plyr.config.ratio : "16:9",
                      g = u.split(":"),
                      p = this.slidesData[this.index].width,
                      v = p / (parseInt(g[0]) / parseInt(g[1]));

                  if (v = Math.floor(v), r && (l -= s.offsetHeight), l < v && o > p) {
                    var f = i.offsetWidth,
                        m = i.offsetHeight,
                        y = l / m,
                        b = {
                      width: f * y,
                      height: m * y
                    };
                    i.parentNode.setAttribute("style", "max-width: ".concat(b.width, "px")), r && s.setAttribute("style", "max-width: ".concat(b.width, "px;"));
                  } else i.parentNode.style.maxWidth = "".concat(p, "px"), r && s.setAttribute("style", "max-width: ".concat(p, "px;"));
                }
              }
            }
          }
        }, {
          key: "reload",
          value: function value() {
            this.init();
          }
        }, {
          key: "updateNavigationClasses",
          value: function value() {
            var t = this.loop();
            C(this.nextButton, "disabled"), C(this.prevButton, "disabled"), 0 == this.index && this.elements.length - 1 == 0 ? (A(this.prevButton, "disabled"), A(this.nextButton, "disabled")) : 0 !== this.index || t ? this.index !== this.elements.length - 1 || t || A(this.nextButton, "disabled") : A(this.prevButton, "disabled");
          }
        }, {
          key: "loop",
          value: function value() {
            var t = S.has(this.settings, "loopAtEnd") ? this.settings.loopAtEnd : null;
            return t = S.has(this.settings, "loop") ? this.settings.loop : t, t;
          }
        }, {
          key: "close",
          value: function value() {
            var t = this;

            if (!this.lightboxOpen) {
              if (this.events) {
                for (var e in this.events) {
                  this.events.hasOwnProperty(e) && this.events[e].destroy();
                }

                this.events = null;
              }

              return !1;
            }

            if (this.closing) return !1;
            this.closing = !0, this.stopSlideVideo(this.activeSlide), A(this.modal, "glightbox-closing"), I(this.overlay, "none" == this.settings.openEffect ? "none" : this.settings.cssEfects.fade.out), I(this.activeSlide, this.settings.closeEffect, function () {
              if (t.activeSlide = null, t.prevActiveSlideIndex = null, t.prevActiveSlide = null, t.built = !1, t.events) {
                for (var e in t.events) {
                  t.events.hasOwnProperty(e) && t.events[e].destroy();
                }

                t.events = null;
              }

              var i = document.body;
              C(p, "glightbox-open"), C(i, "glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer"), t.modal.parentNode.removeChild(t.modal), S.isFunction(t.settings.onClose) && t.settings.onClose();
              var n = document.querySelector(".gcss-styles");
              n && n.parentNode.removeChild(n), t.lightboxOpen = !1, t.closing = null;
            });
          }
        }, {
          key: "destroy",
          value: function value() {
            this.close(), this.baseEvents.destroy();
          }
        }]), t;
      }();

      return function () {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            e = new K(t);
        return e.init(), e;
      };
    });
  });
  document.addEventListener('DOMContentLoaded', function (event) {
    var lightbox;
    var playing = false;
    lightbox = glightbox_min({
      plyr: {
        css: 'https://cdn.plyr.io/3.5.6/plyr.css',
        // Default not required to include
        js: 'https://cdn.plyr.io/3.5.6/plyr.js',
        // Default not required to include
        config: {
          ratio: '16:9',
          // or '4:3'
          muted: false,
          hideControls: true,
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3
          },
          vimeo: {
            byline: false,
            portrait: false,
            title: false,
            speed: true,
            transparent: false
          }
        }
      },
      selector: '.glightbox2',
      afterSlideChange: function afterSlideChange() {
        var players = lightbox.getAllPlayers();
        Object.keys(players).forEach(function (key) {
          var plyr = players[key];
          plyr.on('play', function () {
            return playing = true;
          });
          plyr.on('pause', function () {
            if (!playing) return;

            window.___triggerEvent({
              action: 'Pause',
              category: 'Video',
              label: window.___currentVideo
            });
          });
          plyr.on('ended', function () {
            window.___triggerEvent({
              action: 'End',
              category: 'Video',
              label: window.___currentVideo
            });
          });
        });
      }
    });
  });

  (function () {
    var articles = document.querySelectorAll('.js-gallery-article');
    var baseDelay = 200;

    var _loop3 = function _loop3(i, j) {
      var article = articles[i];
      listen(article, 'click', function (ev) {
        // ev.preventDefault();
        for (var k = 0, l = articles.length; k < l; k++) {
          removeClass(articles[k], 'active');
          addClass(article, 'active');
        } // return false;

      });
      article.querySelector('.article__scroll-wrapper').setAttribute('data-scroll-delay', i % 3 * baseDelay);
    };

    for (var i = 0, j = articles.length; i < j; i++) {
      _loop3(i, j);
    }
  })();

  (function () {
    if (document.querySelector('.js-single-bar-chart')) {
      // bar chart with percentage
      var singleBar = document.querySelector('.js-single-bar-chart'),
          percent = singleBar.querySelector('.counter').getAttribute('data-to');
      singleBar.style.height = "".concat(percent, "%");
    }
  })();

  var counter = function () {
    var elems = document.querySelectorAll('.counter');

    var getData = function getData(el, attr) {
      var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (el.hasAttribute("data-".concat(attr))) return el.getAttribute("data-".concat(attr));else return def;
    };

    var pad = function pad(n, length) {
      var s = n + "";

      while (s.length < length) {
        s = "0" + s;
      }

      return s;
    };

    var countDecimals = function countDecimals(n) {
      if (Math.floor(n.valueOf()) === n.valueOf()) return 0;
      return n.toString().split(".")[1].length || 0;
    };

    var prepare = function prepare() {
      for (var i = 0, j = elems.length; i < j; i++) {
        elems[i].setAttribute('id', "__counter_".concat(i));
        prepareCounter(elems[i]);
      }
    };

    var prepareCounter = function prepareCounter(el) {
      var from = parseFloat(getData(el, 'from', 0)),
          to = parseFloat(getData(el, 'to', 0)),
          duration = parseInt(getData(el, 'duration', 1200)),
          delay = parseInt(getData(el, 'delay', 0)),
          accuracy = countDecimals(to);
      var counterFuncName = "counterTrigger".concat(el.getAttribute('id'));

      window[counterFuncName] = function (el, from, to, accuracy, duration, delay) {
        return function () {
          startAnimation(el, from, to, accuracy, duration, delay);
        };
      }(el, from, to, accuracy, duration, delay);

      el.setAttribute('data-scroll-function', counterFuncName);
    };

    var startAnimation = function startAnimation(el, from, to, accuracy, duration, delay) {
      animate({
        timing: easing.outCubic,
        duration: duration,
        delay: delay,
        draw: function draw(progress) {
          var value = progress * (to - from) + from;
          el.innerHTML = pad(value.toFixed(accuracy), Math.round(Math.abs(to)).toString().length);
        }
      });
    };

    return {
      prepare: prepare
    };
  }();

  counter.prepare();

  window.triggerStatCounters = function () {
    var _counters = this.querySelectorAll('.counter');

    for (var i = 0, j = _counters.length; i < j; i++) {
      window[_counters[i].getAttribute('data-scroll-function')].call();
    }
  };

  var slotMachines = function () {
    var SlotMachine = function SlotMachine(el, index) {
      this.el = el;
      this.index = index;
      this.all = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
      this.target = el.innerText.split("");
      this.letters = [];
      this._channelWidths = [];
      this.lettersToFill = {
        min: 6,
        max: 10
      };
      this.delayInterval = 100;
      this.elDelay = parseInt(this.el.getAttribute('data-delay'));
      this.init();
    };

    SlotMachine.prototype.init = function () {
      var _this6 = this;

      for (var i = 0, j = this.target.length; i < j; i++) {
        this.fillLettersArray(this.target[i]);
      }

      this.el.innerHTML = "";
      this.el.appendChild(this.buildLettersMarkup());
      window.addEventListener('load', function () {
        _this6.setColumnWidth();

        var slotFuncName = "__slotMachine_".concat(_this6.index);

        window[slotFuncName] = function (_this) {
          return function () {
            _this.runAnimation();
          };
        }(_this6);

        _this6.el.setAttribute('data-scroll-function', slotFuncName);
      });
    };

    SlotMachine.prototype.fillLettersArray = function (letter) {
      var letterArray = [],
          amount = this.getNumberOfLettersToFill();

      for (var i = 0, j = amount; i < j; i++) {
        letterArray.push(this.getRandomLetter());
      }

      letterArray.push(letter);
      this.letters.push(letterArray);
    };

    SlotMachine.prototype.getNumberOfLettersToFill = function () {
      return Math.floor(Math.random() * (this.lettersToFill.max - this.lettersToFill.min)) + this.lettersToFill.min;
    };

    SlotMachine.prototype.getRandomLetter = function () {
      return this.all[Math.floor(Math.random() * this.all.length) + 0];
    };

    SlotMachine.prototype.buildLettersMarkup = function () {
      var cont = document.createElement('div');
      cont.className = 'slot-machine__container';

      for (var i = 0, j = this.letters.length; i < j; i++) {
        cont.appendChild(this.buildLetterMarkup(this.letters[i]));
      }

      return cont;
    };

    SlotMachine.prototype.buildLetterMarkup = function (letterArray) {
      var wrap = document.createElement('div');
      wrap.className = 'slot-machine__letter-wrap';

      for (var i = 0, j = letterArray.length; i < j; i++) {
        var letter = document.createElement('div');
        letter.className = 'slot-machine__letter';
        var target = letterArray[i];
        if (!target || /^\s*$/.test(target)) letter.innerHTML = "&nbsp;";else letter.innerText = target;
        wrap.appendChild(letter);
      }

      return wrap;
    };

    SlotMachine.prototype.setColumnWidth = function () {
      var wraps = this.el.querySelectorAll('.slot-machine__letter-wrap');
      this._channelWidths = [];

      for (var i = 0, j = wraps.length; i < j; i++) {
        var wrap = wraps[i],
            childs = wrap.querySelectorAll('.slot-machine__letter'),
            last = childs[childs.length - 1];

        this._channelWidths.push(last.clientWidth);

        wrap.style.width = "".concat(last.clientWidth, "px");
      }
    };

    SlotMachine.prototype.runAnimation = function () {
      var _this7 = this;

      var wraps = this.el.querySelectorAll('.slot-machine__letter-wrap');
      addClass(this.el, 'ready');

      for (var i = 0, j = wraps.length; i < j; i++) {
        var wrap = wraps[i],
            dy = wrap.clientHeight - this.el.clientHeight,
            delay = this.elDelay + this.delayInterval * i;
        wrap.style = "\n        width: ".concat(this._channelWidths[i], "px;\n        transition-delay: ").concat(delay, "ms;\n        transform: translate3d(0, -").concat(dy, "px, 0);\n      ");
      }

      window.addEventListener('resize', function () {
        return _this7.resizeAfterAnimation();
      });
    };

    SlotMachine.prototype.resizeAfterAnimation = function () {
      var _this8 = this;

      var wraps = this.el.querySelectorAll('.slot-machine__letter-wrap');
      if (!!this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(function () {
        _this8.setColumnWidth();

        for (var i = 0, j = wraps.length; i < j; i++) {
          var wrap = wraps[i],
              dy = wrap.clientHeight - _this8.el.clientHeight;
          wrap.style = "\n          width: ".concat(_this8._channelWidths[i], "px;\n          transform: translate3d(0, -").concat(dy, "px, 0);\n        ");
        }
      }, 500); // throttle 500ms
    };

    var load = function load() {
      var els = document.querySelectorAll('.slot-machine-text');

      for (var i = 0, j = els.length; i < j; i++) {
        els[i].__slotmachine = new SlotMachine(els[i], i);
      }
    };

    return {
      load: load
    };
  }();

  slotMachines.load();
  /*
   * anime.js v3.2.0
   * (c) 2020 Julian Garnier
   * Released under the MIT license
   * animejs.com
   */
  // Defaults

  var defaultInstanceSettings = {
    update: null,
    begin: null,
    loopBegin: null,
    changeBegin: null,
    change: null,
    changeComplete: null,
    loopComplete: null,
    complete: null,
    loop: 1,
    direction: 'normal',
    autoplay: true,
    timelineOffset: 0
  };
  var defaultTweenSettings = {
    duration: 1000,
    delay: 0,
    endDelay: 0,
    easing: 'easeOutElastic(1, .5)',
    round: 0
  };
  var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d']; // Caching

  var cache = {
    CSS: {},
    springs: {}
  }; // Utils

  function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function stringContains(str, text) {
    return str.indexOf(text) > -1;
  }

  function applyArguments(func, args) {
    return func.apply(null, args);
  }

  var is = {
    arr: function arr(a) {
      return Array.isArray(a);
    },
    obj: function obj(a) {
      return stringContains(Object.prototype.toString.call(a), 'Object');
    },
    pth: function pth(a) {
      return is.obj(a) && a.hasOwnProperty('totalLength');
    },
    svg: function svg(a) {
      return a instanceof SVGElement;
    },
    inp: function inp(a) {
      return a instanceof HTMLInputElement;
    },
    dom: function dom(a) {
      return a.nodeType || is.svg(a);
    },
    str: function str(a) {
      return typeof a === 'string';
    },
    fnc: function fnc(a) {
      return typeof a === 'function';
    },
    und: function und(a) {
      return typeof a === 'undefined';
    },
    hex: function hex(a) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
    },
    rgb: function rgb(a) {
      return /^rgb/.test(a);
    },
    hsl: function hsl(a) {
      return /^hsl/.test(a);
    },
    col: function col(a) {
      return is.hex(a) || is.rgb(a) || is.hsl(a);
    },
    key: function key(a) {
      return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
    }
  }; // Easings

  function parseEasingParameters(string) {
    var match = /\(([^)]+)\)/.exec(string);
    return match ? match[1].split(',').map(function (p) {
      return parseFloat(p);
    }) : [];
  } // Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js


  function spring(string, duration) {
    var params = parseEasingParameters(string);
    var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
    var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
    var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
    var velocity = minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
    var w0 = Math.sqrt(stiffness / mass);
    var zeta = damping / (2 * Math.sqrt(stiffness * mass));
    var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
    var a = 1;
    var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

    function solver(t) {
      var progress = duration ? duration * t / 1000 : t;

      if (zeta < 1) {
        progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
      } else {
        progress = (a + b * progress) * Math.exp(-progress * w0);
      }

      if (t === 0 || t === 1) {
        return t;
      }

      return 1 - progress;
    }

    function getDuration() {
      var cached = cache.springs[string];

      if (cached) {
        return cached;
      }

      var frame = 1 / 6;
      var elapsed = 0;
      var rest = 0;

      while (true) {
        elapsed += frame;

        if (solver(elapsed) === 1) {
          rest++;

          if (rest >= 16) {
            break;
          }
        } else {
          rest = 0;
        }
      }

      var duration = elapsed * frame * 1000;
      cache.springs[string] = duration;
      return duration;
    }

    return duration ? solver : getDuration;
  } // Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function


  function steps(steps) {
    if (steps === void 0) steps = 10;
    return function (t) {
      return Math.ceil(minMax(t, 0.000001, 1) * steps) * (1 / steps);
    };
  } // BezierEasing https://github.com/gre/bezier-easing


  var bezier = function () {
    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    function A(aA1, aA2) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }

    function B(aA1, aA2) {
      return 3.0 * aA2 - 6.0 * aA1;
    }

    function C(aA1) {
      return 3.0 * aA1;
    }

    function calcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }

    function getSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function binarySubdivide(aX, aA, aB, mX1, mX2) {
      var currentX,
          currentT,
          i = 0;

      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;

        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > 0.0000001 && ++i < 10);

      return currentT;
    }

    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
      for (var i = 0; i < 4; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);

        if (currentSlope === 0.0) {
          return aGuessT;
        }

        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }

      return aGuessT;
    }

    function bezier(mX1, mY1, mX2, mY2) {
      if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
        return;
      }

      var sampleValues = new Float32Array(kSplineTableSize);

      if (mX1 !== mY1 || mX2 !== mY2) {
        for (var i = 0; i < kSplineTableSize; ++i) {
          sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
      }

      function getTForX(aX) {
        var intervalStart = 0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }

        --currentSample;
        var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);

        if (initialSlope >= 0.001) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
      }

      return function (x) {
        if (mX1 === mY1 && mX2 === mY2) {
          return x;
        }

        if (x === 0 || x === 1) {
          return x;
        }

        return calcBezier(getTForX(x), mY1, mY2);
      };
    }

    return bezier;
  }();

  var penner = function () {
    // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
    var eases = {
      linear: function linear() {
        return function (t) {
          return t;
        };
      }
    };
    var functionEasings = {
      Sine: function Sine() {
        return function (t) {
          return 1 - Math.cos(t * Math.PI / 2);
        };
      },
      Circ: function Circ() {
        return function (t) {
          return 1 - Math.sqrt(1 - t * t);
        };
      },
      Back: function Back() {
        return function (t) {
          return t * t * (3 * t - 2);
        };
      },
      Bounce: function Bounce() {
        return function (t) {
          var pow2,
              b = 4;

          while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}

          return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
        };
      },
      Elastic: function Elastic(amplitude, period) {
        if (amplitude === void 0) amplitude = 1;
        if (period === void 0) period = .5;
        var a = minMax(amplitude, 1, 10);
        var p = minMax(period, .1, 2);
        return function (t) {
          return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
        };
      }
    };
    var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
    baseEasings.forEach(function (name, i) {
      functionEasings[name] = function () {
        return function (t) {
          return Math.pow(t, i + 2);
        };
      };
    });
    Object.keys(functionEasings).forEach(function (name) {
      var easeIn = functionEasings[name];
      eases['easeIn' + name] = easeIn;

      eases['easeOut' + name] = function (a, b) {
        return function (t) {
          return 1 - easeIn(a, b)(1 - t);
        };
      };

      eases['easeInOut' + name] = function (a, b) {
        return function (t) {
          return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
        };
      };
    });
    return eases;
  }();

  function parseEasings(easing, duration) {
    if (is.fnc(easing)) {
      return easing;
    }

    var name = easing.split('(')[0];
    var ease = penner[name];
    var args = parseEasingParameters(easing);

    switch (name) {
      case 'spring':
        return spring(easing, duration);

      case 'cubicBezier':
        return applyArguments(bezier, args);

      case 'steps':
        return applyArguments(steps, args);

      default:
        return applyArguments(ease, args);
    }
  } // Strings


  function selectString(str) {
    try {
      var nodes = document.querySelectorAll(str);
      return nodes;
    } catch (e) {
      return;
    }
  } // Arrays


  function filterArray(arr, callback) {
    var len = arr.length;
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    var result = [];

    for (var i = 0; i < len; i++) {
      if (i in arr) {
        var val = arr[i];

        if (callback.call(thisArg, val, i, arr)) {
          result.push(val);
        }
      }
    }

    return result;
  }

  function flattenArray(arr) {
    return arr.reduce(function (a, b) {
      return a.concat(is.arr(b) ? flattenArray(b) : b);
    }, []);
  }

  function toArray(o) {
    if (is.arr(o)) {
      return o;
    }

    if (is.str(o)) {
      o = selectString(o) || o;
    }

    if (o instanceof NodeList || o instanceof HTMLCollection) {
      return [].slice.call(o);
    }

    return [o];
  }

  function arrayContains(arr, val) {
    return arr.some(function (a) {
      return a === val;
    });
  } // Objects


  function cloneObject(o) {
    var clone = {};

    for (var p in o) {
      clone[p] = o[p];
    }

    return clone;
  }

  function replaceObjectProps(o1, o2) {
    var o = cloneObject(o1);

    for (var p in o1) {
      o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
    }

    return o;
  }

  function mergeObjects(o1, o2) {
    var o = cloneObject(o1);

    for (var p in o2) {
      o[p] = is.und(o1[p]) ? o2[p] : o1[p];
    }

    return o;
  } // Colors


  function rgbToRgba(rgbValue) {
    var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
    return rgb ? "rgba(" + rgb[1] + ",1)" : rgbValue;
  }

  function hexToRgba(hexValue) {
    var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var hex = hexValue.replace(rgx, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(rgb[1], 16);
    var g = parseInt(rgb[2], 16);
    var b = parseInt(rgb[3], 16);
    return "rgba(" + r + "," + g + "," + b + ",1)";
  }

  function hslToRgba(hslValue) {
    var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
    var h = parseInt(hsl[1], 10) / 360;
    var s = parseInt(hsl[2], 10) / 100;
    var l = parseInt(hsl[3], 10) / 100;
    var a = hsl[4] || 1;

    function hue2rgb(p, q, t) {
      if (t < 0) {
        t += 1;
      }

      if (t > 1) {
        t -= 1;
      }

      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }

      if (t < 1 / 2) {
        return q;
      }

      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }

      return p;
    }

    var r, g, b;

    if (s == 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return "rgba(" + r * 255 + "," + g * 255 + "," + b * 255 + "," + a + ")";
  }

  function colorToRgb(val) {
    if (is.rgb(val)) {
      return rgbToRgba(val);
    }

    if (is.hex(val)) {
      return hexToRgba(val);
    }

    if (is.hsl(val)) {
      return hslToRgba(val);
    }
  } // Units


  function getUnit(val) {
    var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);

    if (split) {
      return split[1];
    }
  }

  function getTransformUnit(propName) {
    if (stringContains(propName, 'translate') || propName === 'perspective') {
      return 'px';
    }

    if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) {
      return 'deg';
    }
  } // Values


  function getFunctionValue(val, animatable) {
    if (!is.fnc(val)) {
      return val;
    }

    return val(animatable.target, animatable.id, animatable.total);
  }

  function getAttribute(el, prop) {
    return el.getAttribute(prop);
  }

  function convertPxToUnit(el, value, unit) {
    var valueUnit = getUnit(value);

    if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) {
      return value;
    }

    var cached = cache.CSS[value + unit];

    if (!is.und(cached)) {
      return cached;
    }

    var baseline = 100;
    var tempEl = document.createElement(el.tagName);
    var parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;
    parentEl.appendChild(tempEl);
    tempEl.style.position = 'absolute';
    tempEl.style.width = baseline + unit;
    var factor = baseline / tempEl.offsetWidth;
    parentEl.removeChild(tempEl);
    var convertedUnit = factor * parseFloat(value);
    cache.CSS[value + unit] = convertedUnit;
    return convertedUnit;
  }

  function getCSSValue(el, prop, unit) {
    if (prop in el.style) {
      var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
      return unit ? convertPxToUnit(el, value, unit) : value;
    }
  }

  function getAnimationType(el, prop) {
    if (is.dom(el) && !is.inp(el) && (getAttribute(el, prop) || is.svg(el) && el[prop])) {
      return 'attribute';
    }

    if (is.dom(el) && arrayContains(validTransforms, prop)) {
      return 'transform';
    }

    if (is.dom(el) && prop !== 'transform' && getCSSValue(el, prop)) {
      return 'css';
    }

    if (el[prop] != null) {
      return 'object';
    }
  }

  function getElementTransforms(el) {
    if (!is.dom(el)) {
      return;
    }

    var str = el.style.transform || '';
    var reg = /(\w+)\(([^)]*)\)/g;
    var transforms = new Map();
    var m;

    while (m = reg.exec(str)) {
      transforms.set(m[1], m[2]);
    }

    return transforms;
  }

  function getTransformValue(el, propName, animatable, unit) {
    var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
    var value = getElementTransforms(el).get(propName) || defaultVal;

    if (animatable) {
      animatable.transforms.list.set(propName, value);
      animatable.transforms['last'] = propName;
    }

    return unit ? convertPxToUnit(el, value, unit) : value;
  }

  function getOriginalTargetValue(target, propName, unit, animatable) {
    switch (getAnimationType(target, propName)) {
      case 'transform':
        return getTransformValue(target, propName, animatable, unit);

      case 'css':
        return getCSSValue(target, propName, unit);

      case 'attribute':
        return getAttribute(target, propName);

      default:
        return target[propName] || 0;
    }
  }

  function getRelativeValue(to, from) {
    var operator = /^(\*=|\+=|-=)/.exec(to);

    if (!operator) {
      return to;
    }

    var u = getUnit(to) || 0;
    var x = parseFloat(from);
    var y = parseFloat(to.replace(operator[0], ''));

    switch (operator[0][0]) {
      case '+':
        return x + y + u;

      case '-':
        return x - y + u;

      case '*':
        return x * y + u;
    }
  }

  function validateValue(val, unit) {
    if (is.col(val)) {
      return colorToRgb(val);
    }

    if (/\s/g.test(val)) {
      return val;
    }

    var originalUnit = getUnit(val);
    var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;

    if (unit) {
      return unitLess + unit;
    }

    return unitLess;
  } // getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
  // adapted from https://gist.github.com/SebLambla/3e0550c496c236709744


  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCircleLength(el) {
    return Math.PI * 2 * getAttribute(el, 'r');
  }

  function getRectLength(el) {
    return getAttribute(el, 'width') * 2 + getAttribute(el, 'height') * 2;
  }

  function getLineLength(el) {
    return getDistance({
      x: getAttribute(el, 'x1'),
      y: getAttribute(el, 'y1')
    }, {
      x: getAttribute(el, 'x2'),
      y: getAttribute(el, 'y2')
    });
  }

  function getPolylineLength(el) {
    var points = el.points;
    var totalLength = 0;
    var previousPos;

    for (var i = 0; i < points.numberOfItems; i++) {
      var currentPos = points.getItem(i);

      if (i > 0) {
        totalLength += getDistance(previousPos, currentPos);
      }

      previousPos = currentPos;
    }

    return totalLength;
  }

  function getPolygonLength(el) {
    var points = el.points;
    return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
  } // Path animation


  function getTotalLength(el) {
    if (el.getTotalLength) {
      return el.getTotalLength();
    }

    switch (el.tagName.toLowerCase()) {
      case 'circle':
        return getCircleLength(el);

      case 'rect':
        return getRectLength(el);

      case 'line':
        return getLineLength(el);

      case 'polyline':
        return getPolylineLength(el);

      case 'polygon':
        return getPolygonLength(el);
    }
  }

  function setDashoffset(el) {
    var pathLength = getTotalLength(el);
    el.setAttribute('stroke-dasharray', pathLength);
    return pathLength;
  } // Motion path


  function getParentSvgEl(el) {
    var parentEl = el.parentNode;

    while (is.svg(parentEl)) {
      if (!is.svg(parentEl.parentNode)) {
        break;
      }

      parentEl = parentEl.parentNode;
    }

    return parentEl;
  }

  function getParentSvg(pathEl, svgData) {
    var svg = svgData || {};
    var parentSvgEl = svg.el || getParentSvgEl(pathEl);
    var rect = parentSvgEl.getBoundingClientRect();
    var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
    var width = rect.width;
    var height = rect.height;
    var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
    return {
      el: parentSvgEl,
      viewBox: viewBox,
      x: viewBox[0] / 1,
      y: viewBox[1] / 1,
      w: width / viewBox[2],
      h: height / viewBox[3]
    };
  }

  function getPath(path, percent) {
    var pathEl = is.str(path) ? selectString(path)[0] : path;
    var p = percent || 100;
    return function (property) {
      return {
        property: property,
        el: pathEl,
        svg: getParentSvg(pathEl),
        totalLength: getTotalLength(pathEl) * (p / 100)
      };
    };
  }

  function getPathProgress(path, progress) {
    function point(offset) {
      if (offset === void 0) offset = 0;
      var l = progress + offset >= 1 ? progress + offset : 0;
      return path.el.getPointAtLength(l);
    }

    var svg = getParentSvg(path.el, path.svg);
    var p = point();
    var p0 = point(-1);
    var p1 = point(+1);

    switch (path.property) {
      case 'x':
        return (p.x - svg.x) * svg.w;

      case 'y':
        return (p.y - svg.y) * svg.h;

      case 'angle':
        return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
    }
  } // Decompose value


  function decomposeValue(val, unit) {
    // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
    // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
    var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation

    var value = validateValue(is.pth(val) ? val.totalLength : val, unit) + '';
    return {
      original: value,
      numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
      strings: is.str(val) || unit ? value.split(rgx) : []
    };
  } // Animatables


  function parseTargets(targets) {
    var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
    return filterArray(targetsArray, function (item, pos, self) {
      return self.indexOf(item) === pos;
    });
  }

  function getAnimatables(targets) {
    var parsed = parseTargets(targets);
    return parsed.map(function (t, i) {
      return {
        target: t,
        id: i,
        total: parsed.length,
        transforms: {
          list: getElementTransforms(t)
        }
      };
    });
  } // Properties


  function normalizePropertyTweens(prop, tweenSettings) {
    var settings = cloneObject(tweenSettings); // Override duration if easing is a spring

    if (/^spring/.test(settings.easing)) {
      settings.duration = spring(settings.easing);
    }

    if (is.arr(prop)) {
      var l = prop.length;
      var isFromTo = l === 2 && !is.obj(prop[0]);

      if (!isFromTo) {
        // Duration divided by the number of tweens
        if (!is.fnc(tweenSettings.duration)) {
          settings.duration = tweenSettings.duration / l;
        }
      } else {
        // Transform [from, to] values shorthand to a valid tween value
        prop = {
          value: prop
        };
      }
    }

    var propArray = is.arr(prop) ? prop : [prop];
    return propArray.map(function (v, i) {
      var obj = is.obj(v) && !is.pth(v) ? v : {
        value: v
      }; // Default delay value should only be applied to the first tween

      if (is.und(obj.delay)) {
        obj.delay = !i ? tweenSettings.delay : 0;
      } // Default endDelay value should only be applied to the last tween


      if (is.und(obj.endDelay)) {
        obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0;
      }

      return obj;
    }).map(function (k) {
      return mergeObjects(k, settings);
    });
  }

  function flattenKeyframes(keyframes) {
    var propertyNames = filterArray(flattenArray(keyframes.map(function (key) {
      return Object.keys(key);
    })), function (p) {
      return is.key(p);
    }).reduce(function (a, b) {
      if (a.indexOf(b) < 0) {
        a.push(b);
      }

      return a;
    }, []);
    var properties = {};

    var loop = function loop(i) {
      var propName = propertyNames[i];
      properties[propName] = keyframes.map(function (key) {
        var newKey = {};

        for (var p in key) {
          if (is.key(p)) {
            if (p == propName) {
              newKey.value = key[p];
            }
          } else {
            newKey[p] = key[p];
          }
        }

        return newKey;
      });
    };

    for (var i = 0; i < propertyNames.length; i++) {
      loop(i);
    }

    return properties;
  }

  function getProperties(tweenSettings, params) {
    var properties = [];
    var keyframes = params.keyframes;

    if (keyframes) {
      params = mergeObjects(flattenKeyframes(keyframes), params);
    }

    for (var p in params) {
      if (is.key(p)) {
        properties.push({
          name: p,
          tweens: normalizePropertyTweens(params[p], tweenSettings)
        });
      }
    }

    return properties;
  } // Tweens


  function normalizeTweenValues(tween, animatable) {
    var t = {};

    for (var p in tween) {
      var value = getFunctionValue(tween[p], animatable);

      if (is.arr(value)) {
        value = value.map(function (v) {
          return getFunctionValue(v, animatable);
        });

        if (value.length === 1) {
          value = value[0];
        }
      }

      t[p] = value;
    }

    t.duration = parseFloat(t.duration);
    t.delay = parseFloat(t.delay);
    return t;
  }

  function normalizeTweens(prop, animatable) {
    var previousTween;
    return prop.tweens.map(function (t) {
      var tween = normalizeTweenValues(t, animatable);
      var tweenValue = tween.value;
      var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
      var toUnit = getUnit(to);
      var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
      var previousValue = previousTween ? previousTween.to.original : originalValue;
      var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
      var fromUnit = getUnit(from) || getUnit(originalValue);
      var unit = toUnit || fromUnit;

      if (is.und(to)) {
        to = previousValue;
      }

      tween.from = decomposeValue(from, unit);
      tween.to = decomposeValue(getRelativeValue(to, from), unit);
      tween.start = previousTween ? previousTween.end : 0;
      tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
      tween.easing = parseEasings(tween.easing, tween.duration);
      tween.isPath = is.pth(tweenValue);
      tween.isColor = is.col(tween.from.original);

      if (tween.isColor) {
        tween.round = 1;
      }

      previousTween = tween;
      return tween;
    });
  } // Tween progress


  var setProgressValue = {
    css: function css(t, p, v) {
      return t.style[p] = v;
    },
    attribute: function attribute(t, p, v) {
      return t.setAttribute(p, v);
    },
    object: function object(t, p, v) {
      return t[p] = v;
    },
    transform: function transform(t, p, v, transforms, manual) {
      transforms.list.set(p, v);

      if (p === transforms.last || manual) {
        var str = '';
        transforms.list.forEach(function (value, prop) {
          str += prop + "(" + value + ") ";
        });
        t.style.transform = str;
      }
    }
  }; // Set Value helper

  function setTargetsValue(targets, properties) {
    var animatables = getAnimatables(targets);
    animatables.forEach(function (animatable) {
      for (var property in properties) {
        var value = getFunctionValue(properties[property], animatable);
        var target = animatable.target;
        var valueUnit = getUnit(value);
        var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
        var unit = valueUnit || getUnit(originalValue);
        var to = getRelativeValue(validateValue(value, unit), originalValue);
        var animType = getAnimationType(target, property);
        setProgressValue[animType](target, property, to, animatable.transforms, true);
      }
    });
  } // Animations


  function createAnimation(animatable, prop) {
    var animType = getAnimationType(animatable.target, prop.name);

    if (animType) {
      var tweens = normalizeTweens(prop, animatable);
      var lastTween = tweens[tweens.length - 1];
      return {
        type: animType,
        property: prop.name,
        animatable: animatable,
        tweens: tweens,
        duration: lastTween.end,
        delay: tweens[0].delay,
        endDelay: lastTween.endDelay
      };
    }
  }

  function getAnimations(animatables, properties) {
    return filterArray(flattenArray(animatables.map(function (animatable) {
      return properties.map(function (prop) {
        return createAnimation(animatable, prop);
      });
    })), function (a) {
      return !is.und(a);
    });
  } // Create Instance


  function getInstanceTimings(animations, tweenSettings) {
    var animLength = animations.length;

    var getTlOffset = function getTlOffset(anim) {
      return anim.timelineOffset ? anim.timelineOffset : 0;
    };

    var timings = {};
    timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) {
      return getTlOffset(anim) + anim.duration;
    })) : tweenSettings.duration;
    timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) {
      return getTlOffset(anim) + anim.delay;
    })) : tweenSettings.delay;
    timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) {
      return getTlOffset(anim) + anim.duration - anim.endDelay;
    })) : tweenSettings.endDelay;
    return timings;
  }

  var instanceID = 0;

  function createNewInstance(params) {
    var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
    var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
    var properties = getProperties(tweenSettings, params);
    var animatables = getAnimatables(params.targets);
    var animations = getAnimations(animatables, properties);
    var timings = getInstanceTimings(animations, tweenSettings);
    var id = instanceID;
    instanceID++;
    return mergeObjects(instanceSettings, {
      id: id,
      children: [],
      animatables: animatables,
      animations: animations,
      duration: timings.duration,
      delay: timings.delay,
      endDelay: timings.endDelay
    });
  } // Core


  var activeInstances = [];
  var pausedInstances = [];
  var raf;

  var engine = function () {
    function play() {
      raf = requestAnimationFrame(step);
    }

    function step(t) {
      var activeInstancesLength = activeInstances.length;

      if (activeInstancesLength) {
        var i = 0;

        while (i < activeInstancesLength) {
          var activeInstance = activeInstances[i];

          if (!activeInstance.paused) {
            activeInstance.tick(t);
          } else {
            var instanceIndex = activeInstances.indexOf(activeInstance);

            if (instanceIndex > -1) {
              activeInstances.splice(instanceIndex, 1);
              activeInstancesLength = activeInstances.length;
            }
          }

          i++;
        }

        play();
      } else {
        raf = cancelAnimationFrame(raf);
      }
    }

    return play;
  }();

  function handleVisibilityChange() {
    if (document.hidden) {
      activeInstances.forEach(function (ins) {
        return ins.pause();
      });
      pausedInstances = activeInstances.slice(0);
      anime.running = activeInstances = [];
    } else {
      pausedInstances.forEach(function (ins) {
        return ins.play();
      });
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  } // Public Instance


  function anime(params) {
    if (params === void 0) params = {};
    var startTime = 0,
        lastTime = 0,
        now = 0;
    var children,
        childrenLength = 0;
    var resolve = null;

    function makePromise(instance) {
      var promise = window.Promise && new Promise(function (_resolve) {
        return resolve = _resolve;
      });
      instance.finished = promise;
      return promise;
    }

    var instance = createNewInstance(params);
    var promise = makePromise(instance);

    function toggleInstanceDirection() {
      var direction = instance.direction;

      if (direction !== 'alternate') {
        instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
      }

      instance.reversed = !instance.reversed;
      children.forEach(function (child) {
        return child.reversed = instance.reversed;
      });
    }

    function adjustTime(time) {
      return instance.reversed ? instance.duration - time : time;
    }

    function resetTime() {
      startTime = 0;
      lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
    }

    function seekChild(time, child) {
      if (child) {
        child.seek(time - child.timelineOffset);
      }
    }

    function syncInstanceChildren(time) {
      if (!instance.reversePlayback) {
        for (var i = 0; i < childrenLength; i++) {
          seekChild(time, children[i]);
        }
      } else {
        for (var i$1 = childrenLength; i$1--;) {
          seekChild(time, children[i$1]);
        }
      }
    }

    function setAnimationsProgress(insTime) {
      var i = 0;
      var animations = instance.animations;
      var animationsLength = animations.length;

      while (i < animationsLength) {
        var anim = animations[i];
        var animatable = anim.animatable;
        var tweens = anim.tweens;
        var tweenLength = tweens.length - 1;
        var tween = tweens[tweenLength]; // Only check for keyframes if there is more than one tween

        if (tweenLength) {
          tween = filterArray(tweens, function (t) {
            return insTime < t.end;
          })[0] || tween;
        }

        var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
        var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
        var strings = tween.to.strings;
        var round = tween.round;
        var numbers = [];
        var toNumbersLength = tween.to.numbers.length;
        var progress = void 0;

        for (var n = 0; n < toNumbersLength; n++) {
          var value = void 0;
          var toNumber = tween.to.numbers[n];
          var fromNumber = tween.from.numbers[n] || 0;

          if (!tween.isPath) {
            value = fromNumber + eased * (toNumber - fromNumber);
          } else {
            value = getPathProgress(tween.value, eased * toNumber);
          }

          if (round) {
            if (!(tween.isColor && n > 2)) {
              value = Math.round(value * round) / round;
            }
          }

          numbers.push(value);
        } // Manual Array.reduce for better performances


        var stringsLength = strings.length;

        if (!stringsLength) {
          progress = numbers[0];
        } else {
          progress = strings[0];

          for (var s = 0; s < stringsLength; s++) {
            var a = strings[s];
            var b = strings[s + 1];
            var n$1 = numbers[s];

            if (!isNaN(n$1)) {
              if (!b) {
                progress += n$1 + ' ';
              } else {
                progress += n$1 + b;
              }
            }
          }
        }

        setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
        anim.currentValue = progress;
        i++;
      }
    }

    function setCallback(cb) {
      if (instance[cb] && !instance.passThrough) {
        instance[cb](instance);
      }
    }

    function countIteration() {
      if (instance.remaining && instance.remaining !== true) {
        instance.remaining--;
      }
    }

    function setInstanceProgress(engineTime) {
      var insDuration = instance.duration;
      var insDelay = instance.delay;
      var insEndDelay = insDuration - instance.endDelay;
      var insTime = adjustTime(engineTime);
      instance.progress = minMax(insTime / insDuration * 100, 0, 100);
      instance.reversePlayback = insTime < instance.currentTime;

      if (children) {
        syncInstanceChildren(insTime);
      }

      if (!instance.began && instance.currentTime > 0) {
        instance.began = true;
        setCallback('begin');
      }

      if (!instance.loopBegan && instance.currentTime > 0) {
        instance.loopBegan = true;
        setCallback('loopBegin');
      }

      if (insTime <= insDelay && instance.currentTime !== 0) {
        setAnimationsProgress(0);
      }

      if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
        setAnimationsProgress(insDuration);
      }

      if (insTime > insDelay && insTime < insEndDelay) {
        if (!instance.changeBegan) {
          instance.changeBegan = true;
          instance.changeCompleted = false;
          setCallback('changeBegin');
        }

        setCallback('change');
        setAnimationsProgress(insTime);
      } else {
        if (instance.changeBegan) {
          instance.changeCompleted = true;
          instance.changeBegan = false;
          setCallback('changeComplete');
        }
      }

      instance.currentTime = minMax(insTime, 0, insDuration);

      if (instance.began) {
        setCallback('update');
      }

      if (engineTime >= insDuration) {
        lastTime = 0;
        countIteration();

        if (!instance.remaining) {
          instance.paused = true;

          if (!instance.completed) {
            instance.completed = true;
            setCallback('loopComplete');
            setCallback('complete');

            if (!instance.passThrough && 'Promise' in window) {
              resolve();
              promise = makePromise(instance);
            }
          }
        } else {
          startTime = now;
          setCallback('loopComplete');
          instance.loopBegan = false;

          if (instance.direction === 'alternate') {
            toggleInstanceDirection();
          }
        }
      }
    }

    instance.reset = function () {
      var direction = instance.direction;
      instance.passThrough = false;
      instance.currentTime = 0;
      instance.progress = 0;
      instance.paused = true;
      instance.began = false;
      instance.loopBegan = false;
      instance.changeBegan = false;
      instance.completed = false;
      instance.changeCompleted = false;
      instance.reversePlayback = false;
      instance.reversed = direction === 'reverse';
      instance.remaining = instance.loop;
      children = instance.children;
      childrenLength = children.length;

      for (var i = childrenLength; i--;) {
        instance.children[i].reset();
      }

      if (instance.reversed && instance.loop !== true || direction === 'alternate' && instance.loop === 1) {
        instance.remaining++;
      }

      setAnimationsProgress(instance.reversed ? instance.duration : 0);
    }; // Set Value helper


    instance.set = function (targets, properties) {
      setTargetsValue(targets, properties);
      return instance;
    };

    instance.tick = function (t) {
      now = t;

      if (!startTime) {
        startTime = now;
      }

      setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
    };

    instance.seek = function (time) {
      setInstanceProgress(adjustTime(time));
    };

    instance.pause = function () {
      instance.paused = true;
      resetTime();
    };

    instance.play = function () {
      if (!instance.paused) {
        return;
      }

      if (instance.completed) {
        instance.reset();
      }

      instance.paused = false;
      activeInstances.push(instance);
      resetTime();

      if (!raf) {
        engine();
      }
    };

    instance.reverse = function () {
      toggleInstanceDirection();
      instance.completed = instance.reversed ? false : true;
      resetTime();
    };

    instance.restart = function () {
      instance.reset();
      instance.play();
    };

    instance.reset();

    if (instance.autoplay) {
      instance.play();
    }

    return instance;
  } // Remove targets from animation


  function removeTargetsFromAnimations(targetsArray, animations) {
    for (var a = animations.length; a--;) {
      if (arrayContains(targetsArray, animations[a].animatable.target)) {
        animations.splice(a, 1);
      }
    }
  }

  function removeTargets(targets) {
    var targetsArray = parseTargets(targets);

    for (var i = activeInstances.length; i--;) {
      var instance = activeInstances[i];
      var animations = instance.animations;
      var children = instance.children;
      removeTargetsFromAnimations(targetsArray, animations);

      for (var c = children.length; c--;) {
        var child = children[c];
        var childAnimations = child.animations;
        removeTargetsFromAnimations(targetsArray, childAnimations);

        if (!childAnimations.length && !child.children.length) {
          children.splice(c, 1);
        }
      }

      if (!animations.length && !children.length) {
        instance.pause();
      }
    }
  } // Stagger helpers


  function stagger(val, params) {
    if (params === void 0) params = {};
    var direction = params.direction || 'normal';
    var easing = params.easing ? parseEasings(params.easing) : null;
    var grid = params.grid;
    var axis = params.axis;
    var fromIndex = params.from || 0;
    var fromFirst = fromIndex === 'first';
    var fromCenter = fromIndex === 'center';
    var fromLast = fromIndex === 'last';
    var isRange = is.arr(val);
    var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
    var val2 = isRange ? parseFloat(val[1]) : 0;
    var unit = getUnit(isRange ? val[1] : val) || 0;
    var start = params.start || 0 + (isRange ? val1 : 0);
    var values = [];
    var maxValue = 0;
    return function (el, i, t) {
      if (fromFirst) {
        fromIndex = 0;
      }

      if (fromCenter) {
        fromIndex = (t - 1) / 2;
      }

      if (fromLast) {
        fromIndex = t - 1;
      }

      if (!values.length) {
        for (var index = 0; index < t; index++) {
          if (!grid) {
            values.push(Math.abs(fromIndex - index));
          } else {
            var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
            var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
            var toX = index % grid[0];
            var toY = Math.floor(index / grid[0]);
            var distanceX = fromX - toX;
            var distanceY = fromY - toY;
            var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (axis === 'x') {
              value = -distanceX;
            }

            if (axis === 'y') {
              value = -distanceY;
            }

            values.push(value);
          }

          maxValue = Math.max.apply(Math, values);
        }

        if (easing) {
          values = values.map(function (val) {
            return easing(val / maxValue) * maxValue;
          });
        }

        if (direction === 'reverse') {
          values = values.map(function (val) {
            return axis ? val < 0 ? val * -1 : -val : Math.abs(maxValue - val);
          });
        }
      }

      var spacing = isRange ? (val2 - val1) / maxValue : val1;
      return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
    };
  } // Timeline


  function timeline(params) {
    if (params === void 0) params = {};
    var tl = anime(params);
    tl.duration = 0;

    tl.add = function (instanceParams, timelineOffset) {
      var tlIndex = activeInstances.indexOf(tl);
      var children = tl.children;

      if (tlIndex > -1) {
        activeInstances.splice(tlIndex, 1);
      }

      function passThrough(ins) {
        ins.passThrough = true;
      }

      for (var i = 0; i < children.length; i++) {
        passThrough(children[i]);
      }

      var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
      insParams.targets = insParams.targets || params.targets;
      var tlDuration = tl.duration;
      insParams.autoplay = false;
      insParams.direction = tl.direction;
      insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
      passThrough(tl);
      tl.seek(insParams.timelineOffset);
      var ins = anime(insParams);
      passThrough(ins);
      children.push(ins);
      var timings = getInstanceTimings(children, params);
      tl.delay = timings.delay;
      tl.endDelay = timings.endDelay;
      tl.duration = timings.duration;
      tl.seek(0);
      tl.reset();

      if (tl.autoplay) {
        tl.play();
      }

      return tl;
    };

    return tl;
  }

  anime.version = '3.2.0';
  anime.speed = 1;
  anime.running = activeInstances;
  anime.remove = removeTargets;
  anime.get = getOriginalTargetValue;
  anime.set = setTargetsValue;
  anime.convertPx = convertPxToUnit;
  anime.path = getPath;
  anime.setDashoffset = setDashoffset;
  anime.stagger = stagger;
  anime.timeline = timeline;
  anime.easing = parseEasings;
  anime.penner = penner;

  anime.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  (function () {
    var graph = document.querySelector('#bend-the-curve-graph'),
        curve = document.querySelector('.js-bending-curve'),
        checks = document.querySelectorAll('.js-puzzle-input'),
        flash = document.querySelector('.js-puzzle-flash');
    if (!graph || !config) return;
    var _config2 = config,
        flashMessages = _config2.flashMessages;

    var onCheckChange = function onCheckChange(ev) {
      var checked = [];
      var count = 0;

      for (var i = checks.length - 1, j = 0; i >= j; i--) {
        if (!checks[i].checked) {
          setFocus(checks[i].parentNode.querySelector('.js-puzzle-label'));
        } else {
          checked.push(i);
          count++;
        }
      }

      setFlash(count);
      setCurve(count, checked);
    };

    var setCurve = function setCurve(count) {
      var checked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      if (count > 0) addClass(graph, 'bend');else removeClass(graph, 'bend');
      if (count == 0) animateCurve(curve.getAttribute('data-d-off'));else if (count == 1) animateCurve(curve.getAttribute('data-d-start'));else if (count == 2 && contains(checked, 1)) animateCurve(curve.getAttribute('data-d-mida'));else if (count == 2 && contains(checked, 2)) animateCurve(curve.getAttribute('data-d-midb'));else animateCurve(curve.getAttribute('data-d-bend'));
    };

    var animateCurve = function animateCurve(_to) {
      return anime({
        targets: '.js-bending-curve',
        d: [curve.getAttribute('d'), _to],
        easing: 'easeOutQuad',
        duration: 500,
        loop: false
      });
    };

    var setFlash = function setFlash(count) {
      var active = flashMessages.filter(function (_f) {
        return _f.selected == count;
      })[0];

      if (active) {
        flash.querySelector('.js-puzzle-flash-message').innerText = active.text;
        removeClass(flash, 'inactive');
      } else {
        addClass(flash, 'inactive');
      }
    };

    var init = function init() {
      for (var i = 0, j = checks.length; i < j; i++) {
        listen(checks[i], 'change', onCheckChange);
      }

      setFlash(1);
    };

    onLoad(init);

    window.__puzzleInView = function () {
      setFocus(document.querySelector('.js-puzzle-input:not(:checked)+label'));
      setTimeout(function () {
        return setCurve(1);
      }, 800);
    };
  })();

  var Slider = function Slider(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.element = el;
    this.start = options.start || 0;
    this.step = options.step || 1;
    this.hasTooltip = options.tooltip == undefined ? true : options.tooltip;

    this.onChange = options.onChange || function (slider, value) {};

    addClass(this.element, 'slider');
    addClass(this.element, 'slider--init');
    this.input = this.addElement('input', {
      type: 'range',
      class: "slider__range",
      'aria-label': 'Percent of content animation',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': this.start,
      value: this.start,
      step: this.step,
      min: '0',
      max: '100'
    });
    this.slideWrap = this.addElement('div', {
      class: 'slider__slide-wrap'
    });
    this.slideBg = this.addElement('div', {
      class: "slider__background"
    }, this.slideWrap);
    this.slideFg = this.addElement('div', {
      class: "slider__foreground"
    }, this.slideWrap);
    this.slideHandle = this.addElement('div', {
      class: "slider__handle"
    }, this.slideWrap);

    if (this.hasTooltip) {
      this.tooltip = this.addElement('div', {
        class: "slider__tooltip"
      }, this.slideWrap);
      this.setTooltipText(options.tooltipText || "Tooltip");
    }

    this.initSlider();
  };

  Slider.prototype.initSlider = function () {
    addClass(this.element, 'slider--ready');
    this.move(0);
    this.addListeners();
  };

  Slider.prototype.move = function (percent) {
    this.slideHandle.style.left = "".concat(percent, "%");
    if (this.hasTooltip) this.tooltip.style.left = "".concat(percent, "%");
    this.slideFg.style.width = "".concat(percent, "%");
    this.input.setAttribute('aria-valuenow', this.input.value);
    this.onChange.apply(this.element, [this, percent]);
  };

  Slider.prototype.setValue = function (value) {
    var _value = value < 0 ? 0 : value > 100 ? 100 : value;

    this.input.value = _value;
    this.input.dispatchEvent(new Event('change'), {
      bubbles: true
    });
  };

  Slider.prototype.setTooltipText = function (text) {
    if (this.hasTooltip) this.tooltip.innerText = text;
  };

  Slider.prototype.addListeners = function () {
    listen(this.input, 'input', this.onChangeInput.bind(this));
    listen(this.input, 'change', this.onChangeInput.bind(this));
  };

  Slider.prototype.onChangeInput = function (ev) {
    return this.move(this.input.value);
  };

  Slider.prototype.addElement = function (type, options) {
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var el = document.createElement(type);
    Object.keys(options).forEach(function (key) {
      el.setAttribute(key, options[key]);
    });
    (parent || this.element).appendChild(el);
    return el;
  };

  (function () {
    var slider = document.querySelector('.js-drivers-slider');
    if (!slider) return;

    var __slider;

    var drivers = {
      indirect: document.querySelector('.driver--indirect'),
      pressures: document.querySelector('.driver--pressures'),
      direct: document.querySelector('.driver--direct'),
      bio: document.querySelector('.driver--biodiversity')
    };
    var arrows = {
      indirect: document.querySelector('.driver-arrow--indirect'),
      pressures: document.querySelector('.driver-arrow--pressures'),
      direct: document.querySelector('.driver-arrow--direct')
    };
    var icons = {
      indirect: document.querySelector('.driver-icons--indirect'),
      pressures: document.querySelector('.driver-icons--pressures'),
      direct: document.querySelector('.driver-icons--direct')
    };
    var opacity = {
      min: 0.4,
      max: 1
    };
    var height = {
      driverMin: 16.6667,
      driverMax: 28
    };
    height.bioMin = Math.round(100 - 3 * height.driverMin);
    height.bioMax = Math.round(100 - 3 * height.driverMax);
    var steps = [{
      start: 0,
      end: 20,
      callback: function callback(step, progress) {
        var o = calculateOpacity(step.start, step.end, progress);
        setOpacity(drivers.indirect, o);

        if (progress >= step.end) {
          addClass(icons.indirect, 'active');
          addClass(drivers.indirect, 'active');
        } else {
          removeClass(icons.indirect, 'active');
          removeClass(drivers.indirect, 'active');
        }
      }
    }, {
      start: 20,
      end: 40,
      callback: function callback(step, progress) {
        var o = calculateOpacity(step.start, step.end, progress);
        setOpacity(drivers.pressures, o);

        if (progress >= step.end) {
          addClass(icons.pressures, 'active');
          addClass(drivers.pressures, 'active');
        } else {
          removeClass(icons.pressures, 'active');
          removeClass(drivers.pressures, 'active');
        }
      }
    }, {
      start: 40,
      end: 60,
      callback: function callback(step, progress) {
        var o = calculateOpacity(step.start, step.end, progress);
        setOpacity(drivers.direct, o);
        if (progress >= step.end) addClass(icons.direct, 'active');else removeClass(icons.direct, 'active');
      }
    }, {
      start: 60,
      end: 100,
      callback: function callback(step, progress) {
        var driverHeight = calculateDriverHeight(step.start, step.end, progress);
        var bioHeight = calculateBioHeight(step.start, step.end, driverHeight, progress);
        drivers.indirect.style.flexBasis = "".concat(driverHeight, "%");
        drivers.pressures.style.flexBasis = "".concat(driverHeight, "%");
        drivers.direct.style.flexBasis = "".concat(driverHeight, "%");
        drivers.bio.style.flexBasis = "".concat(bioHeight, "%");
        positionArrows();
      }
    }];

    var calculateBioHeight = function calculateBioHeight(start, end, driverHeight, progress) {
      if (progress >= end) return height.bioMax;
      if (progress <= start) return height.bioMin;
      return Math.round(100 - 3 * driverHeight);
    };

    var calculateDriverHeight = function calculateDriverHeight(start, end, progress) {
      if (progress >= end) return height.driverMax;
      if (progress <= start) return height.driverMin;

      var length = end - start,
          position = progress - start,
          _progress = position / length; // decimal 0->1


      var heightLen = height.driverMax - height.driverMin,
          _height = height.driverMin + heightLen * _progress;

      return Math.round(_height * 100) / 100;
    };

    var calculateOpacity = function calculateOpacity(start, end, progress) {
      if (progress >= end) return opacity.max;
      if (progress <= start) return opacity.min;

      var length = end - start,
          position = progress - start,
          _progress = position / length; // decimal 0->1


      var opacityLen = opacity.max - opacity.min,
          _opacity = opacity.min + opacityLen * _progress;

      return Math.round(_opacity * 100) / 100; // 2dp
    };

    var setOpacity = function setOpacity(el, value) {
      el.style.opacity = value;
    };

    var positionArrows = function positionArrows() {
      ['indirect', 'pressures', 'direct'].forEach(function (driver) {
        positionArrow(driver, arrows[driver], drivers[driver], icons[driver]);
      });
    };

    var positionArrow = function positionArrow(driver, arrow, leftEl, rightEl) {
      var arrowLeft = leftEl.offsetTop + leftEl.clientHeight / 2,
          // - (arrow.clientHeight/2),
      arrowRight = rightEl.offsetTop + rightEl.clientHeight / 2;
      if (driver == 'indirect') arrowRight = rightEl.offsetTop + rightEl.clientHeight - 20;
      if (driver == 'direct') arrowRight = rightEl.offsetTop;
      var opp = arrowRight - arrowLeft,
          adj = arrow.clientWidth;
      var angleRads = Math.atan(opp / adj),
          angleDeg = Math.round(angleRads * (180 / Math.PI));
      arrow.style.top = "".concat(arrowLeft, "px");
      arrow.style.transform = "rotate(".concat(angleDeg, "deg)");
    };

    positionArrows();
    onResize(positionArrows);

    var setDrivers = function setDrivers(progress) {
      for (var i = 0, j = steps.length; i < j; i++) {
        steps[i].callback(steps[i], progress);
      }
    };

    var animation = null;
    var controls = document.querySelector('.js-driver-controls');

    var playFullScene = function playFullScene() {
      if (animation !== null) {
        removeClass(controls, 'paused');
        addClass(controls, 'playing');
        return animation.resume();
      }

      scrollTo('.js-drivers-column', 500, 10);
      addClass(controls, 'playing');
      animation = animate({
        duration: 3400,
        timing: easing.linear,
        draw: function draw(progress) {
          return __slider.setValue(Math.floor(100 * progress));
        },
        done: function done() {
          animation = null;
          removeClass(controls, 'playing');
          addClass(controls, 'done');
        }
      });
    };

    var pauseScene = function pauseScene() {
      if (animation !== null) {
        removeClass(controls, 'playing');
        addClass(controls, 'paused');
        animation.pause();
      }
    };

    var resetScene = function resetScene() {
      if (animation !== null) animation.dispose();
      removeClass(controls, 'done');
      removeClass(controls, 'paused');
      removeClass(controls, 'playing');

      __slider.setValue(0);

      animation = null;
    };

    var playButton = document.querySelector('.js-play-drivers-section'),
        pauseButton = document.querySelector('.js-pause-drivers-section'),
        resetButton = document.querySelector('.js-reset-drivers-section');
    listen(playButton, 'click', function (e) {
      return playFullScene();
    });
    listen(pauseButton, 'click', function (e) {
      return pauseScene();
    });
    listen(resetButton, 'click', function (e) {
      return resetScene();
    });
    __slider = new Slider(slider, {
      tooltip: false,
      onChange: function onChange(slider, value) {
        setDrivers(value);
      }
    });
  })();

  (function () {
    var landscape = document.querySelector('.js-landscape-illustration');
    var slider = document.querySelector('.js-slider.landscape-slider');
    if (!landscape) return;

    var __slider; // let tooltips = [{
    //   position: 0,
    //   text: "The first tooltip"
    // }, {
    //   position: 20,
    //   text: "second"
    // }, {
    //   position: 40,
    //   text: "third"
    // }, {
    //   position: 60,
    //   text: "fourth"
    // }, {
    //   position: 80,
    //   text: "fifth"
    // }, {
    //   position: 100,
    //   text: "The end"
    // }];

    /*
    land-1, land-2, land-3, Water tower, land-6, Wheat, Trees
    */


    var scene = [{
      selector: '#land-1',
      fade: {
        start: 20,
        end: 40
      }
    }, {
      selector: '#land-2',
      fade: {
        start: 15,
        end: 30
      }
    }, {
      selector: '#land-3',
      fade: {
        start: 25,
        end: 50
      }
    }, {
      selector: '#land-6',
      fade: {
        start: 40,
        end: 60
      }
    }, {
      selector: '#water-tower',
      fade: {
        start: 60,
        end: 75
      }
    }, {
      selector: '#wheat',
      fade: {
        start: 0,
        end: 20
      }
    }, {
      selector: '#trees',
      fade: {
        start: 75,
        end: 95
      }
    }, {
      selector: '#insect-1',
      fade: {
        start: 0,
        end: 15
      }
    }, {
      selector: '#insect-2',
      fade: {
        start: 15,
        end: 30
      }
    }, {
      selector: '#insect-3',
      fade: {
        start: 30,
        end: 45
      }
    }, {
      selector: '#insect-4',
      fade: {
        start: 45,
        end: 60
      }
    }, {
      selector: '#insect-5',
      fade: {
        start: 60,
        end: 75
      }
    }, {
      selector: '#insect-6',
      fade: {
        start: 75,
        end: 90
      }
    }];

    var setScene = function setScene(progress) {
      var el, _s;

      for (var i = 0, j = scene.length; i < j; i++) {
        _s = scene[i];
        el = document.querySelector(_s.selector);
        var opacity = calculateOpacity(progress, _s.fade.start, _s.fade.end);
        el.style.opacity = opacity;
      }
    };

    var calculateOpacity = function calculateOpacity(progress, start, end) {
      if (progress <= start) return 1;
      if (progress >= end) return 0;
      var fadeLength = end - start,
          fadePosition = progress - start;
      return 1 - Math.round(fadePosition / fadeLength * 10) / 10;
    }; // const setTooltip = (slider, progress) => {
    //   for(let i = tooltips.length-1, j = 0; i >= j; i--) {
    //     if(progress >= tooltips[i].position) {
    //       slider.setTooltipText(tooltips[i].text);
    //       return;
    //     }
    //   }
    // };


    var animation = null;
    var controls = document.querySelector('.js-landscape-slider-controls');

    var playFullScene = function playFullScene() {
      if (animation !== null) {
        removeClass(controls, 'paused');
        addClass(controls, 'playing');
        return animation.resume();
      }

      addClass(controls, 'playing');
      animation = animate({
        duration: 4200,
        timing: easing.linear,
        draw: function draw(progress) {
          return __slider.setValue(Math.floor(100 * progress * 10) / 10);
        },
        done: function done() {
          animation = null;
          removeClass(controls, 'playing');
          addClass(controls, 'done');
        }
      });
    };

    var pauseScene = function pauseScene() {
      if (animation !== null) {
        removeClass(controls, 'playing');
        addClass(controls, 'paused');
        animation.pause();
      }
    };

    var resetScene = function resetScene() {
      if (animation !== null) animation.dispose();
      removeClass(controls, 'done');
      removeClass(controls, 'paused');
      removeClass(controls, 'playing');

      __slider.setValue(0);

      animation = null;
    };

    var playButton = document.querySelector('.js-play-landscape-section'),
        pauseButton = document.querySelector('.js-pause-landscape-section'),
        resetButton = document.querySelector('.js-reset-landscape-section');
    listen(playButton, 'click', function (e) {
      return playFullScene();
    });
    listen(pauseButton, 'click', function (e) {
      return pauseScene();
    });
    listen(resetButton, 'click', function (e) {
      return resetScene();
    });
    var updateFunc = window.requestAnimationFrame || window.setTimeout;

    var performUpdate = function performUpdate(_slider, _value) {
      setScene(_value); // setTooltip(_slider, _value);
    };

    __slider = new Slider(slider, {
      // tooltipText: tooltips[0].text,
      tooltip: false,
      step: 0.1,
      onChange: function onChange(s, v) {
        return updateFunc(function () {
          return performUpdate(s, v);
        });
      }
    });
  })();

  (function () {
    var channels = {
      facebook: function facebook(url, message) {
        return "http://www.facebook.com/sharer/sharer.php?u=".concat(url, "&quote=").concat(message);
      },
      twitter: function twitter(url, message) {
        return "http://twitter.com/share?url=".concat(url, "&text=").concat(message);
      },
      linkedin: function linkedin(url, message) {
        return "https://www.linkedin.com/shareArticle?url=".concat(url, "&summary=").concat(message);
      },
      whatsapp: function whatsapp(url, message) {
        return "https://wa.me/?text=".concat(message, "%20").concat(url);
      }
    };

    var getChannelUrl = function getChannelUrl(channel, url, message) {
      var _url = encodeURIComponent(url),
          _message = encodeURIComponent(message.trim());

      return channels[channel](_url, _message);
    };

    var da = function da(el, attribute) {
      var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      if (el.hasAttribute("data-social-".concat(attribute))) return el.getAttribute("data-social-".concat(attribute));
      if (el.closest('.share-container').hasAttribute("data-social-".concat(attribute))) return el.closest('.share-container').getAttribute("data-social-".concat(attribute));
      return def;
    };

    var onClickShareLink = function onClickShareLink(_target) {
      var channel = da(_target, 'channel', null),
          section = da(_target, 'section', ""),
          message = da(_target, 'message', "");
      var shareUrl = "".concat(window.location.href),
          targetUrl = getChannelUrl(channel, shareUrl, message);

      window.___triggerEvent({
        action: 'Share',
        category: 'Social share',
        label: "".concat(section, " - ").concat(channel)
      });

      if (channel == "whatsapp") return _target.setAttribute('href', targetUrl);
      return window.open(targetUrl, "popup", "width=500,height=400");
    };

    var initShareLinks = function initShareLinks() {
      listen(document, 'click', function (e) {
        var currentNode = e.target;
        if (e.target && e.target.nodeName && e.target.nodeName.toLowerCase() == 'div') return false; // bail on traversing the document if we hit a div element

        while (true) {
          // search parents to find out if we've clicked a share link
          if (currentNode.matches('[data-social]')) {
            return onClickShareLink(currentNode);
          } else if (currentNode != e.currentTarget && currentNode != document.body && currentNode.nodeName && currentNode.nodeName.toLowerCase() != 'div') {
            currentNode = currentNode.parentNode;
          } else {
            return false;
          }
        }
      });
    };

    onLoad(initShareLinks);
  })();

  (function () {
    var scrollEffects = {
      fadein: function fadein(element) {
        return element.setAttribute("data-visible", "true");
      },
      fadeinup: function fadeinup(element) {
        return element.setAttribute("data-visible", "true");
      },
      fadeindown: function fadeindown(element) {
        return element.setAttribute("data-visible", "true");
      },
      fadeinleft: function fadeinleft(element) {
        return element.setAttribute("data-visible", "true");
      },
      fadeinright: function fadeinright(element) {
        return element.setAttribute("data-visible", "true");
      },
      popin: function popin(element) {
        return element.setAttribute("data-visible", "true");
      },
      runner: function runner(element) {
        return window[element.getAttribute('data-scroll-function')].call(element);
      },
      visibleclass: function visibleclass(element) {
        return addClass(element, 'in-view');
      }
    };
    var scrollElements = [];

    var setupElements = function setupElements() {
      scrollElements = document.querySelectorAll("[data-scroll-effect]");
    };

    var cleanElements = function cleanElements() {
      scrollElements = Array.prototype.filter.call(scrollElements, function (el) {
        return el.hasAttribute('data-scroll-effect');
      });
    };

    var checkEffects = function checkEffects() {
      var element, funcs, threshold;

      for (var i = 0, j = scrollElements.length; i < j; i++) {
        element = scrollElements[i];
        threshold = element.getAttribute('data-scroll-threshold');

        if (inView(element, threshold)) {
          funcs = element.getAttribute("data-scroll-effect").split("|");

          for (var k = 0, l = funcs.length; k < l; k++) {
            scrollEffects[funcs[k]](element);
          }

          element.removeAttribute("data-scroll-effect");
        }
      }

      cleanElements();
    };

    if (typeof am4core === 'undefined') {
      onLoad(setupElements);
      onLoad(checkEffects);
    } else {
      am4core.ready(function () {
        setupElements();
        checkEffects();
      });
    }

    onScroll(checkEffects);
    onResize(checkEffects);
  })();
})();