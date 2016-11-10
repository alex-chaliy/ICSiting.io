let toggleClass = (blockId, classForToggle) => {
	let block = document.getElementById(blockId);
	block.classList.toggle(classForToggle);
}

let slides = [
	{
		_id: 's1',
		title: 'ИКС',
		subtitle: 'Институт Компьютерных Систем',
		keyWordTitle: {
			text: 'Интеллект',
			color: '#ccff90'
		},
		btn: {
			text: 'Новости ИКСа',
			href: '/#/news',
			bgColor: '#64dd17'
		},
		bgImg: {
			url: '/uploads/img/img-7.jpg'
		}
	},
	{
		_id: 's2',
		title: 'ИКС',
		subtitle: 'Институт Компьютерных Систем',
		keyWordTitle: {
			text: 'Квалификация',
			color: '#f4ff81'
		},
		btn: {
			text: 'Найти одногрупника',
			href: '/#/users',
			bgColor: '#ffab00'
		},
		bgImg: {
			url: '/uploads/img/img-12.jpg'
		}
	},
	{
		_id: 's3',
		title: 'ИКС',
		subtitle: 'Институт Компьютерных Систем',
		keyWordTitle: {
			text: 'Совершенство',
			color: '#b9f6ca'
		},
		btn: {
			text: 'Новости в IT',
			href: '/#/news',
			bgColor: '#0091ea'
		},
		bgImg: {
			url: '/uploads/img/img-8.jpg'
		}
	},
];
let slider = {
	config: {
		sliderWidth: (slides.length * 100) + '%',
		slideWidth: (100 / slides.length) + '%',
		periodToNext: 4000,
		duration: 1000
	},
	render: () => {
		let homeSlider = $('.homeSlider');
		let sliderItem = $('.homeSlider-item');
		homeSlider.css('width', slider.config.sliderWidth);
		sliderItem.css('width', slider.config.slideWidth);
		slides.forEach((slide) => {
			let slideElement = $('#' + slide._id);
			slideElement.css('background-image', 'url(' + slide.bgImg.url + ')');
			slideElement.find('.homeSlider-title span').html(slide.title);
			slideElement.find('.homeSlider-subTitle span').html(slide.subtitle);

			slideElement.find('.homeSlider-keyWordTitle span').html(slide.keyWordTitle.text);
			slideElement.find('.homeSlider-keyWordTitle span').css('color', slide.keyWordTitle.color);

			slideElement.find('.homeSlider-btn span').html(slide.btn.text);
			slideElement.find('.homeSlider-btn').attr('href', slide.btn.href);
			slideElement.find('.homeSlider-btn').css('background-color', slide.btn.bgColor);
		});
	},
	slideNumber: 0,
	slide: () => {
		let homeSlider = $('.homeSlider');
		let left = '-=100%';
		console.log(slider.slideNumber);
		slider.slideNumber++;
		if(slider.slideNumber === slides.length) {
			slider.slideNumber = 0;
			left = 0;
		}
		//if ( currentPosition === '-' + slider.sliderWidth ) left = 0;
		homeSlider.animate({
			'left': left
		}, slider.config.duration);
	},
	run: () => {
		slider.render();
		setInterval(() => {
			slider.slide();
		}, slider.config.periodToNext);
	}
};

slider.run();