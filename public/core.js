(() => {

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyA-49AtZBie_kaneNXp4g3SNydE3HB1Zf4",
    authDomain: "realtime-slide-by-tippy.firebaseapp.com",
    databaseURL: "https://realtime-slide-by-tippy.firebaseio.com",
    projectId: "realtime-slide-by-tippy",
    storageBucket: "realtime-slide-by-tippy.appspot.com",
    messagingSenderId: "529086843504"
  };
  firebase.initializeApp(config);

  let db = firebase.firestore();

  db.collection("appCore").doc("slide").onSnapshot(function(doc) {
    const num = String(doc.data().currentNum);
    getDataFromFirestore(num);
  });

  function getDataFromFirestore(num) {
    let docRef = db.collection("music").doc(num);
    docRef.get().then((doc)=> {
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