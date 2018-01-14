
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'animate-scroll';

  function tlAboutOnStart(){

  }

 	function tlLoginOnStart(){
  
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.tlAbout = new window.TimelineLite({
    	onStart: tlAboutOnStart
    });
    this.tlLogin = new window.TimelineLite({
    	onStart: tlLoginOnStart
    });
    this.tlBlogs = new window.TimelineLite();
    this.tlCreate = new window.TimelineLite();
    this.tlWelcome = new window.TimelineLite();
    this.init();
  }

  function creatPagination(that) {
    if(that.vars.slides.length) {
      var active = '',
          pagination = '<ul class="animate-scroll-pagination" data-pagination>' +
                       '<li class="animate-scroll-pagination__table">' +
                       '<ul class="animate-scroll-pagination__table-cell">';

      that.vars.slides.each(function(){
        var self = $(this),
            index = self.data('index');

        if(index === that.vars.current) {
          active = 'animate-scroll-pagination__item--active';
        } else {
          active = '';
        }

        pagination = pagination + '<li class="animate-scroll-pagination__item '+ active +'" data-index="'+ index +'" data-pagination-item></li>';
      });

      pagination = pagination + '</ul></li></ul>';

      that.element.append(pagination);
    }
  }

  function completeAnimateSlideTo(index, that) {
    // update current slide
    var indexStart = that.vars.current;

    that.vars.current = index;

    // update pagination
    that.element.find('[data-pagination-item]').removeClass('animate-scroll-pagination__item--active');
    that.element.find('[data-pagination-item]').each(function(){
      var self = $(this);

      if(self.data('index') === index) {
        self.addClass('animate-scroll-pagination__item--active');
      }
    });

    // update z-index
    that.vars.slides.each(function(){
      var slide = $(this);

      if(slide.data('index') !== index) {
        slide.css({'z-index': 0});
      } else {
        slide.css({'z-index': that.vars.length});
      }
    });

    // update is scroll
    that.vars.isScroll = false;

    // kill current animate
    switch(indexStart) {
    	case 1:
    		that.tlLogin.reverse();
    		break;
  		case 2:
    		that.tlAbout.reverse();
    		break;
			case 3:
    		that.tlBlogs.reverse();
    		break;
  		case 5:
    		that.tlCreate.reverse();
    		break;
  		case 6:
    		that.tlWelcome.reverse();
    		break;
    }

    // animate frame
    switch(index) {
    	case 1:
    		that.tlLogin.play();
    		break;
  		case 2:
    		that.tlAbout.play();
    		break;
			case 3:
    		that.tlBlogs.play();
    		break;
  		case 5:
    		that.tlCreate.play();
    		break;
  		case 6:
    		that.tlWelcome.play();
    		break;
    }
  }

  function animateSlideTo(eleFrom, eleTo, index, action, that) {
    if(action === 'next') {
      eleTo.css({'z-index': that.vars.length - 1, 'top': '0px'});
      window.TweenMax.to(eleFrom, 0.8, {top: '-100%',  ease: window.Power2.easeIn, onComplete: completeAnimateSlideTo, onCompleteParams: [index, that]});
    } else {
      eleTo.css({'z-index': that.vars.length + 1, 'top': '-100%'});
      window.TweenMax.to(eleTo, 0.8, {top: '0px',  ease: window.Power2.easeIn, onComplete: completeAnimateSlideTo, onCompleteParams: [index, that]});
    }
  }

  function slideTo(index, that) {
    if(index <= that.vars.length && index > 0 && !that.vars.isScroll) {
      that.vars.isScroll = true;

      var ele = that.element,
          slideCurrent = ele.find('[data-index="'+ that.vars.current +'"]'),
          slideTo = ele.find('[data-index="'+ index +'"]'),
          action = '';

      // detect up or down
      if(that.vars.current < index) {
        // slide next
        action = 'next';
      } else {
        // slide prev
        action = 'prev';
      }

      // animate slide to
      animateSlideTo(slideCurrent, slideTo, index, action, that);
    }
  }

  function onInit(that) {
    that.vars.slides.each(function(){
      var self = $(this),
          zIndex = 0,
          index = self.data('index');

      if(index === that.vars.current) {
        zIndex = that.vars.length;
      } else {
        zIndex = 0;
      }

      self.css({'z-index': zIndex});
      that.tlLogin.restart();
    });
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          ele = that.element;

      that.vars = {
        slides: ele.find('[data-section]'),
        length: ele.find('[data-section]').length,
        current: 1,
        isScroll: false
      };

      // create pagination
      creatPagination(that);

      // animate first time
      onInit(that);

      // scroll event
      ele.on('mousewheel', function(event) {
        var index = that.vars.current;

        if(event.deltaX > event.deltaY) {
          // scroll down
          index = index + 1;
        } else {
          // scrol up
          index = index - 1;
        }

        slideTo(index, that);
      });

      // click on pagination
      ele.on('click.' + pluginName, '[data-pagination-item]', function(){
        slideTo($(this).data('index'), that);
      });

      // init animate
      that.tlLogin.to($('.section--login .section__inner'), 0.5, {top: 0, opacity: 1})
      						.to($('.section--login'), 0.5, {'padding-bottom': 45}, 1);
      	
      that.tlAbout.staggerTo($('.header .account__btn'), 0.5, {left: 0, opacity: 1}, 0.3, 'layer-1')
    							.from($('.icon-about--0'), 0.5, {scale: 0, opacity: 0})
      						.from($('.icon-about--6'), 1, {opacity: 0, top: 122, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--13'), 1, {opacity: 0, left: 416, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--16'), 1, {opacity: 0, left: 104, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--18'), 1, {opacity: 0, top: 381, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--5'), 1, {opacity: 0, top: 109, left: 173, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--8'), 1, {opacity: 0, top: 85, left: 401, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--17'), 1, {opacity: 0, top: 402, left: 163, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--19'), 1, {opacity: 0, top: 378, left: 420, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--7'), 1, {opacity: 0, top: 60, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--12'), 1, {opacity: 0, left: 83, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--1'), 1.5, {opacity: 0, top: -62, left: 63, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--4'), 1.5, {opacity: 0, top: 22, left: -20, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--11'), 1.5, {opacity: 0, left: -60, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--15'), 1.5, {opacity: 0, top: 350, left: -20, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--21'), 1.5, {opacity: 0, top: 453, left: 44, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--22'), 1.5, {opacity: 0, top: 464, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--23'), 1.5, {opacity: 0, top: 486, left: 435, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--24'), 1.5, {opacity: 0, top: 436, left: 502, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--20'), 1.5, {opacity: 0, top: 377, left: 574, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--14'), 1.5, {opacity: 0, left: 585, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--10'), 1.5, {opacity: 0, top: 82, left: 594, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--9'), 1.5, {opacity: 0, top: 31, left: 553, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--3'), 1.5, {opacity: 0, top: -30, left: 483, ease: window.Power4.easeOut}, 'layer-1')
      						.from($('.icon-about--2'), 1.5, {opacity: 0, top: -62, left: 385, ease: window.Power4.easeOut}, 'layer-1');
      that.tlAbout.pause();

      that.tlBlogs.staggerTo($('.section--blogs .list .item__inner'), 0.3, {left: 0, opacity: 1}, 0.2);
      that.tlBlogs.pause();
      that.tlCreate.staggerTo($('.section--create .cate'), 0.2, {scale: 1, opacity: 1}, 0.1);
      that.tlCreate.pause();
      that.tlWelcome.to($('.section--welcome .section__title'), 0.3, {top: 0, opacity: 1})
      							.to($('.section--welcome .section__desc'), 0.3, {top: 0, opacity: 1})
      							.staggerTo($('.section--welcome .about__item'), 0.3, {scale: 1, opacity: 1}, 0.3);
      that.tlWelcome.pause();
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'display';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        ele = that.element,
        eleTarget = $(ele.data('target'));

	    ele.on('focus.' + pluginName, function(){
	      if(eleTarget.length) {
	      	eleTarget.stop().fadeIn();
	      }
	    });

      $(document).click(function(e) { 
		    // if the target of the click isn't the container nor a descendant of the container
		    if (!eleTarget.is(e.target) && eleTarget.has(e.target).length === 0 && !ele.is(e.target) && ele.has(e.target).length === 0) 
		    {
		        eleTarget.stop().fadeOut();
		    }
			});
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'popup';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        ele = that.element,
      	eleTarget = $(ele.data('target'));

      ele.on('click.' + pluginName, function(){
      	if(eleTarget.length) {
      		eleTarget.fadeIn();

      		$('html, body').addClass('overflow-hidden');
      	}
      });

      eleTarget.find('[data-over]').on('click.' + pluginName, function(e){
      	if (e.target === this){
      		eleTarget.fadeOut();
      		$('html, body').removeClass('overflow-hidden');
      	}
      });
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'scroll-header';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
      		options = that.options,
        	ele = that.element,
        	scroll,
        	win = $(window);

    	scroll = win.scrollTop();
    	if(scroll > 0) {
    		ele.addClass(options.class);
    	} else {
    		ele.removeClass(options.class);
    	}

      win.scroll(function(){
      	scroll = $(this).scrollTop();
      	if(scroll > 0) {
      		ele.addClass(options.class);
      	} else {
      		ele.removeClass(options.class);
      	}
      });
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
  	type: '',
  	class: ''
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'swiper-multi-row-slider';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
      		ele = that.element;

      that.vars = {
        swiper: null
      };

      that.vars.swiper = new window.Swiper('[data-swiper-multi-row-slider]', {
      	slidesPerView: 4,
        slidesPerColumn: 2,
        speed: 1000,
        nextButton: ele.closest('[data-wrap-swiper-multi-row-slider]').find('[data-next]'),
        prevButton: ele.closest('[data-wrap-swiper-multi-row-slider]').find('[data-prev]')
      });
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']').on('customEvent', function() {
      // to do
    });

    $('[data-' + pluginName + ']')[pluginName]({
      key: 'custom'
    });
  });

}(jQuery, window));

;(function($, window, undefined) {
  'use strict';

  var pluginName = 'swiper-slider';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
      		ele = that.element;

      that.vars = {
        swiper: null
      };

      that.vars.swiper = new window.Swiper('[data-swiper-slider]', {
      	slidesPerView: ele.data('item') ? ele.data('item') : 4,
        paginationClickable: true,
        spaceBetween: 20,
        speed: 1000,
        nextButton: ele.closest('[data-wrap-swiper-slider]').find('[data-next]'),
        prevButton: ele.closest('[data-wrap-swiper-slider]').find('[data-prev]')
      });
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {};

  $(function() {
    $('[data-' + pluginName + ']').on('customEvent', function() {
      // to do
    });

    $('[data-' + pluginName + ']')[pluginName]({
      key: 'custom'
    });
  });

}(jQuery, window));
