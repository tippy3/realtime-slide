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

  db.collection("appCore").doc("slide").onSnapshot((doc)=>{
    const num = String(doc.data().currentNum);
    const name = doc.data().currentName;
    getDataFromFirestore(name,num);
  },(error)=>{
    outputError(error);
  });

  function getDataFromFirestore(name,num) {
    db.collection(name).doc(num).get().then((doc)=>{
      if (doc.exists) {
        const title = doc.data().title;
        const artist = doc.data().artist;
        const category = doc.data().category;
        $("#music-number").text("#"+num);
        $("#music-title").text(title);
        $("#music-artist").text(artist);
        $("#music-category").text(category);
        console.log("Document data:", doc.data()); //TODO: delete
      } else {
        outputError("doc.data() is undefined.");
      }
    }).catch(function(error) {
      outputError(error);
    });
  }

  function outputError(errorMessage){
    console.error(errorMessage);
    $("#music-number").text("エラー");
    $("#music-title").text("ページをリロードしてください");
    $("#music-artist").text(errorMessage);
    $("#music-category").text("エラー");
  }


})();