window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        if (document.getElementById("masthead"))
            document.getElementById("masthead").classList.add("fixed");
    } else {
        if (document.getElementById("masthead"))
            document.getElementById("masthead").classList.remove("fixed");
    }
}

function abcd_1() {
    var $frame1 = $('.nonprofit-scroll');

    setTimeout(function(frame) {
        frame.sly('reload');
    }, 500, $frame1);
}

function zxcv_2() {
    var $frame2 = $('.project-scroll');

    setTimeout(function(frame) {
        frame.sly('reload');
    }, 500, $frame2);
}

jQuery(function ($) {

    $(function() {
        $('.lazy').lazy();
    });

	jQuery('a[href*="#"]')

		.not('[href="#"]')
		.not('[href="#contact-form"]')
		.click(function (event) {

			if ( location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
				&& location.hostname == this.hostname ) {
				// Figure out element to scroll to
				var target = jQuery(this.hash);
				target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
                if (target.length) {

					event.preventDefault();

                    jQuery('html, body').animate({
						scrollTop: target.offset().top

					}, 1000, function () {

						var jQuerytarget = jQuery(target);
						jQuerytarget.focus();
						if (jQuerytarget.is(":focus")) {
							return false;
						} else {
							jQuerytarget.attr('tabindex', '-1');
							jQuerytarget.focus();
						}
					});
                }
			}
        });
});

function renderDiscoverContentSlick() {
    $('.main-discover-content').slick({
		centerMode: true,
		centerPadding: '15px',
		slidesToShow: 1,
		arrows: false,
		dots: true,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 767,
				settings: "unslick"
			},
		]
	});
}

function renderParallaxWindow() {
    var scene = document.querySelector('.parallax-window');
    var parallaxInstance = new Parallax(scene);
    parallaxInstance.friction(0.1, 0.1);

    AOS.init({
    	disable: 'tablet',
    	duration: 1200,
    	once: true,
    	disableMutationObserver: true,
    });

    jQuery(window).on('load', function () {
    	AOS.refresh();
    });
}

$(window).resize(function(e) {
    var $frame1 = $('.nonprofit-scroll');
    var $frame2 = $('.project-scroll');
    var $frame3 = $('.faq-scroll');
    
    setTimeout(function(frame1, frame2, frame3) {
        frame1.sly('reload');
        frame2.sly('reload');
        frame3.sly('reload');
    }, 500, $frame1, $frame2, $frame3);
});

window.renderNonprofitScroll = function() {
    var $frame1 = $('.nonprofit-scroll');
    
    $frame1.sly({
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateMiddle: 1,
        activateOn: 'click',
        mouseDragging: 0,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $('.nonprofit-scrollbar'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
		// cycleBy: 'items',
		// cycleInterval: 2500,
		// pauseOnHover: 1,
        next: $('.nonprofit-scroll-next')
    });

    setTimeout(function(frame) {
        frame.sly('reload');
    }, 200, $frame1);
}

window.renderProjectScroll = function() {
    var $frame2 = $('.project-scroll');
    
    $frame2.sly({
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateMiddle: 1,
        activateOn: 'click',
        mouseDragging: 0,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $('.project-scrollbar'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
		// cycleBy: 'items',
		// cycleInterval: 3000,
		// pauseOnHover: 1,
        next: $('.project-scroll-next')
    });

    setTimeout(function(frame) {
        frame.sly('reload');
    }, 200, $frame2);
}

function renderFaqScroll() {
    var $frame3 = $('.faq-scroll');
    var $wrap3  = $frame3.parent();

    $frame3.sly({
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateMiddle: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $wrap3.find('.scrollbar'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
        next: $wrap3.find('.next')
    });

    $frame3.sly('reload');
}

function renderViewMore() {
	var moreSToggleNPF = $('.content-list-section .content-list-section__content .hide-content');
	moreSToggleNPF.click(function () {
		var th = $(this);
		th.toggleClass('on');
		if (th.hasClass('on')) {
			th.siblings('.content-list-section__text').removeClass('off');
			th.children('.more').hide().siblings('.less').show();
		} else {
			th.siblings('.content-list-section__text').addClass('off');
			th.children('.less').hide().siblings('.more').show();
		}
	});
}

function renderReadMore() {
	var moreSToggle = $('.learn-more-section .learn-more-section__content .hide-content');
	moreSToggle.click(function () {
		var th = $(this);
		th.toggleClass('on');
		if (th.hasClass('on')) {
			th.siblings('.learn-more-section__text').removeClass('off');
			th.children('.more').hide().siblings('.less').show();
		} else {
			th.siblings('.learn-more-section__text').addClass('off');
			th.children('.less').hide().siblings('.more').show();
		}
	});
}