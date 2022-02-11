// Paste the config your copied earlier
// Your web app's Firebase configuration
var firebaseConfig = {
    //copy firebase configuration here
};
firebase.initializeApp(firebaseConfig);
// Create a Recaptcha verifier instance globally
// Calls submitPhoneNumberAuth() when the captcha is verified
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container", {
        size: "normal",
        callback: function (response) {
            submitPhoneNumberAuth();
        }
    }
);

// This function runs when the 'sign-in-button' is clicked
// Takes the value from the 'phoneNumber' input and sends SMS to that phone number
function submitPhoneNumberAuth() {
    var phoneNumber = document.getElementById("phoneNumber").value;
    var input = document.getElementById("code");
    var button = document.getElementById('confirm-code')
    var appVerifier = window.recaptchaVerifier;
    firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
            window.confirmationResult = confirmationResult;
            input.style.display = 'block'
            button.style.display = 'block'
        })
        .catch(function (error) {
            console.log(error);
        });
}

// This function runs when the 'confirm-code' button is clicked
// Takes the value from the 'code' input and submits the code to verify the phone number
// Return a user object if the authentication was successful, and auth is complete
function submitPhoneNumberAuthCode() {
    var code = document.getElementById("code").value;
    confirmationResult
        .confirm(code)
        .then(function (result) {
            var user = result.user;
            console.log(user);
            alert("Phone number successfully verified")
            loginToApp()
        })
        .catch(function (error) {
            console.log(error);
        });
}

function loginToApp() {
    firebase.auth().currentUser.getIdToken( /* forceRefresh */ true).then(function (idToken) {
        console.log(idToken)
        // Send token to your backend via HTTPS
    }).catch(function (error) {
        // Handle error
    });
}

//This function runs every time the auth state changes. Use to verify if the user is logged in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("USER LOGGED IN");
        loginToApp()
    } else {
        console.log("USER NOT LOGGED IN");
    }
});