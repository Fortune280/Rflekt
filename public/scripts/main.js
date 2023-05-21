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

		document.querySelector("#moveToHoroscopePageButton").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/horoscope.html";
		};
		document.querySelector("#moveToEightballButton").onclick = (event) => {
			console.log("Moving")
			window.location.href = "/eightball.html";
		};

		// console.log("SELECTED ID " + userID);
		// document.querySelector("#userNameText").innerHTML = userID;

		this.signOut();

	}

	signOut() {

		document.querySelector("#menuSignOut").onclick = (event) => {
			console.log(`Sign Out`);
			firebase.auth().signOut().then(() => {
				console.log("Sign out successful")
				window.location.href = "/index.html";
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

		return htmlToElement(`<div id="${horoscope.id}" class="card animated animatedFadeInUp fadeInUp">
		<div class="card-body animated animatedFadeInUp fadeInUp">
			<h5 class="card-title animated animatedFadeInUp fadeInUp">${horoscope.horoscope}</h5>
			<h6  class="card-subtitle mb-2 text-muted animated animatedFadeInUp fadeInUp">${entry}</h6>
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

		return htmlToElement(`<div class="card animated animatedFadeInUp fadeInUp">
		<div class="card-body animated animatedFadeInUp fadeInUp">
			<h5 class="card-title animated animatedFadeInUp fadeInUp">${horoscope}</h5>
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

					if (document.querySelector("#reponseText").textContent == responseText) {
						responseNumber = Math.floor(Math.random() * 20) + 1;
						responseText = text[responseNumber].answer;
					}

					const myArray = responseText.split(" ");

					this.generate8Ball(myArray);

					//document.querySelector("#reponseText").textContent = responseText;

				})
				.catch(error => console.log('There was an error:', error));

		};
	}

	// dynamic content generation
	htmlToElement(html) {
		var template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	}


	_createstyle(i) {
		return htmlToElement(`
		span:nth-child(${i}) {
			animation: fade-in 0.8s 0.${i}s forwards cubic-bezier(0.11, 0, 0.5, 0);
		  }
    `);
	};


	_createspan(text,i) {

		return htmlToElement(`
		<span style="span:nth-child(${i}) {animation: fade-in 0.8s 0.${i}s forwards cubic-bezier(0.11, 0, 0.5, 0);}">${text}</span>
    `);

	};



	generate8Ball(arr) {
		console.log("Generating Span")
		const newList = htmlToElement(' <h1 class="centered" id="reponseText"></1h>');
		//const newStyle = htmlToElement('<style id="spanStyle"> </style>');

		for(let i = 0; i < arr.length ; i++){
			const newtext = this._createspan(arr[i]+" ",i);
			newList.appendChild(newtext);
			
			// const newStyle = this._createstyle(i);
			// newStyle.appendChild(newStyle);
		}
		
		const oldList = document.querySelector("#reponseText");
		// const oldStyle = document.querySelector("#spanStyle");

		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);

		// oldStyle.removeAttribute("id");
		// oldStyle.hidden = true;
		// oldStyle.parentElement.appendChild(newStyle);

	}



}

/* Main */
function main() {
	console.log("Ready");

	fbAuthManager = new FbAuthManager();
	fbAuthManager.beginListening(() => {
		console.log(`The auth state has changed.   isSignedIn = ${fbAuthManager.isSignedIn}`);
		// if (document.querySelector("#landingPage")) {
		// 	console.log("On the landing page");
		// 	new LandingPageController();
		// } else if (document.querySelector("#loginPage")) {
		// 	console.log("On the login page");
		// 	new LoginPageController();
		// } else 
		if (document.querySelector("#mainPage")) {
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