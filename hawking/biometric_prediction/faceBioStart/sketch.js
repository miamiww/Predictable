//var fs = require('fs');

var button;
var capture;
var snapshots = [];

function setup() {
  createCanvas(800, 240);
//  background(51);
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  button = createButton('snap');
  button.mousePressed(takesnap);
  capture.hide();
}

function takesnap() {
  snapshots.push( capture.get() );
//  snapshots[0].save();
//  fs.writeFile("out.png", snapshots, 'base64', function(err) {
//  console.log(err);
//});
}

function draw() {
  var w = 80;
  var h = 60;
  var x = 0;
  var y = 0;
  for(var i = 0; i < snapshots.length; i++){
//    tint(255,20);
    image(snapshots[i],x,y, w, h);
    x = x + w;
    if(x > width) {
      x = 0;
      y = y + h;
    }
//    y = y + h;
  }
//  background(255);
//  image(capture, 0, 0, 320, 240);
//  filter('INVERT');
}
