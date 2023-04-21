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
rhit.fbManager = null;
rhit.fbSinglePhotoManager = null;

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

		rhit.fbPhotosManager.beginListening(this.updateList.bind(this));

		$("#addHoroscopeDialog").on("show.bs.modal", () => {
			document.querySelector("#inputHoroscope").value = "";
			document.querySelector("#inputnumber").value = "";
		});

		$("#addHoroscopeDialog").on("shown.bs.modal", () => {
			document.querySelector("#inputHoroscope").focus();
		});

		document.querySelector("#submitAddPhoto").onclick = (event) => {
			const horoscope = document.querySelector("#inputHoroscope").value;
			const number = document.querySelector("#inputnumber").value;
			console.log(horoscope, number);
			rhit.fbPhotosManager.add(horoscope, number);
		};

	}
	updateList() {
		const newList = htmlToElement("<div id='columns'></div>")
		for (let k = 0; k < rhit.fbPhotosManager.length; k++) {
			const photo = rhit.fbPhotosManager.getHoroscopeAtIndex(k);
			const newCard = this._createCard(photo);
			newCard.onclick = (event) => {
				console.log(` Save the id ${photo.id} then change pages`);
				// rhit.storage.setphotoId(photo.id);
				window.location.href = `/photo.html?id=${photo.id}`;
			};
			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#photosContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createCard(photo) {
		return htmlToElement(` <div class="pin" id="${photo.id}">
        <img src="${photo.horoscope}" alt="${photo.number}">
        <p class="number">${photo.number}</p>
      </div>`);
	}

}

