"use strict";

var parseJson = require('parse-json');
var chokidar = require('chokidar');
var watcher = chokidar.watch('file, dir, glob, or array', {
    ignored: /[\/\\]\./,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    },
});



let inVal;
const skybiometry = require('skybiometry');
const client = new skybiometry.Client('', '');

var osc = require('node-osc');
var oscclient = new osc.Client('127.0.0.1', 3333);
console.log('Running...');
const filePath = 'imgcam.png';
var ret;


var oscServer = new osc.Server(3334, '127.0.0.1');
oscServer.on("message", function(msg, rinfo) {
    if (msg[0] == '/hi') {
        inVal = 1;
    } else {
        inVal = 0;
    }
});



// client.faces.detect({ files: filePath, attributes: "all" })
//     .then(function(result) {

//         console.log(result);

//         scan(result);

//     })



watcher.add('images/test_image.jpg');
var log = console.log.bind(console);



watcher.on('change', function(path) {
    var jsondata;
    var sendstring;
    log('File', path, 'has been added');
    client.faces.detect({ files: filePath, attributes: "all" })
        .then(function(result) {
            // console.log(result);
            // console.log(JSON.stringify(result));
            jsondata = parseJson(result);
            // oscclient.send('/faceData', result);
            // scan(result);

        }).then(function() {
            for (var i = 0; i < jsondata.photos.length; i++) {
                // console.log(jsondata.photos[i].tags[0].attributes.gender.value);
                sendstring = "Gender: " + jsondata.photos[i].tags[0].attributes.gender.value + " @Glasses:" + jsondata.photos[i].tags[0].attributes.glasses.value + " @Smiling:" + jsondata.photos[i].tags[0].attributes.glasses.value + " Age:" + jsondata.photos[i].tags[0].attributes.age_est.value + " @Mood:" + jsondata.photos[i].tags[0].attributes.mood.value + "  @Eyes:" + jsondata.photos[i].tags[0].attributes.eyes.value + " @Lips:" + jsondata.photos[i].tags[0].attributes.lips.value + " @Neutral Mood:" + jsondata.photos[i].tags[0].attributes.neutral_mood.value + "@Anger:" + jsondata.photos[i].tags[0].attributes.anger.value + " Fear:" + jsondata.photos[i].tags[0].attributes.fear.value + " @Disgust:" + jsondata.photos[i].tags[0].attributes.disgust.value + " Happiness:" + jsondata.photos[i].tags[0].attributes.happiness.value + " @Sadness:" + jsondata.photos[i].tags[0].attributes.sadness.value + " Surprise:" + jsondata.photos[i].tags[0].attributes.surprise.value
            }
        }).then(function() {
            console.log(sendstring);
            oscclient.send('/faceData', sendstring);
        });
})


// setInterval(function() {
//     console.log(inVal);
//     var jsondata;
//     var sendstring;
//     if (inVal === 1) {
//         client.faces.detect({ files: filePath, attributes: "all" })
//             .then(function(result) {
//                 // console.log(result);
//                 // console.log(JSON.stringify(result));
//                 jsondata = parseJson(result);
//                 // oscclient.send('/faceData', result);
//                 // scan(result);

//             }).then(function() {
//                 for (var i = 0; i < jsondata.photos.length; i++) {
//                     // console.log(jsondata.photos[i].tags[0].attributes.gender.value);
//                     sendstring = "Gender: " + jsondata.photos[i].tags[0].attributes.gender.value + " @Glasses:" + jsondata.photos[i].tags[0].attributes.glasses.value + " @Smiling:" + jsondata.photos[i].tags[0].attributes.glasses.value + " Age:" + jsondata.photos[i].tags[0].attributes.age_est.value + " @Mood:" + jsondata.photos[i].tags[0].attributes.mood.value + "  @Eyes:" + jsondata.photos[i].tags[0].attributes.eyes.value + " @Lips:" + jsondata.photos[i].tags[0].attributes.lips.value + " @Neutral Mood:" + jsondata.photos[i].tags[0].attributes.neutral_mood.value + "@Anger:" + jsondata.photos[i].tags[0].attributes.anger.value + " Fear:" + jsondata.photos[i].tags[0].attributes.fear.value + " @Disgust:" + jsondata.photos[i].tags[0].attributes.disgust.value + " Happiness:" + jsondata.photos[i].tags[0].attributes.happiness.value + " @Sadness:" + jsondata.photos[i].tags[0].attributes.sadness.value + " Surprise:" + jsondata.photos[i].tags[0].attributes.surprise.value
//                 }
//             }).then(function() {
//                 console.log(sendstring);
//                 oscclient.send('/faceData', sendstring);
//             });
//     }
// }, 3000)







/* eslint-disable no-console */



function scan(result) {
    if (result.includes("male") === true) {
        // console.log("subject is male");
        oscclient.send('/faceData', result, function() { oscclient.kill(); });
        // oscclient.send('/faceData', "subject is male", function() { oscclient.kill(); });
    } else if (result.includes("female") === true) {
        // console.log("subject is female");
        oscclient.send('/faceData', result, function() { oscclient.kill(); });
        // oscclient.send('/faceData', "subject is female", function() { oscclient.kill(); });
    }
}

// .then(result => console.log(result));

// .then(result => oscclient.send('/faceData', result, function () { oscclient.kill(); }));
