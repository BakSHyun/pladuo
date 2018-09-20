// Initialize Firebase
var config = {
  apiKey: "AIzaSyABaP133_fnfDBmqZpe0d1Ievww3hVnCyo",
  authDomain: "pladuo-business.firebaseapp.com",
  databaseURL: "https://pladuo-business.firebaseio.com",
  projectId: "pladuo-business",
  storageBucket: "pladuo-business.appspot.com",
  messagingSenderId: "109849546086"
};
firebase.initializeApp(config);
var besiness_man_db = db.collection("besiness_man");
var doctor_db = db.collection("besiness_man");
var manager_db = db.collection("manager");
var process_db = db.collection("process");
var clndr_db = db.collection("clndr");
besiness_man_db.onSnapshot(function(querySnapshot) {
    var cities = [];
    querySnapshot.forEach(function(doc) {
        cities.push(doc.data().name);
    });
    console.log("Current cities in CA: ", cities.join(", "));
});
