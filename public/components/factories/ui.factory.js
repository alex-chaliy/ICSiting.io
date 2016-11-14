'use strict';

angular.module('app').factory('ui', () => {
	let toggleClass = (blockId, classForToggle) => {
		let block = document.getElementById(blockId);
		block.classList.toggle(classForToggle);
	}
	let toggleMenu = () => {
		toggleClass('nav-menu', 'nav-menu_active');
		toggleClass('change-on-menu-open', 'move-left-on-menu-open');
	}

	let scrollTo = (target, time) => {
	    if(!time) time = 300;
	    target = "#" + target;
	    $('html, body').animate({scrollTop: $(target).offset().top}, time);
	    return false;
	}

	return {
		toggleClass: toggleClass,
		toggleMenu: toggleMenu,
		scrollTo: scrollTo
	}
});