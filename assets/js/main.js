/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

})(jQuery);

/* ========================================== */
/* Custom Sticky Nav Observer & Panel Fix     */
/* ========================================== */
(function($) {
    $(function() {
        var $window = $(window),
            $nav = $('#nav'),
            $body = $('body');

        if ($nav.length > 0) {
            // Listen to BOTH scroll and resize events
            $window.on('scroll resize', function() {
                var navBottom = $nav.offset().top + $nav.outerHeight();
                var isDesktop = $window.width() > 980;

                // 1. DESKTOP BEHAVIOR (> 980px)
                if (isDesktop) {
                    if ($window.scrollTop() > navBottom) {
                        $body.addClass('is-nav-scrolled');
                        
                        var $navPanel = $('#navPanel');
                        
                        // Check if panel exists and hasn't been populated by our script yet
                        if ($navPanel.length > 0 && !$navPanel.hasClass('desktop-populated')) {
                            
                            // Clone and tag our custom elements so we can track them
                            var $clonedLinks = $nav.find('.links').clone().addClass('custom-desktop-clone');
                            var $clonedIcons = $nav.find('.icons').clone().addClass('custom-desktop-clone');
                            
                            // FIX: Kept the top margin for spacing, but removed the centering 
                            // so it naturally aligns to the left like the mobile version.
                            $clonedIcons.css({
                                'margin-top': '2rem'
                            });

                            $navPanel.children('nav').append($clonedLinks);
                            $navPanel.children('nav').append($clonedIcons);
                            
                            // Mark as populated
                            $navPanel.addClass('desktop-populated');
                        }
                    } else {
                        $body.removeClass('is-nav-scrolled');
                    }
                } 
                // 2. MOBILE BEHAVIOR (<= 980px)
                else {
                    // Remove our custom trigger class so the native template styling takes over
                    $body.removeClass('is-nav-scrolled');
                    
                    var $navPanel = $('#navPanel');
                    
                    // If our script previously added custom links, remove them to prevent duplication
                    if ($navPanel.length > 0 && $navPanel.hasClass('desktop-populated')) {
                        $navPanel.find('.custom-desktop-clone').remove();
                        $navPanel.removeClass('desktop-populated');
                    }
                }
            });
            
            $window.trigger('scroll');
        }
    });
})(jQuery);

/* ========================================== */
/* Video Hover Play/Reset Logic               */
/* ========================================== */
(function($) {
	$(function() {
		// When the mouse enters the project card
		$('.project-card').on('mouseenter', function() {
			var video = $(this).find('video.gif-img').get(0);
			if (video) {
				// KILL ANY PENDING PAUSE TIMERS
				if (video.pauseTimeout) {
					clearTimeout(video.pauseTimeout);
					video.pauseTimeout = null;
				}
				
				// Reset the video to frame 0 and play
				video.currentTime = 0;
				var playPromise = video.play();
				
				// Safely handle browser autoplay promises to prevent console errors
				if (playPromise !== undefined) {
					playPromise.catch(function(error) {
						console.log("Video play interrupted safely.");
					});
				}
			}
		});

		// When the mouse leaves the project card
		$('.project-card').on('mouseleave', function() {
			var video = $(this).find('video.gif-img').get(0);
			if (video) {
				// STORE THE TIMER ON THE VIDEO ITSELF
				video.pauseTimeout = setTimeout(function() {
					video.pause();
				}, 500);
			}
		});
	});
})(jQuery);

/* ========================================== */
/* Screenshot Carousel Mouse Drag Logic       */
/* ========================================== */
const carousel = document.querySelector('.screenshot-carousel');
if (carousel) {
	let isDown = false;
	let startX;
	let scrollLeft;

	carousel.addEventListener('mousedown', (e) => {
		isDown = true;
		carousel.classList.add('is-dragging');
		startX = e.pageX - carousel.offsetLeft;
		scrollLeft = carousel.scrollLeft;
	});

	carousel.addEventListener('mouseleave', () => {
		isDown = false;
		carousel.classList.remove('is-dragging');
	});

	carousel.addEventListener('mouseup', () => {
		isDown = false;
		carousel.classList.remove('is-dragging');
	});

	carousel.addEventListener('mousemove', (e) => {
		if (!isDown) return;
		e.preventDefault();
		const x = e.pageX - carousel.offsetLeft;
		const walk = (x - startX) * 2; // Multiplier makes the swipe feel faster
		carousel.scrollLeft = scrollLeft - walk;
	});
}