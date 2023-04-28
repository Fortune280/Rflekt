/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Khai phung
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.FB_COLLECTION_HOROSCOPE = "HoroscopeCollections";
rhit.FB_KEY_HOROSCOPE = "horoscope";
rhit.FB_KEY_NUMBER = "number";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbHoroscopeManager = null;
rhit.fbSingleHoroscopeManager = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.horoscopes = class {
	constructor(id, horoscope, number) {
		this.id = id;
		this.horoscope = horoscope;
		this.number = number;
	}
}

rhit.FbHoroscopeManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._unsubscribe = null;

		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_HOROSCOPE);
	}
	beginListening(changeListener) {
		console.log("Listening for number");
		this._unsubscribe = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc")
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
				[rhit.FB_KEY_HOROSCOPE]: horoscope,
				[rhit.FB_KEY_NUMBER]: number,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
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
		return new rhit.horoscopes(doc.id, doc.get(rhit.FB_KEY_HOROSCOPE), doc.get(rhit.FB_KEY_NUMBER));
	}
}


rhit.ListPageController = class {
	constructor() {

		rhit.fbHoroscopeManager.beginListening(this.updateList.bind(this));

		$("#addHoroscopeDialog").on("show.bs.modal", () => {
			document.querySelector("#inputHoroscope").value = "";
			document.querySelector("#inputnumber").value = "";
		});

		$("#addHoroscopeDialog").on("shown.bs.modal", () => {
			document.querySelector("#inputHoroscope").focus();
		});

		document.querySelector("#submitAddHoroscope").onclick = (event) => {
			const horoscope = document.querySelector("#inputHoroscope").value;
			const number = document.querySelector("#inputnumber").value;
			console.log(horoscope, number);
			rhit.fbHoroscopeManager.add(horoscope, number);
		};

	}

	updateList() {
		const newList = htmlToElement("<div id='columns'></div>")
		for (let k = 0; k < rhit.fbHoroscopeManager.length; k++) {
			const horoscope = rhit.fbHoroscopeManager.getHoroscopeAtIndex(k);
			const newCard = this._createCard(horoscope);
			newCard.onclick = (event) => {
				console.log(` Save the id ${horoscope.id} then change pages`);
				// rhit.storage.setphotoId(photo.id);
				window.location.href = `/photo.html?id=${horoscope.id}`;
			};
			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#photosContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
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


rhit.FbSingleHoroscopeManager = class {
	constructor(horoscopeId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_numberhoroscopeS).doc(horoscopeId);
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
		return this._document.get(rhit.FB_KEY_HOROSCOPE);
	}

	get number() {
		return this._document.get(rhit.FB_KEY_NUMBER);
	}


	update(horoscope, number) {
		this._ref.update({
			[rhit.FB_KEY_HOROSCOPE]: horoscope,
			[rhit.FB_KEY_NUMBER]: number,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log("Document has been updated");
		});
	}
	delete() {
		return this._ref.delete();
	}
}

rhit.DetailPageController = class {
	constructor() {
		rhit.fbSinglehoroscopeManager.beginListening(this.updateView.bind(this));

		$("#editHoroscopeDialog").on("show.bs.modal", () => {
			document.querySelector("#inputHoroscope").value = rhit.fbSinglehoroscopeManager.horoscope;
			document.querySelector("#inputNumber").value = rhit.fbSinglehoroscopeManager.number;
		});
		$("#editHoroscopeDialog").on("shown.bs.modal", () => {
			document.querySelector("#inputHoroscope").focus();
		});
		document.querySelector("#submitEditHoroscope").onclick = (event) => {
			const horoscope = document.querySelector("#inputHoroscope").value;
			const number = document.querySelector("#inputNumber").value;
			console.log(horoscope, number);
			rhit.fbSinglehoroscopeManager.update(horoscope, number);
		};

		document.querySelector("#submitDeleteHoroscope").onclick = (event) => {
			rhit.fbSinglehoroscopeManager.delete().then(() => {
				window.location.href = "/"; // Go back to the list of horoscopes.
		});;
		};

	}
	updateView() {

		document.querySelector("#cardHoroscope").innerHTML = rhit.fbSinglehoroscopeManager.horoscope;
		document.querySelector("#cardNumber").innerHTML = rhit.fbSinglehoroscopeManager.number;
	}
}



/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#listPage")) {
		console.log("On the list page");
		rhit.fbHoroscopeManager = new rhit.FbHoroscopeManager();
		new rhit.ListPageController();
	}
	if (document.querySelector("#detailPage")) {
		console.log("On the detail page");
		// const horoscopeId = rhit.storage.gethoroscopeId();

		const urlParams = new URLSearchParams(window.location.search);
		const horoscopeId = urlParams.get("id");

		if (horoscopeId) {
			rhit.fbSingleHoroscopeManager = new rhit.FbSinglehoroscopeManager(horoscopeId);
			new rhit.DetailPageController();
		} else {
			console.log("There is no number horoscope id in storage to use.  Abort!");
			window.location.href = "/"; // Go back to the home page (ListPage)
		}

	}



};

rhit.main();

