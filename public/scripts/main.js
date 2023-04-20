/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Spencer Halsey, Khai Phung
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.FB_KEY_USERID = "id";
rhit.FB_KEY_USERNAME = "userName";
rhit.FB_KEY_PASSWORD = "password";
rhit.FB_KEY_SIGN = "sign";
rhit.FB_KEY_LAST_LOGIN = "lastLogIn";
rhit.fbImageManager = null;
rhit.fbImageDetailManager = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.PageController = class {

	constructor() {
		if (this.constructor == Employee) {
			throw new Error(" Object of Abstract Class cannot be created");
		}
	}
	updateView() {
		throw new Error("Abstract Method has no implementation");
	}

}

rhit.LandingPageController = class extends PageController  {

	constructor() {
		pageSwitchButtons();
	}

	pageSwitchButtons(){

	}

}

rhit.LoginPageController = class extends PageController  {

}

rhit.MainPageController = class extends PageController  {

}

rhit.HoroscopePageController = class extends PageController  {

}

rhit.HoroscopeManager = class {

}

rhit.DetailPageController = class extends PageController  {

}

rhit.ProfilePageController = class extends PageController  {

}

/* Main */
rhit.main = function () {
	console.log("Ready");
};

rhit.main();