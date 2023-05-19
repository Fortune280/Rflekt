console.log("Running <landing.js>")
const left = document.querySelector('.left');
const right = document.querySelector('.right');
const landingPage = document.querySelector('#landingPage');
let FB_COLLECTION_USERS = "users";
let FB_KEY_USERNAME = "userName";
let FB_KEY_NUMBER_LIST = "numberList"
let FB_KEY_LAST_TOUCHED = "lastTouched";

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
const b4 = document.querySelector('#about3');


function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

b1.addEventListener('click', () => {
	let header = "About Us";
	let content = "This Application is developed by\nKhai Phung and Spencer Halsey, \nfounders of Fortune280 LLC.";
	generateContent(header, content);
});

b2.addEventListener('click', () => {
	generateContent("Our Mission", "With our app Rflekt™ (patent pending) we hope to create a safe space for self discovery and growth for everyone.  Our app aims to be the preeminent self discovery help app on the web, helping everyone to “Reflect, Transform, Thrive”.");
});


b3.addEventListener('click', () => {

	let header = "Our App";
	let content = `Rflekt is a self discovery website. It will provide the user a variety of information to help them understand themselves and plan their day`;

	generateContent(header, content);

});

b4.addEventListener('click', () => {

	// <!-- Email input -->
	// <div class="form-outline mb-4">
	//   <input type="email" id="inputEmail" class="form-control" />
	//   <label class="form-label" for="inputEmail">Email Address</label>
	// </div>

	// <!-- Password input -->
	// <div class="form-outline mb-4">
	//   <input type="password" id="inputPassword" class="form-control" />
	//   <label class="form-label" for="inputPassword">Password</label>
	// </div>

	// <button id="createAccountButton" type="button" class="button btn-success btn-block">Create Account</button>
	// <button id="logInButton" type="button" class="button btn-danger btn-block">Log In</button>

	// <hr>
	// <button id = "logInRoseButton" type="button" class="button btn-primary btn-block">Rose</button>

	let content = `
			<div id="column"> <div class="form-outline mb-4">
			   <input type="email" id="inputEmail" class="form-control" />
			   <label class="form-label" for="inputEmail">Email Address</label>
			 </div>` 
		+  `<br> <div class="form-outline mb-4">
			   <input type="password" id="inputPassword" class="form-control" />
			   <label class="form-label" for="inputPassword">Password</label>
			  </div>`
		+ 	`<br><button id="createAccountButton" type="button" class="button btn">Create Account</button>
			 <button id="logInButton" type="button" class="button btn">Log In</button>`
		+ `<hr>
			 <button id = "logInRoseButton" type="button" class="button btn">Rose</button> </div>`
	console.log(content)

	generateContent("Join Us", content);


	document.querySelector("#createAccountButton").onclick = (event) => {
		const inputEmailEl = document.querySelector("#inputEmail");
		const inputPasswordEl = document.querySelector("#inputPassword");

		//Uses regex to get username
		const re = new RegExp("(.+)@");
		const userName = re.exec(inputEmailEl.value);
		// console.log("Mathches:" + matches[1]);


		console.log(`Create account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);
		firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
			.then((userCredential) => {
				console.log("CREATED USER " + userCredential);

				//Access user, create new information
				let _ref = firebase.firestore().collection(FB_COLLECTION_USERS);
				_ref.doc(userCredential.user.uid).set({
					[FB_KEY_USERNAME]: userName[1],
					[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
					[FB_KEY_NUMBER_LIST]: ""
				}).then(() => {
					// Signed in, move to main page
					window.location.href = "/main.html";
				}).catch(function (error) {
					console.error("Error adding document: ", error);
				});
			})
			.catch((error) => {
				console.log("Error exists")
				var errorCode = error.code;
				var errorMessage = error.message;

				if (errorCode == "auth/invalid-email") {
					alert("You have entered an invalid email address!");
					document.querySelector("#inputEmail").focus();
				} else if (errorCode == "auth/weak-password") {
					alert("Invalid password, password must be at least 6 characters");
					document.querySelector("#inputPassword").focus();
				} else if (errorCode == "auth/email-already-in-use"){
					alert("The email address is already in use by another account.");
					document.querySelector("#inputEmail").focus();
				}
				console.log("Create user error", errorCode, errorMessage);
			});
	};


	document.querySelector("#logInButton").onclick = (event) => {
		const inputEmailEl = document.querySelector("#inputEmail");
		const inputPasswordEl = document.querySelector("#inputPassword");

		console.log(`Log in to existing account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);
		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
			.then(() => {
				window.location.href = "/main.html";
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Log in user error", errorCode, errorMessage);
			});
	};



// 9b90da36-b490-4ed2-b41c-1c18e1c77bfb

	document.querySelector("#logInRoseButton").onclick = (event) => {
		console.log("Logging in with Rosefire")
		Rosefire.signIn("9b90da36-b490-4ed2-b41c-1c18e1c77bfb", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);
			firebase.auth().signInWithCustomToken(rfUser.token).then((rfUser) => {

				//Create new information for user
				let _ref = firebase.firestore().collection(FB_COLLECTION_USERS);
				console.log("User Name " + rfUser.user.uid);
				let userName = rfUser.user.uid;
				_ref.doc(userName).set({
					[FB_KEY_USERNAME]: userName,
					[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
					[FB_KEY_NUMBER_LIST]: ""
				}).then(() => {
					window.location.href = "/main.html";
				}).catch(function (error) {
					console.error("Error adding document: ", error);
				});

			}).catch((error) => {
				if (error.code === 'auth/invalid-custom-token') {
					console.log("The token you provided is not valid.");
				} else {
					console.log("signInWithCustomToken error", error.message);
				}
			});
		});
	}
});

document.querySelector("#moveToLogin").onclick = (event) => {
	b4.click();
	landingPage.classList.add('hover-right')
};

// dynamic content generation
function _createtext(text) {
	return htmlToElement(`
            <p1 id="content" class="animated animatedFadeInUp fadeInUp"> ${text}</p1>
          `);


};

function _createheader(header) {
	console.log("displaying: " + header);

	return htmlToElement(`
            <h1 id="${header}"  class="animated animatedFadeInUp fadeInUp">${header}</h1>
          `);


};

function generateContent(header, text) {
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


