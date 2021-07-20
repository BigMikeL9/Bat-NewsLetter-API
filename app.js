// jfhint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();


// allows us to pass the information that we get sent from the post request in the HTML
app.use(bodyParser.urlencoded({extended: true}));

// this method will let us use static files, such as css files and images (static filesare local files)
// the parameter "public" is a folder that is providing the path for our static files
// where we keep all the static file (css, image, etc)
// Lets us refer to the static files by a relative URL, whcih is relative to the "public" folder
app.use(express.static("public"));

// Route to Homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {
  const realName = req.body.fname;
  const secretName = req.body.lname;
  const email = req.body.email;


  const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: realName,
            LNAME: secretName
          }
        }
      ]
  };


  const jsonData = JSON.stringify(data);

  const url = "https:us6.api.mailchimp.com/3.0/lists/cd196794b5"

  const options = {
    method: "POST",
    auth: "mikel1:d2beec594059a710ee0e8ddd9d07bcbf-us6"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.send(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

request.write(jsonData);
request.end();

});


// Failure Route
app.post("/failure", function(req, res) {
  // redirects the user to the home rout when they press the "Try Again" button
  res.redirect("/");
});


// Setup Port
// "process.env.PORT" a dynamic port that heroku will define on the go
// will allow us to work with their system (servers)
// "|| 3000" means we can also listen on 3000 when we are running locally
// App will work both on Heroku and on our local system.
app.listen(process.env.PORT, function() {
  console.log("Server is running on port 3000");
});



// Mailchimp API key
//d2beec594059a710ee0e8ddd9d07bcbf-us6

// List Id
//cd196794b5
