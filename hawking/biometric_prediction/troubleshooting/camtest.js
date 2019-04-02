const NodeWebcam = require( "node-webcam" );

//image attributes
var opts = {

    width: 360,
    height: 360,
    delay: 0,
    quality: 100,
    output: "jpeg",
    verbose: true //,
    // device: "HD Pro Webcam C920"

}

//create a new webcam object with the given attributes
var Webcam = NodeWebcam.create( opts );


Webcam.capture( "public/images/test.jpg" );
