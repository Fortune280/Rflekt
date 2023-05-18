        console.log("Running <landing.js>")
        const left = document.querySelector('.left');
		const right = document.querySelector('.right');
		const landingPage = document.querySelector('#landingPage');

		left.addEventListener('mouseenter', () => {
			landingPage.classList.add('hover-left')
		});

		left.addEventListener('mouseleave', () => {
			landingPage.classList.remove('hover-left')
		});

		right.addEventListener('mouseenter', () => {
			landingPage.classList.add('hover-right')
		});

		right.addEventListener('mouseleave', () => {
			landingPage.classList.remove('hover-right')
		});

		const head = document.querySelector('#header');
		const content = document.querySelector('#content');
		const b1 = document.querySelector('#about');
		const b2 = document.querySelector('#about1');
		const b3 = document.querySelector('#about2');

		b1.addEventListener('click', () => {
			head.innerHTML = "About Us";
			content.innerHTML = "This Application is developed by\nKhai Phung and Spencer Halsey, \nfounders of Fortune280 LLC.";
		});

		b2.addEventListener('click', () => {
			head.innerHTML = "Our Mission";
			content.innerHTML = `With our app Rflekt™ (patent pending) we hope to create a safe space for self discovery and growth for everyone.  Our app aims to be the preeminent self discovery help app on the web, helping everyone to “Reflect, Transform, Thrive”.`;
		});


		b3.addEventListener('click', () => {
			head.innerHTML = "Our App";
			content.innerHTML = `Rflekt is a self discovery website. It will provide the user a variety of information to help them understand themselves and plan their day`;
		});
