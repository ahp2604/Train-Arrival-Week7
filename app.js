$(document).ready(function(){
    // Initialize Firebase
    let config = {
            apiKey: "AIzaSyD8UF-uL_-OiyrhCSr5NR6D07_FscchwAg",
            authDomain: "trainarrival-bed6e.firebaseapp.com",
            databaseURL: "https://trainarrival-bed6e.firebaseio.com",
            projectId: "trainarrival-bed6e",
            storageBucket: "",
            messagingSenderId: "152371570589"
          
    };
    firebase.initializeApp(config);

    let database = firebase.database();


    //Set variables
    let trainName = "";
    let location = "";
    let inputTrainTime = "";
    let frequency = 0;



    $("#add-train").on("click", function (event) {
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        location = $("#destination").val().trim();
        inputTrainTime = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        //converting time
        let convertedTrainTime = moment(inputTrainTime,"HH:mm").subtract(2, "years");
        let diffInTime = moment().diff(moment(convertedTrainTime), "minutes");
        let remainder = diffInTime % frequency;

        //Minutes until the next train
        let nextTrainTimeLeft = frequency - remainder;

        //Time that next train will arrive
        let nextTrainTime = moment().add(nextTrainTimeLeft, "minutes").format("HH:mm");


        database.ref().push({

            trainName: trainName,
            location: location,
            inputTrainTime: inputTrainTime,
            frequency: frequency,
            nextTrainTime: nextTrainTime,
            nextTrainTimeLeft: nextTrainTimeLeft,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");

    });

    database.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function (childSnapshot) {



        $("#full-table").append("<tr> " +
            " <td> " + childSnapshot.val().trainName +
            " </td><td> " + childSnapshot.val().location +
            " </td><td> " + childSnapshot.val().frequency +
            " </td><td> " + childSnapshot.val().nextTrainTime +
            " </td><td> " + childSnapshot.val().nextTrainTimeLeft +
            "</tr>");





    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });


});
