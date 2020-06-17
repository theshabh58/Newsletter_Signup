//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');

//create a new instance of application
const app = express();
//used for location elemets -- css, images
app.use(express.static("public"));
//used to retrieve data sent from website
app.use(bodyParser.urlencoded({extended: true}));

//Main route for setting up webpage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Handle request from Signup form
app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.emailAddress;
  //Setup payload for -- Mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  //Convert from object --> JSON
  const jsonData = JSON.stringify(data);
  //Setup request
  const url = "MAILCHIP_API_URL_HERE";
  const options = {
    method: "POST",
    auth: "API_KEY_HERE"
  };
  const request = https.request(url, options, function(response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  //Send Request
  request.write(jsonData);
  request.end();
});

//Setup redirect to SignUp page if an error occurs
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//Listen for requests on server
app.listen(process.env.PORT || 3000, function(){
  console.log("Serving application on port:");
});
