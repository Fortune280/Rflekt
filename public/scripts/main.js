/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Spencer Halsey, Khai Phung
 */

/** namespace. */
/** globals */
let FB_COLLECTION_USERS = "users";
let FB_KEY_USERNAME = "userName";
let FB_COLLECTION_USER_HOROSCOPES = "userHoroscopes";
let FB_KEY_NUMBER_LIST = "numberList"
let FB_KEY_HOROSCOPE = "horoscope";
let FB_KEY_NUMBER = "number";
let FB_KEY_LAST_TOUCHED = "lastTouched";

let fbHoroscopeManager = null;
let fbSingleHoroscopeManager = null;
let fbAuthManager = null;
var loggedInUserID = null;
const API_URL = "https://645959df8badff578e0b6b2b.mockapi.io/api/horoscope";
const EIGHTBALL_API_URL = "https://645959df8badff578e0b6b2b.mockapi.io/api/eightball"
//id, answer

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
		this.signInRose();
		// this.signInAnonymously();

		console.log("LoginPageConstructor")
	}

	createAccount() {

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
					this._ref = firebase.firestore().collection(FB_COLLECTION_USERS);
					this._ref.doc(userCredential.user.uid).set({
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
					var errorCode = error.code;
					var errorMessage = error.message;

					if (errorCode == "auth/invalid-email") {
						alert("You have entered an invalid email address!");
						document.querySelector("#inputEmail").focus();
					} else if (errorCode == "auth/weak-password") {
						alert("Invalid password, password must be at least 6 characters");
						document.querySelector("#inputPassword").focus();
					}
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
					this._ref = firebase.firestore().collection(FB_COLLECTION_USERS);
					console.log("User Name " + rfUser.user.uid);
					let userName = rfUser.user.uid;
					this._ref.doc(userName).set({
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

	}

	// TODO: Says "This operation is restricted to administrators only.""
	signInAnonymously() {
		document.querySelector("#anonymousAuthButton").onclick = (event) => {
			console.log(`Log in via Anonymous auth`);
			firebase.auth().signInAnonymously()
				.then(() => {
					window.location.href = "/main.html";
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
		document.querySelector("#menuMoveToEightballPage").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/eightball.html";
		};

		console.log("SELECTED ID " + userID);
		document.querySelector("#userNameText").innerHTML = userID;

		this.signOut();

	}

	signOut() {

		document.querySelector("#menuSignOut").onclick = (event) => {
			console.log(`Sign Out`);
			firebase.auth().signOut().then(() => {
				console.log("Sign out successful")
				window.location.href = "/login.html";
			}).catch((error) => {
				console.error("Error adding document: ", error);
			});
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

	constructor(userID) {
		this._documentSnapshots = [];
		this._unsubscribe = null;

		this._ref = firebase.firestore().collection(FB_COLLECTION_USERS).doc(userID);
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.collection(FB_COLLECTION_USER_HOROSCOPES).orderBy(FB_KEY_LAST_TOUCHED, "desc")
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
		this._ref.collection(FB_COLLECTION_USER_HOROSCOPES).add({
			[FB_KEY_HOROSCOPE]: horoscope,
			[FB_KEY_NUMBER]: number,
			[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now()

		}).catch(function (error) {
			console.error("Error adding document: ", error);
		});

		this._ref.update({
			numberList: firebase.firestore.FieldValue.arrayUnion(number)

		})
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getHoroscopeAtIndex(index) {
		const doc = this._documentSnapshots[index];
		// console.log("Returning new Horoscope with id: " + doc.id + " and horoscope " + doc.get(FB_KEY_HOROSCOPE))
		return new Horoscope(doc.id, doc.get(FB_KEY_HOROSCOPE), doc.get(FB_KEY_NUMBER));
	}
}


class ListPageController {
	constructor(userID) {

		this._ref = firebase.firestore().collection(FB_COLLECTION_USERS).doc(userID);

		this.updateList();
		fbHoroscopeManager.beginListening(this.updateList.bind(this));

		$("#addHoroscopeDialog").on("show.bs.modal", () => {
			document.querySelector("#inputHoroscope").value = "";
			document.querySelector("#inputNumber").value = "";
		});

		$("#addHoroscopeDialog").on("shown.bs.modal", () => {
			document.querySelector("#inputHoroscope").focus();
		});

		document.querySelector("#submitAddHoroscope").onclick = async (event) => {
			let count = 0;
			let horoscopeNumber = this.generateHash(count);

			const doc = await this._ref.get();
			const list = doc.data().numberList;

			while (list.includes(horoscopeNumber)) {
				count++;
				horoscopeNumber = this.generateHash(count);
			}

			const horoscope = document.querySelector("#inputHoroscope").value;

			fbHoroscopeManager.add(horoscope, horoscopeNumber);
		};

	}

	generateHash(collisionAdjust) {
		const number = document.querySelector("#inputNumber").value;
		const apiSize = 97;
		let hash = 0;
		for (let i = 0; i < number.length; i++) {
			hash = (hash * 31) + (number.charCodeAt(i));
		}
		if (hash < 0) {
			hash += Number.MAX_VALUE + 1;
		}

		hash = (hash + collisionAdjust) % apiSize;
		return hash;
	}

	updateList() {

		fetch(API_URL)
			.then(response => {
				if (response.ok) {
					return response;
				}
				throw Error(response.statusText);
			})
			.then(response => response.json())
			.then(text => {
				const newList = htmlToElement("<div id='columns'></div>")
				for (let k = 0; k < fbHoroscopeManager.length; k++) {
					const horoscope = fbHoroscopeManager.getHoroscopeAtIndex(k);
					console.log("HOROSCOPE " + horoscope + " Number " + horoscope.number + " Value " + text[horoscope.number].horoscopeEntry)

					const newCard = this._createCard(horoscope, text[horoscope.number].horoscopeEntry);

					newCard.onclick = (event) => {
						console.log(` Save the id ${horoscope.id} then change pages`);
						window.location.href = `/horoscope_detail.html?id=${horoscope.id}`;
					};

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

	constructor(horoscopeId, userID) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(FB_COLLECTION_USERS).doc(userID).collection(FB_COLLECTION_USER_HOROSCOPES).doc(horoscopeId);
		this._userRef = firebase.firestore().collection(FB_COLLECTION_USERS).doc(userID);
		console.log("in singlehoroscope constructor");
		console.log("horo id:" + horoscopeId);
		console.log("USER ID: " + userID);
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
			[FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now()
		}, {
			merge: true
		}).then(() => {
			console.log("Document has been updated");
		});
	}
	delete() {
		// var data = this._ref.get().then((doc) => {
		// 	if (doc.exists) {
		// 		console.log("Document data:", doc.data());
		// 		return doc.data();
		// 	} else {
		// 		// doc.data() will be undefined in this case
		// 		console.log("No such document!");
		// 	}
		// }).catch((error) => {
		// 	console.log("Error getting document:", error);
		// });
		// var number = data.number;	
		// let number = this._ref.get(FB_KEY_NUMBER);
		// console.log("Deleting " +  number())

		// this._userRef.update({
		// 	numberList: firebase.firestore.FieldValue.arrayRemove( number())

		// })
		return this._ref.delete();
	}
}

class DetailPageController {
	constructor() {
		fbSingleHoroscopeManager.beginListening(this.updateView.bind(this));

		document.querySelector("#submitDeleteHoroscope").onclick = (event) => {
			fbSingleHoroscopeManager.delete().then(() => {
				window.location.href = "/horoscope.html"; // Go back to the list of Horoscope.
			});;
		};

	}
	updateView() {
		fetch(API_URL)
			.then(response => {
				if (response.ok) {
					return response;
				}
				throw Error(response.statusText);
			})
			.then(response => response.json())
			.then(text => {
				const newList = htmlToElement("<div id='cardHoroscope'></div>")
				console.log("HOROSCOPE " + fbSingleHoroscopeManager.horoscope + " Number " + fbSingleHoroscopeManager.number + " Value " + text[fbSingleHoroscopeManager.number].horoscopeEntry)

				const newCard = this._createCard(fbSingleHoroscopeManager.horoscope, text[fbSingleHoroscopeManager.number].horoscopeEntry);

				newList.appendChild(newCard);

				const oldList = document.querySelector("#cardHoroscope");

				oldList.removeAttribute("id");
				oldList.hidden = true;
				oldList.parentElement.appendChild(newList);


			})
			.catch(error => console.log('There was an error:', error));

	}
	_createCard(horoscope, entry) {
		console.log("generating horoscope")
		console.log(entry);

		return htmlToElement(`<div class="card">
		<div class="card-body">
			<h5 class="card-title">${horoscope}</h5>
			<h6  class="card-subtitle mb-2 text-muted">${entry}</h6>
		</div>
	</div>`);

	}
}

class EightballPageController {

	constructor() {
		this.getEightBallResponse();
	}

	getEightBallResponse() {
		document.querySelector("#submitQuestionButton").onclick = (event) => {

			//API GET
			fetch(EIGHTBALL_API_URL)
				.then(response => {
					if (response.ok) {
						return response;
					}
					throw Error(response.statusText);
				})
				.then(response => response.json())
				.then(text => {
					let responseNumber = Math.floor(Math.random() * 20) + 1;
					let responseText = text[responseNumber].answer;

					if(document.querySelector("#reponseText").textContent == responseText){
						 responseNumber = Math.floor(Math.random() * 20) + 1;
						 responseText = text[responseNumber].answer;
					}	

					document.querySelector("#reponseText").textContent = responseText;

				})
				.catch(error => console.log('There was an error:', error));

		};
	}


}
//SPLIT Page
const left = document.querySelector('.left');
const right = document.querySelector('.right');
const landingPage = document.querySelector('#landingPage');

left.addEventListener('mouseenter', ()=>{
	landingPage.classList.add('hover-left')
});

left.addEventListener('mouseleave', ()=>{
	landingPage.classList.remove('hover-left')
});

right.addEventListener('mouseenter', ()=>{
	landingPage.classList.add('hover-right')
});

right.addEventListener('mouseleave', ()=>{
	landingPage.classList.remove('hover-right')
});

const head = document.querySelector('#header');
const content = document.querySelector('#content');
const b1 =  document.querySelector('#about');
const b2 =  document.querySelector('#about1');
const b3 =  document.querySelector('#about2');

b1.addEventListener('click', ()=>{
	head.innerHTML = "About Us";
	content.innerHTML = "This Application is developed by\nKhai Phung and Spencer Halsey, \nfounders of Fortune280 LLC.";
});

b2.addEventListener('click', ()=>{
	head.innerHTML = "Our Mission";
	content.innerHTML = `With our app Rflekt™ (patent pending) we hope to create a safe space for self discovery and growth for everyone.  Our app aims to be the preeminent self discovery help app on the web, helping everyone to “Reflect, Transform, Thrive”.`;
});


b3.addEventListener('click', ()=>{
	head.innerHTML = "Our App";
	content.innerHTML = `Rflekt is a self discovery website. It will provide the user a variety of information to help them understand themselves and plan their day`;
});

//END SPLIT PAGE
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

			const urlParams = new URLSearchParams(window.location.search);
			const horoscopeId = urlParams.get("id");

			if (horoscopeId) {
				console.log("ID horoscope:" + horoscopeId);
				console.log("ID user:" + fbAuthManager.uid);
				fbSingleHoroscopeManager = new FbSingleHoroscopeManager(horoscopeId, fbAuthManager.uid);
				new DetailPageController();
			} else {
				console.log("There is no number horoscope id in storage to use.  Abort!");
				window.location.href = "/"; // Go back to the home page (ListPage)
			}

		} else if (document.querySelector("#eightballPage")) {
			new EightballPageController();
		}
	});

};

main();