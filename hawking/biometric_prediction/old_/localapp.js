// const NodeWebcam = require( "node-webcam" );
const fs = require('fs');
const skybiometry = require('skybiometry');
var config = require('./config.js')
const client = new skybiometry.Client(config.key1, config.key2);
const express = require("express");
const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);

var astrologicalSigns = ["aries", "leo", "sagittarius","taurus", "virgo", "capricorn","gemini", "libra", "aquarius","cancer", "scorpio", "pisces"];
var politics = ["left", "left","left","right"];
var fortunes = ["Ahaaa yes I see it... Long walks down country lanes, the pleasant breeze scented with sweet summer air, and then ... POOF, all it goes away, a sudden gust, a falling rooftile, and you are undone. a sad fate, but of course the one that awaits us all, after all, to be done in by errant rooftiles. why my Uncle George died in much the same way, a country lane, the bees abuzz with all of life's wonders... what a beautiful scene it was, I remember it fondly"];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}



//on a request to / serve index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public' + '/index.html');
});

app.use(express.static(__dirname + '/public'));




io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('image',function(data){
      console.log("connected");
      console.log(data);
      var searchFor = "data:image/jpeg;base64,";
      var strippedImage = data.slice(data.indexOf(searchFor) + searchFor.length);
      var binaryImage = new Buffer(strippedImage, 'base64');
      console.log('between');
      console.log(binaryImage)
      fs.writeFileSync(__dirname + '/public/images/theimage' + Date.now() + '.jpg', binaryImage);

    });
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });

});

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
          var signValue = getRandomInt(0,11);
          var politicsValue = getRandomInt(0,3);
          sendstring = "Gender: " + parsedresults.photos[0].tags[0].attributes.gender.value + " Age: " + parsedresults.photos[0].tags[0].attributes.age_est.value + " Mood: " + parsedresults.photos[0].tags[0].attributes.mood.value;
          sendstring = sendstring + '\n ' + fortunes[0];
          console.log(sendstring);
          io.sockets.emit('mysocket', sendstring);
//          app.get("/", function(req, res) {
           //res.send("images/test_image.jpg");

  //         res.send(parsedresults.photos[0].tags[0].attributes);

//          });
        } else{
          var facehide = "I am afraid to say that you have not been completely honest with me, why hide from the truth when you are meant to be SEEN"
          console.log(facehide);
          io.sockets.emit('mysocket', facehide);
          console.log("noface");
        }
      });

    } else {
        console.log('filename not provided');
    }
});
