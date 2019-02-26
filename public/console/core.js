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
  // ap.addScope('https://www.googleapis.com/auth/contacts.readonly');
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

    let currentName = null;
    let currentNum = null;
    let currentData = [];

    function submitCSV(){

      const tmp1 = $("#csvTextArea").val();
      if(!tmp1){
        outputError("データに不備があります");
        return false;
      }
      const tmp2 = tmp1.split("\n");
      const musicData = [];

      for(let i=0;i<tmp2.length;i++){
        musicData[i] = tmp2[i].split(','); //データにコンマが含まれていないとする
      }

      const currentName = "m" + String(Math.floor(Math.random()*100000000)); //ガバガバ
      const batch = db.batch();

      batchLoop(0);
      function batchLoop(loopI){
        if(loopI<musicData.length){
          const ref = db.collection(currentName).doc("m"+("0000"+loopI).slice(-5));
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
        location.reload();
      });
    }
    $("#submitCSVButton").click(submitCSV);

    function incrementNum(){
      currentNum++;
      if(currentNum>=currentData.length){
        currentNum = currentData.length-1;
      }
      updateHTML();
      db.collection("appCore").doc("slide").update({
        currentNum: currentNum
      });
    }
    $("#incrementButton").click(incrementNum);

    function decrementNum(){
      currentNum--;
      if(currentNum<0){
        currentNum = 0;
      }
      updateHTML();
      db.collection("appCore").doc("slide").update({
        currentNum: currentNum
      });
    }
    $("#decrementButton").click(decrementNum);

    function updateHTML(){
      $("#musicNumber").text(Number(currentNum)+1);
      $("#musicTitle").text(currentData[currentNum].title);
      $("#musicArtist").text(currentData[currentNum].artist);
      $("#musicCategory").text(currentData[currentNum].category);
      $("#tr-"+currentNum).addClass("table-secondary");
    }

    function setSnapshotEvent(){

      db.collection("appCore").doc("slide").onSnapshot((doc)=>{
        currentNum = String(doc.data().currentNum);
        if(currentName != doc.data().currentName){
          currentName = doc.data().currentName;
          getCollectionFromFirestore();
        }else{
          updateHTML();
        }
      },(error)=>{
        outputError(error);
      });

      function getCollectionFromFirestore() {
        db.collection(currentName).get().then((snap)=>{
          if (snap.docs[0].exists) {
            let tmp = "";
            currentData = [];
            snap.docs.forEach((doc,i)=>{
              currentData[i] = {
                title: doc.data().title,
                artist: doc.data().artist,
                category: doc.data().category
              }
              tmp = tmp + `<tr id="tr-${i}">
                <th scope="row">${i+1}</th>
                <td>${currentData[i].title}</td>
                <td>${currentData[i].artist}</td>
                <td>${currentData[i].category}</td>
              </tr>`;
            });
            $("#musicListTbody").html(tmp);
            updateHTML();
          } else {
            outputError("snap.docs[0] is undefined.");
          }
        }).catch(function(error) {
          outputError(error);
        });
      }

    }
    setSnapshotEvent();


  }

})();