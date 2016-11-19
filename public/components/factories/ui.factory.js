'use strict';

angular.module('app').factory('ui', () => {
	let toggleClass = (blockId, classForToggle, delay = 1) => {
		setTimeout(() => {
			let block = document.getElementById(blockId);
			block.classList.toggle(classForToggle);
		}, delay);
	}

	let toggleMenu = () => {
		toggleClass('nav-menu', 'nav-menu_active');
		$('.changeable-onMenuOpen').toggleClass('moveLeft-onMenuOpen');
	}

	let scrollTo = (target, time) => {
	    if(!time) time = 300;
	    target = "#" + target;
	    $('html, body').animate({scrollTop: $(target).offset().top}, time);
	    return false;
	}

	let Slider = {
		constructor: (slides) => {
			this.slides = slides;
			this.config = {
				sliderWidth: (this.slides.length * 100) + '%',
				slideWidth: (100 / this.slides.length) + '%',
				periodToNext: 7000,
				duration: 1000
			};
			this.render = () => {
				$(document).ready(() => {
					let homeSlider = $('.homeSlider');
					let sliderItem = $('.homeSlider-item');
					homeSlider.css('width', this.config.sliderWidth);
					sliderItem.css('width', this.config.slideWidth);
				});
			};
			this.slideNumber = 0;
			this.slide = () => {
				let homeSlider = $('.homeSlider');
				let left = '-=100%';
				console.log(this.slideNumber);
				this.slideNumber++;
				if(this.slideNumber === this.slides.length) {
					this.slideNumber = 0;
					left = 0;
				}
				homeSlider.animate({
					'left': left
				}, this.config.duration, 'easeOutCubic');
			};
			this.run = () => {
				this.render();
				setInterval(() => {
					this.slide();
				}, this.config.periodToNext);
			};
			return this;
		}
	};

	return {
		toggleClass: toggleClass,
		toggleMenu: toggleMenu,
		scrollTo: scrollTo,
		Slider: Slider
	}
});