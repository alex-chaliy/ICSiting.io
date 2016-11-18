'use strict';

angular.module('app').factory('ui', () => {
	// init MaterializeCSS ui components
	$(document).ready(() => {
		$('.dropdown-button').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrain_width: false, // Does not change width of dropdown to that of the activator
			hover: true, // Activate on hover
			gutter: 0, // Spacing from edge
			belowOrigin: false, // Displays dropdown below the button
			alignment: 'left' // Displays dropdown with edge aligned to the left of button
			}
		);
	 });

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