const NodeWebcam = require( "node-webcam" );
const fs = require('fs');
const skybiometry = require('skybiometry');
var config = require('./config.js')
const client = new skybiometry.Client(config.key1, config.key2);
const express = require("express");
const app = express();
var osc = require('node-osc');
var oscclient = new osc.Client('127.0.0.1', 3333);

var chokidar = require('chokidar');
var watcher = chokidar.watch('file, dir, glob, or array', {
    ignored: /[\/\\]\./,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    },
});

//image attributes
var opts = {

    width: 360,
    height: 360,
    delay: 0,
    quality: 100,
    output: "jpeg",
    verbose: false

}

//create a new webcam object with the given attributes
var Webcam = NodeWebcam.create( opts );


//Will automatically append location output type
setInterval(function()
  { Webcam.capture( "images/test_image" ); },
  10000
);



//watch the image folder for changes, send any changed images to the api
//console log the results
fs.watch('images', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {

      client.faces.detect( { files: fs.createReadStream('./images/' + filename), attributes: "all" })
      .then( function(result){
        //console.log(result);
        var parsedresults = JSON.parse(result);

        if(parsedresults.photos[0].tags[0] != undefined){
          //facial attributes get printed out here

          console.log(parsedresults.photos[0].tags[0].attributes);
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
