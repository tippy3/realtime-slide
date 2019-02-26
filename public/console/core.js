(() => {

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyAsZtExWCdf0_cgYptd58zV2Sxofg0Gbbk",
    authDomain: "mutius-slide.firebaseapp.com",
    databaseURL: "https://mutius-slide.firebaseio.com",
    projectId: "mutius-slide",
    storageBucket: "mutius-slide.appspot.com",
    messagingSenderId: "170415024303"
  };
  firebase.initializeApp(config);
  const db = firebase.firestore();


  function outputError(errorMessage){
    console.error(errorMessage);
  }

})();