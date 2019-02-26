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
    const num = doc.data().currentNum;
    const name = doc.data().currentName;
    getDocFromFirestore(name,num);
  },(error)=>{
    outputError(error);
  });

  function getDocFromFirestore(name,num) {
    db.collection(name).doc( "m"+("0000"+num).slice(-5) ).get().then((doc)=>{
      if (doc.exists) {
        const title = doc.data().title;
        const artist = doc.data().artist;
        const category = doc.data().category;
        $("#music-number").text("#"+(num+1));
        $("#music-title").text(title);
        $("#music-artist").text(artist);
        $("#music-category").text(category);
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