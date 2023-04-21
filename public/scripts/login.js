var rhit = rhit || {};

rhit.main = function () {
	console.log("Ready on Login Page");

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

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
	// document.querySelector("#signOutButton").onclick = (event) => {
	// 	console.log(`Sign Out`);
	// 	firebase.auth().signOut().then(() => {
	// 		// Sign-out successful.
	// 	}).catch((error) => {
	// 		// An error happened.
	// 	});
	// };
	
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


	// rhit.startFirebaseUI();


};

// rhit.startFirebaseUI = function() {
// 	var uiConfig = {
// 		signInSuccessUrl: '/', // redirecting URL
// 		signInOptions: [
// 			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
// 			firebase.auth.EmailAuthProvider.PROVIDER_ID,
// 			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
// 			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
// 		],
// 	};
// 	const ui = new firebaseui.auth.AuthUI(firebase.auth());
// 	ui.start('#firebaseui-auth-container', uiConfig);
//  }
 

rhit.main();