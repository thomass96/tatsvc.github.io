(function() {

	var stickyNavTop = $('.sticky-nav').offset().top; 
	var support = { animations : Modernizr.cssanimations },
		container = document.getElementById( 'ip-container' ),
		header = container.querySelector( 'header.ip-header' ),
		loader = new PathLoader( document.getElementById( 'ip-loader-circle' ) ),
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];


	var bodyEl = document.body,
		content = document.querySelector( '.page-container' ),
		openbtn = document.getElementById( 'open-button' ),
		closebtn = document.getElementById( 'close-button' ),
		isOpen = false,

		morphEl = document.getElementById( 'morph-shape' ),
		s = Snap( morphEl.querySelector( 'svg' ) );
		path = s.select( 'path' );
		initialPath = this.path.attr('d'),
		pathOpen = morphEl.getAttribute( 'data-morph-open' ),
		isAnimating = false;

	function init() {
		var onEndInitialAnimation = function() {
			if( support.animations ) {
				this.removeEventListener( animEndEventName, onEndInitialAnimation );
			}

			startLoading();
		};

		// disable scrolling
		window.addEventListener( 'scroll', noscroll );

		// initial animation
		classie.add( container, 'loading' );

		if( support.animations ) {
			container.addEventListener( animEndEventName, onEndInitialAnimation );
		}
		else {
			onEndInitialAnimation();
		}

		initEvents();
		loadGrid();
		// stickyNav();
	}


	function stickyNav(){    
		console.log ('stickyNav');
	  var scrollTop = $(window).scrollTop();
	  var windowWidth = $(window).innerWidth();
	  if (windowWidth > 640) {
	    if (scrollTop > stickyNavTop) {   
	      $('.sticky-nav').addClass('sticky');  
	      $('.sticky-nav + .content-wrap').css("margin-top", "174px");  
	    } else {  
	      $('.sticky-nav').removeClass('sticky');    
	      $('.sticky-nav + .content-wrap').css("margin-top", "0px"); 
	    }  
	  }
	};  
	
	// $(window).scroll(function() {  
 //      stickyNav();  
	// });

	function startLoading() {
		// simulate loading something..
		var simulationFn = function(instance) {
			var progress = 0,
				interval = setInterval( function() {
					progress = Math.min( progress + Math.random() * 0.1, 1 );
					instance.setProgress( progress );

					// reached the end
					if( progress === 1 ) {
						classie.remove( container, 'loading' );
						classie.add( container, 'loaded' );
						clearInterval( interval );

						var onEndHeaderAnimation = function(ev) {
							if( support.animations ) {
								if( ev.target !== header ) return;
								this.removeEventListener( animEndEventName, onEndHeaderAnimation );
							}

							classie.add( document.body, 'layout-switch' );
							window.removeEventListener( 'scroll', noscroll );
						};

						if( support.animations ) {
							header.addEventListener( animEndEventName, onEndHeaderAnimation );
						}
						else {
							onEndHeaderAnimation();
						}
					}
				}, 70 );
		};

		loader.setProgressFn( simulationFn );
	}
	
	function noscroll() {
		window.scrollTo( 0, 0 );
	}


	function initEvents() {
		openbtn.addEventListener( 'click', toggleMenu );
		if( closebtn ) {
			closebtn.addEventListener( 'click', toggleMenu );
		}

		// close the menu element if the target it´s not the menu element or one of its descendants..
		content.addEventListener( 'click', function(ev) {
			var target = ev.target;
			if( isOpen && target !== openbtn ) {
				toggleMenu();
			}
		} );
	}


	function toggleMenu() {
		if( isAnimating ) return false;
		isAnimating = true;
		if( isOpen ) {
			classie.remove( bodyEl, 'show-menu' );
			// animate path
			setTimeout( function() {
				// reset path
				path.attr( 'd', initialPath );
				isAnimating = false; 
			}, 300 );
		}
		else {
			classie.add( bodyEl, 'show-menu' );
			// animate path
			path.animate( { 'path' : pathOpen }, 400, mina.easeinout, function() { isAnimating = false; } );
		}
		isOpen = !isOpen;
	}

	function loadGrid() {
				[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {	
					new SelectFx(el, {
						stickyPlaceholder: false,
						onChange: function(val){
							var img = document.createElement('img');
							img.src = 'img/'+val+'.png';
							// img.onload = function() {
								// document.querySelector('span.cs-placeholder').style.backgroundImage = 'url(img/'+val+'.png)';
							// };
						}
					});
				} );
			}

	init();

})();