/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Spencer Halsey, Khai Phung
 */

/** namespace. */
/** globals */
// rhit.FB_KEY_USERID = "id";
// rhit.FB_KEY_USERNAME = "userName";
// rhit.FB_KEY_PASSWORD = "password";
// rhit.FB_KEY_SIGN = "sign";
// rhit.FB_KEY_LAST_LOGIN = "lastLogIn";
// rhit.fbImageManager = null;
// rhit.fbImageDetailManager = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

function updateView(){

}

class LandingPageController {

	constructor() {
		this.pageSwitchButtons();
	}

	pageSwitchButtons(){

		document.querySelector("#moveToLogin").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/login.html";
		};

	}

}

class LoginPageController {

	constructor(params) {

		const inputEmailEl = document.querySelector("#inputEmail");
		const inputPasswordEl = document.querySelector("#inputPassword");

		document.querySelector("#moveToMain").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/main.html";
		};
	}

	createAccount() {


		document.querySelector("#createAccountButton").onclick = (event) => {
			console.log(`Create account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);
			firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
				.then((userCredential) => {
					// Signed in 
					console.log("CREATED USER");
					var user = userCredential.user;
					// ...
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("Create user error", errorCode, errorMessage);
				});
		};

	}

	logIn() {

		document.querySelector("#logInButton").onclick = (event) => {
			console.log(`Log in to existing account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);
			firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
				.then((userCredential) => {
					// Signed in
					var user = userCredential.user;
					// ...
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("Log in user error", errorCode, errorMessage);
				});
		};

	}

	signOut() {
		document.querySelector("#signOutButton").onclick = (event) => {
			console.log(`Sign Out`);
			firebase.auth().signOut().then(() => {
				// Sign-out successful.
			}).catch((error) => {
				// An error happened.
			});
		};
	}

	signInAnonymously() {
		document.querySelector("#anonymousAuthButton").onclick = (event) => {
			console.log(`Log in via Anonymous auth`);
			firebase.auth().signInAnonymously()
				.then(() => {
					// Signed in..
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("Anonymous Login error", errorCode, errorMessage);
					// ...
				});
		};
	}



	onAuthStateChanged() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var uid = user.uid;
				var displayName = user.displayName;
				var email = user.email;
				var emailVerified = user.emailVerified;
				var photoURL = user.photoURL;
				var isAnonymous = user.isAnonymous;
				var providerData = user.providerData;
				console.log("Signed in", uid);
				console.log('displayName :>> ', displayName);
				console.log('email :>> ', email);
				console.log('photoURL :>> ', photoURL);
				console.log('isAnonymous :>> ', isAnonymous);
				console.log('uid :>> ', uid);

			} else {
				console.log("No user is signed in.");
			}
		});

	}
}

class MainPageController {

	constructor(){

	}

	

}

class HoroscopePageController {

	constructor(){

	}

}

// rhit.HoroscopeManager = class {

// }

// rhit.DetailPageController = class extends PageController  {

// }

// rhit.ProfilePageController = class extends PageController  {

// }

/* Main */
function main() {
	console.log("Ready");

	if(document.querySelector("#landingPage")){
		console.log("On the landing page");
		new LandingPageController();
	}else if(document.querySelector("#loginPage")){
		console.log("On the login page");
		new LoginPageController();
	}else if(document.querySelector("#mainPage")){
		console.log("On the main page");
		new MainPageController();
	}else if(document.querySelector("#horoscopePage")){
		console.log("On the horoscope page");
	}
};

main();