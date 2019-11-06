const express = require("express");
var admin = require("firebase-admin");

var serviceAccount = require("./secrets/eid101-hydroponics-firebase-adminsdk-hzewo-dd144c511b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eid101-hydroponics.firebaseio.com"
});

var db = admin.firestore();
const app = express();
const port = 3000;

// DATABASES
let environments = db.collection("environments");
let sensors = db.collection("sensors");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/addEnvironment/:name/secret/:secret", (req, res) => {
  environments
    .where("name", "==", req.params.name)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        let addDoc = environments
          .add({
            name: req.params.name,
            passphrase: req.params.secret
          })
          .then(ref => {
            console.log("Added document with ID: ", ref.id);
            res.sendStatus(200);
          });
      } else {
        throw new Error("Name is taken");
      }
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return;
});

app.get("/joinEnvironment/:name/secret/:secret", (req, res) => {
  environments
    .where("name", "==", req.params.name)
    .where("passphrase", "==", req.params.secret)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        throw new Error("Name is taken");
      } else {
        snapshot.forEach(doc => {
          res.send(doc.id);
        });
      }
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  // res.sendStatus(200);
});

app.get("/sensor/:name/value/:val/env/:env", (req, res) => {
  // find if the sensor exists:
  // yes: record value
  // no: create sensor, record value
  sensors
    .where("name", "==", req.params.name)
    .where("env", "==", req.params.env)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        // create sensor
        sensors
          .add({
            name: req.params.name,
            env: req.params.env,
            value: req.params.val
          })
          .then(ref => {
            console.log("Added document with ID: ", ref.id);
            res.sendStatus(200);
          });
      } else {
        // update value
        snapshot.forEach(doc => {
          const docID = doc.id;
          sensors.doc(docID).update({ value: req.params.val });
        });
        res.sendStatus(200);
      }
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});

app.get("/read/:env", (req, res) => {
  sensors
    .where("env", "==", req.params.env)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        throw new Error("Add Some Sensors");
      } else {
        // update value
        var sensorArray = [];
        snapshot.forEach(doc => {
          sensorArray.push({
            name: doc.get("name"),
            value: doc.get("value")
          });
        });
        res.send(sensorArray);
      }
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
