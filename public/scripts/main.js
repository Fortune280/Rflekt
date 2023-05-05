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
let FB_COLLECTION_USERS = "users";
let FB_KEY_HOROSCOPE = "horoscope";
let FB_KEY_NUMBER = "number";
let FB_KEY_LAST_TOUCHED = "lastTouched";
let FB_KEY_USERNAME = "userName";
let fbHoroscopeManager = null;
let fbSingleHoroscopeManager = null;
let fbAuthManager = null;
var loggedInUserID = null;
const API_URL = "https://64497717b88a78a8f008a004.mockapi.io/api/horoscope";

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

async function getApi(url) {
	// Storing response
	const response = await fetch(url);

	// Storing data in form of JSON
	var data = await response.text();

	return (data);
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

	constructor() {



		document.querySelector("#moveToMain").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/main.html";
		};

		this.createAccount();
		this.logIn();
		// this.signOut();
		this.signInRose();

		console.log("LoginPageConstructor")
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
					// var user = userCredential.user;
					// loggedInUserID = user;

					// console.log("UID IS " + user);

					this._ref = firebase.firestore().collection(FB_COLLECTION_USERS);

					this._ref.doc(userCredential.user.uid).set({
							[FB_KEY_USERNAME]: "NEWER TEST",
							[FB_KEY_HOROSCOPE]: "",
							[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
						}).then((userCredential) => {
							// Signed in
							window.location.href = "/main.html";
							// ...
						})
						.catch(function (error) {
							console.error("Error adding document: ", error);
						});

					// window.location.href = "/main.html";
					// db.collection("cities").doc("LA").set({
					// 	name: "Los Angeles",
					// 	state: "CA",
					// 	country: "USA"
					// })
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
			const inputEmailEl = document.querySelector("#inputEmail");
			const inputPasswordEl = document.querySelector("#inputPassword");
			console.log(`Log in to existing account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);
			firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
				// .then((userCredential) => {
				// 	// Signed in
				// 	// var user = userCredential.user;
				// 	// loggedInUserID = userCredential.user.uid;
				// 	// console.log("Login ID " + loggedInUserID);
				// 	// console.log("Login ID2 " + userCredential.user.uid);
				// 	// window.location.href = "/main.html";
				// 	// ...
				// })
				.then(() => {
					window.location.href = "/main.html";
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("Log in user error", errorCode, errorMessage);
				});
		};

	}

	// 9b90da36-b490-4ed2-b41c-1c18e1c77bfb
	signInRose() {
		console.log("Setting up Rosefire")
		document.querySelector("#logInRoseButton").onclick = (event) => {
			console.log("Logging in with Rosefire")
			Rosefire.signIn("9b90da36-b490-4ed2-b41c-1c18e1c77bfb", (err, rfUser) => {
				if (err) {
					console.log("Rosefire error!", err);
					return;
				}
				console.log("Rosefire success!", rfUser);
				firebase.auth().signInWithCustomToken(rfUser.token).then((rfUser) => {
						this._ref = firebase.firestore().collection(FB_COLLECTION_USERS);
						

						this._ref.doc(rfUser.username).set({
								[FB_KEY_USERNAME]: rfUser.username,
								[FB_KEY_HOROSCOPE]: "",
								[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
							}).then((userCredential) => {
								// Signed in
								window.location.href = "/main.html";
								// ...
							})
							.catch(function (error) {
								console.error("Error adding document: ", error);
							});

					})
					.catch((error) => {
						if (error.code === 'auth/invalid-custom-token') {
							console.log("The token you provided is not valid.");
						} else {
							console.log("signInWithCustomToken error", error.message);
						}
					});
			});
		}

	}

	signOut() {
		document.querySelector("#signOutButton").onclick = (event) => {
			console.log(`Sign Out`);
			firebase.auth().signOut().then(() => {
				// Sign-out successful.
				loggedInUserID = null;
			}).catch((error) => {
				// An error happened.
			});
		};
	}

	// TODO: Implement eventually
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

class FbAuthManager {
	constructor() {
		this._user = null;
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}
	signOut() {
		firebase.auth().signOut();
	}
	get uid() {
		return this._user.uid;
	}
	get isSignedIn() {
		return !!this._user;
	}
}

class MainPageController {

	constructor(userID) {

		document.querySelector("#menuMoveToHoroScopePage").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/horoscope.html";
		};
		document.querySelector("#menuSignOut").onclick = (event) => {
			console.log("Moving")
			//TODO: Sign out the user
			window.location.href = "/login.html";
		};

		console.log("SELECTED ID " + userID);
		document.querySelector("#userNameText").innerHTML = userID;

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


	constructor(userID) {
		this._documentSnapshots = [];
		this._unsubscribe = null;

		this._ref = firebase.firestore().collection(FB_COLLECTION_USERS).doc(userID).collection(FB_KEY_HOROSCOPE);
	}
	beginListening(changeListener) {
		console.log("Listening for number");
		this._unsubscribe = this._ref.number;
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

	add(horoscope, number, userID) {
		console.log("ADDING TO USERID " + userID);
		this._ref.add({

				[FB_KEY_HOROSCOPE]: horoscope,
				[FB_KEY_NUMBER]: number,
				[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now()

			}, {
				merge: true
			})
			// .then(function (docRef) {
			// 	console.log("Document added with ID: ", docRef.id);
			// })
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
		// this._ref.add({
		// 		[FB_KEY_HOROSCOPE]: horoscope,
		// 		[FB_KEY_NUMBER]: number,
		// 		[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		// 	})
		// 	.then(function (docRef) {
		// 		console.log("Document added with ID: ", docRef.id);
		// 	})
		// 	.catch(function (error) {
		// 		console.error("Error adding document: ", error);
		// 	});
	}

	update(id, number, horoscope) {}
	delete(id) {}

	get length() {
		return this._documentSnapshots.length;
	}

	//TODO: HERE
	getHoroscopeAtIndex(index, userID) {
		const doc = this._documentSnapshots[index];
		// const doc = 
		console.log("Returning new Horoscope with id: " + doc.id + " and horoscope " +doc.get(FB_KEY_HOROSCOPE))
		return new Horoscope(doc.id, doc.get(FB_KEY_HOROSCOPE), doc.get(FB_KEY_NUMBER));
	}
}


class ListPageController {
	constructor(userID) {

		this.updateList();
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

			let hash = 0;
			for (let i = 0; i < number.length; i++) {
				hash = (hash * 31) + (number.charCodeAt(i));
			}
			if (hash < 0) {
				hash += Number.MAX_VALUE + 1;
			}

			hash = hash % 10;

			console.log(horoscope, hash);
			fbHoroscopeManager.add(horoscope, hash, userID);
		};

	}

	updateList() {
		console.log("UPDAITING LIST")

		fetch(API_URL)
			.then(response => {
				if (response.ok) {
					return response;
				}
				throw Error(response.statusText);
			})
			.then(response => response.json())
			// .then(text => console.log(typeof text))
			.then(text => {
				const newList = htmlToElement("<div id='columns'></div>")
				//TODO: Probably Here
				for (let k = 0; k < fbHoroscopeManager.length; k++) {
					const horoscope = fbHoroscopeManager.getHoroscopeAtIndex(k);
					console.log("HOROSCOPE " + horoscope + " Number " + horoscope.number + " Value " + text[horoscope.number].horoscopeEntry)
					const newCard = this._createCard(horoscope, text[horoscope.number].horoscopeEntry);
					// const newCard = this._createCard()
					// newCard.onclick = (event) => {
					// 	console.log(` Save the id ${horoscope.id} then change pages`);

					// 	window.location.href = `/photo.html?id=${horoscope.id}`;
					// };
					newList.appendChild(newCard);
				}

				const oldList = document.querySelector("#columns");

				oldList.removeAttribute("id");
				oldList.hidden = true;
				oldList.parentElement.appendChild(newList);


			})
			.catch(error => console.log('There was an error:', error));





	}

	_createCard(horoscope, entry) {
		console.log("generating horoscope")
		console.log(entry);

		return htmlToElement(`<div id="${horoscope.id}" class="card">
		<div class="card-body">
			<h5 class="card-title">${horoscope.horoscope}</h5>
			<h6  class="card-subtitle mb-2 text-muted">${entry}</h6>
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
		}, {
			merge: true
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

	fbAuthManager = new FbAuthManager();
	fbAuthManager.beginListening(() => {
		console.log(`The auth state has changed.   isSignedIn = ${fbAuthManager.isSignedIn}`);
		if (document.querySelector("#landingPage")) {
			console.log("On the landing page");
			new LandingPageController();
		} else if (document.querySelector("#loginPage")) {
			console.log("On the login page");
			new LoginPageController();
		} else if (document.querySelector("#mainPage")) {
			console.log("On the main page");
			new MainPageController(fbAuthManager.uid);
		} else if (document.querySelector("#horoscopePage")) {
			console.log("On the horoscope list page");
			fbHoroscopeManager = new FbHoroscopeManager(fbAuthManager.uid);
			new ListPageController(fbAuthManager.uid);
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
	});

};

main();