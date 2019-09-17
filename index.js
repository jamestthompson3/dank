function saveVisit(page) {
  if (firebase.firestore) {
    const database = firebase.firestore();
    // get user info
    const cityRef = database.collection("visitors").doc(page);
    window.location.hostname === "teukka.tech" &&
      cityRef
        .update({
          views: firebase.firestore.FieldValue.increment(1)
        })
        .catch(e => console.log(e));
  }
}

function addDoc(page) {
  if (firebase.firestore) {
    const db = firebase.firestore();
    db.collection("visitors")
      .doc(page)
      .set({
        views: 0
      });
  }
}

function configFirebase() {
  var firebaseConfig = {
    apiKey: "AIzaSyDMwmoqwQF3NHYZj0t-thcTkHxxpoif7II",
    authDomain: "website-analytics-95c13.firebaseapp.com",
    databaseURL: "https://website-analytics-95c13.firebaseio.com",
    projectId: "website-analytics-95c13",
    storageBucket: "",
    messagingSenderId: "955443397652",
    appId: "1:955443397652:web:82e51e31def99888129301"
  };
  if (firebase) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
