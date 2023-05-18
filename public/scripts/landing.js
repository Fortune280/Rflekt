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

        function htmlToElement(html) {
            var template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }

		b1.addEventListener('click', () => {
			let header = "About Us";
			let content = "This Application is developed by\nKhai Phung and Spencer Halsey, \nfounders of Fortune280 LLC.";
            generateContent(header,content);
		});

		b2.addEventListener('click', () => {
            generateContent( "Our Mission","With our app Rflekt™ (patent pending) we hope to create a safe space for self discovery and growth for everyone.  Our app aims to be the preeminent self discovery help app on the web, helping everyone to “Reflect, Transform, Thrive”.");
		});


		b3.addEventListener('click', () => {
            
			let header = "Our App";
			let content = `Rflekt is a self discovery website. It will provide the user a variety of information to help them understand themselves and plan their day`;

            generateContent(header,content);

		});

        function _createtext(text) {
            console.log(text);

            return htmlToElement(`
            <p1 id="content" class="animated animatedFadeInUp fadeInUp"> ${text}</p1>
          `);

    
        };

        function _createheader(header) {
            console.log(header);

            return htmlToElement(`
            <h1 id="header"  class="animated animatedFadeInUp fadeInUp">${header}</h1>
          `);

    
        };

        function generateContent(header,text){
            const newList = htmlToElement("<div id='rightcontent'></div>")
                const newheader = _createheader(header);
				const newtext = _createtext(text);

				newList.appendChild(newheader);
                newList.appendChild(newtext);


                console.log(newList);


				const oldList = document.querySelector("#rightcontent");

				oldList.removeAttribute("id");
				oldList.hidden = true;
				oldList.parentElement.appendChild(newList);

        }

       
