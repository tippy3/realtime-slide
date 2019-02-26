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
  const ap = new firebase.auth.GoogleAuthProvider();
  ap.addScope('https://www.googleapis.com/auth/contacts.readonly');
  firebase.auth().languageCode = 'ja';

  firebase.auth().onAuthStateChanged(user=>{
    if (user) {
      $("#logoutButton").removeClass("d-none");
      $("#loginButton").addClass("d-none");
      $("#afterLoginDiv").removeClass("d-none");
      initFirestore();
    } else {
      $("#loginButton").removeClass("d-none");
      $("#logoutButton").addClass("d-none");
      $("#afterLoginDiv").addClass("d-none");
      console.log("ログインしていません"); //TODO delete
    }
  },error=>{
    outputError(error);
  });

  function outputError(errorMessage){
    console.error(errorMessage);
  }
  function login(){
    firebase.auth().signInWithRedirect(ap);
  }
  function logout(){
    firebase.auth().signOut().then(function() {
      console.log("Success: Logout"); //TODO delete
    }).catch((error)=>{
      outputError(error)
    });
  }
  $("#loginButton").click(login);
  $("#logoutButton").click(logout);

  function initFirestore(){

    function submitCSV(){

    const musicData=[
      ["恋になりたいアクアリウム","Aqours","アニメ"],
      ["君のこころは輝いてるかい？","Aqours","アニメ"],
      ["Next Sparkling","Aqours","アニメ"]
    ];

      const currentName = "m" + String(Math.floor(Math.random()*100000000)); //ガバガバ
      const batch = db.batch();

      batchLoop(0);
      function batchLoop(loopI){
        if(loopI<musicData.length){
          console.log(loopI);
          const ref = db.collection(currentName).doc(String(loopI+1));
          batch.set(ref, {
            title: musicData[loopI][0],
            artist: musicData[loopI][1],
            category: musicData[loopI][2]
          });
          batchLoop(loopI+1);
        }else{
          const ref = db.collection("appCore").doc("slide");
          batch.set(ref, {
            currentName: currentName,
            currentNum: 1
          });
        }
      }

      batch.commit().then(function () {
        console.log("Success: added Data! "); //TODO delete
      });
    }
    $("#submitCSVButton").click(submitCSV);

  }

})();