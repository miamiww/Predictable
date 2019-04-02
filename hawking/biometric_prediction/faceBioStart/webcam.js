const NodeWebcam = require( "node-webcam" );
const fs = require('fs');
const skybiometry = require('skybiometry');
var config = require('./config.js')
const client = new skybiometry.Client(config.key1, config.key2);
const express = require("express");
const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);

//on a request to / serve index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));


//image attributes
var opts = {

    width: 360,
    height: 360,
    delay: 0,
    quality: 100,
    output: "jpeg",
    verbose: true,
    device: "HD Pro Webcam C920"


}

//create a new webcam object with the given attributes
var Webcam = NodeWebcam.create( opts );


//Will automatically append location output type
setInterval(function()
  { Webcam.capture( "public/images/test_image" ); },
  36000
);



//watch the image folder for changes, send any changed images to the api
//console log the results
fs.watch('./public/images', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {

      client.faces.detect( { files: fs.createReadStream('./public/images/' + filename), attributes: "all" })
      .then( function(result){
        //console.log(result);
        var parsedresults = JSON.parse(result);

        if(parsedresults.photos[0].tags[0] != undefined){
          //facial attributes get printed out here
          sendstring = "Gender: " + parsedresults.photos[0].tags[0].attributes.gender.value + " Glasses:" + parsedresults.photos[0].tags[0].attributes.glasses.value + " Smiling:" + parsedresults.photos[0].tags[0].attributes.glasses.value + " Age:" + parsedresults.photos[0].tags[0].attributes.age_est.value + " Mood:" + parsedresults.photos[0].tags[0].attributes.mood.value + "  Eyes:" + parsedresults.photos[0].tags[0].attributes.eyes.value + " Lips:" + parsedresults.photos[0].tags[0].attributes.lips.value // + " Neutral Mood:" + parsedresults.photos[0].tags[0].attributes.neutral_mood.value + " Anger:" + parsedresults.photos[0].tags[0].attributes.anger.value + " Fear:" + parsedresults.photos[0].tags[0].attributes.fear.value + " Disgust:" + parsedresults.photos[0].tags[0].attributes.disgust.value + " Happiness:" + parsedresults.photos[0].tags[0].attributes.happiness.value + " Sadness:" + parsedresults.photos[0].tags[0].attributes.sadness.value + " Surprise:" + parsedresults.photos[0].tags[0].attributes.surprise.value
          console.log(sendstring);
          io.sockets.emit('mysocket', sendstring);
//          app.get("/", function(req, res) {
           //res.send("images/test_image.jpg");

  //         res.send(parsedresults.photos[0].tags[0].attributes);

//          });
        } else{
          console.log("noface");
        }
      });

    } else {
        console.log('filename not provided');
    }
});
