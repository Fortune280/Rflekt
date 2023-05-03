/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Spencer Halsey, Khai Phung
 */

/** namespace. */
/** globals */
// FB_KEY_USERID = "id";
// FB_KEY_USERNAME = "userName";
// FB_KEY_PASSWORD = "password";
// FB_KEY_SIGN = "sign";
// FB_KEY_LAST_LOGIN = "lastLogIn";
// fbImageManager = null;
// fbImageDetailManager = null;

let FB_COLLECTION_HOROSCOPE = "HoroscopeCollections";
let FB_KEY_HOROSCOPE = "horoscope";
let FB_KEY_NUMBER = "number";
let FB_KEY_LAST_TOUCHED = "lastTouched";
let fbHoroscopeManager = null;
let fbSingleHoroscopeManager = null;
let loggedInUser = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

function updateView() {

}

class LandingPageController {

	constructor() {
		document.querySelector("#moveToLogin").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/login.html";
		};
	}

}

class LoginPageController {

	constructor(params) {



		document.querySelector("#moveToMain").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/main.html";
		};

		this.createAccount();
	}

	createAccount() {

		

		document.querySelector("#createAccountButton").onclick = (event) => {
			const inputEmailEl = document.querySelector("#inputEmail");
			const inputPasswordEl = document.querySelector("#inputPassword");
			console.log(`Create account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);
			firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
				.then((userCredential) => {
					// Signed in 
					console.log("CREATED USER");
					var user = userCredential.user;
					loggedInUser = user;

					console.log(loggedInUser.uid);
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
					loggedInUser = user;
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

	constructor() {

		document.querySelector("#menuMoveToHoroScopePage").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/horoscope.html";
		};
		document.querySelector("#menuSignOut").onclick = (event) => {
			console.log("Moving")
			//TODO: Sign out the user
			window.location.href = "/login.html";
		};

	}



}


class Horoscope {
	constructor(id, horoscope, number) {
		this.id = id;
		this.horoscope = horoscope;
		this.number = number;
	}
}

class FbHoroscopeManager {
	constructor() {
		this._documentSnapshots = [];
		this._unsubscribe = null;

		this._ref = firebase.firestore().collection(FB_COLLECTION_HOROSCOPE);
	}
	beginListening(changeListener) {
		console.log("Listening for number");
		this._unsubscribe = this._ref.orderBy(FB_KEY_LAST_TOUCHED, "desc")
			.limit(50).onSnapshot((querySnapshot) => {
				this._documentSnapshots = querySnapshot.docs;
				console.log("Updated " + this._documentSnapshots.length + "fortunes");


				if (changeListener) {
					changeListener();
				}

			});
	}
	stopListening() {
		this._unsubscribe();
	}

	add(horoscope, number) {
		this._ref.add({
				[FB_KEY_HOROSCOPE]: horoscope,
				[FB_KEY_NUMBER]: number,
				[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Document added with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}

	update(id, number, horoscope) {}
	delete(id) {}

	get length() {
		return this._documentSnapshots.length;
	}
	getHoroscopeAtIndex(index) {
		const doc = this._documentSnapshots[index];
		return new Horoscope(doc.id, doc.get(FB_KEY_HOROSCOPE), doc.get(FB_KEY_NUMBER));
	}
}


class ListPageController {
	constructor() {

		fbHoroscopeManager.beginListening(this.updateList.bind(this));

		$("#addHoroscopeDialog").on("show.bs.modal", () => {
			document.querySelector("#inputHoroscope").value = "";
			document.querySelector("#inputNumber").value = "";
		});

		$("#addHoroscopeDialog").on("shown.bs.modal", () => {
			document.querySelector("#inputHoroscope").focus();
		});

		document.querySelector("#submitAddHoroscope").onclick = (event) => {
			const horoscope = document.querySelector("#inputHoroscope").value;
			const number = document.querySelector("#inputNumber").value;
			console.log(horoscope, number);
			fbHoroscopeManager.add(horoscope, number);
		};

	}

	updateList() {
		// const newList = htmlToElement("<div id='columns'></div>")
		// for (let k = 0; k < fbHoroscopeManager.length; k++) {
		// 	const horoscope = fbHoroscopeManager.getHoroscopeAtIndex(k);
		// 	const newCard = this._createCard(horoscope);
		// 	newCard.onclick = (event) => {
		// 		console.log(` Save the id ${horoscope.id} then change pages`);
		// 		// storage.setphotoId(photo.id);
		// 		window.location.href = `/photo.html?id=${horoscope.id}`;
		// 	};
		// 	newList.appendChild(newCard);
		// }

		// const oldList = document.querySelector("#photosContainer");
		// oldList.removeAttribute("id");
		// oldList.hidden = true;
		// oldList.parentElement.appendChild(newList);
	}

	_createCard(horoscope) {
		return htmlToElement(`<div id="${horoscope.id}" class="card">
		<div class="card-body">
			<h5 class="card-title">${horoscope.horoscope}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${horoscope.number}</h6>
		</div>
	</div>`);
	}

}


class FbSingleHoroscopeManager {
	constructor(horoscopeId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(FB_COLLECTION_numberHoroscope).doc(horoscopeId);
	}

	beginListening(changeListener) {
		console.log("Listen for changes to this horoscope");
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			console.log("Horoscope updated ", doc);
			if (doc.exists) {
				this._document = doc;
				changeListener();
			} else {
				console.log("Document does not exist any longer.");
				console.log("CONSIDER: automatically navigate back to the home page.");
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}
	get horoscope() {
		return this._document.get(FB_KEY_HOROSCOPE);
	}

	get number() {
		return this._document.get(FB_KEY_NUMBER);
	}


	update(horoscope, number) {
		this._ref.update({
			[FB_KEY_HOROSCOPE]: horoscope,
			[FB_KEY_NUMBER]: number,
			[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log("Document has been updated");
		});
	}
	delete() {
		return this._ref.delete();
	}
}

class DetailPageController {
	constructor() {
		fbSinglehoroscopeManager.beginListening(this.updateView.bind(this));

		$("#editHoroscopeDialog").on("show.bs.modal", () => {
			document.querySelector("#inputHoroscope").value = fbSinglehoroscopeManager.horoscope;
			document.querySelector("#inputNumber").value = fbSinglehoroscopeManager.number;
		});
		$("#editHoroscopeDialog").on("shown.bs.modal", () => {
			document.querySelector("#inputHoroscope").focus();
		});
		document.querySelector("#submitEditHoroscope").onclick = (event) => {
			const horoscope = document.querySelector("#inputHoroscope").value;
			const number = document.querySelector("#inputNumber").value;
			console.log(horoscope, number);
			fbSinglehoroscopeManager.update(horoscope, number);
		};

		document.querySelector("#submitDeleteHoroscope").onclick = (event) => {
			fbSinglehoroscopeManager.delete().then(() => {
				window.location.href = "/"; // Go back to the list of Horoscope.
			});;
		};

	}
	updateView() {

		document.querySelector("#cardHoroscope").innerHTML = fbSinglehoroscopeManager.horoscope;
		document.querySelector("#cardNumber").innerHTML = fbSinglehoroscopeManager.number;
	}
}












// HoroscopeManager = class {

// }

// DetailPageController = class extends PageController  {

// }

// ProfilePageController = class extends PageController  {

// }

/* Main */
function main() {
	console.log("Ready");

	if (document.querySelector("#landingPage")) {
		console.log("On the landing page");
		new LandingPageController();
	} else if (document.querySelector("#loginPage")) {
		console.log("On the login page");
		new LoginPageController();
	} else if (document.querySelector("#mainPage")) {
		console.log("On the main page");
		new MainPageController();
	} else if (document.querySelector("#horoscopePage")) {
		console.log("On the horoscope list page");
		fbHoroscopeManager = new FbHoroscopeManager();
		new ListPageController();
	} else if (document.querySelector("#detailPage")) {
		console.log("On the detail page");
		// const horoscopeId = storage.gethoroscopeId();

		const urlParams = new URLSearchParams(window.location.search);
		const horoscopeId = urlParams.get("id");

		if (horoscopeId) {
			fbSingleHoroscopeManager = new FbSinglehoroscopeManager(horoscopeId);
			new DetailPageController();
		} else {
			console.log("There is no number horoscope id in storage to use.  Abort!");
			window.location.href = "/"; // Go back to the home page (ListPage)
		}

	}
};

main();