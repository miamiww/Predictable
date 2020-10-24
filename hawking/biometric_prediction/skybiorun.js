const NodeWebcam = require( "node-webcam" );
const random = require('random');
const fs = require('fs');
const skybiometry = require('skybiometry');
const config = require('./config.js')
const client = new skybiometry.Client(config.key1, config.key2);
const interpretations = JSON.parse(fs.readFileSync('interpretations.json', 'utf8'));
let characterName = process.argv[2];
const MBTI = [["E", "I"],["N","S"],["F","T"],["P","J"]];

const astrologicalSigns = ["aries", "leo", "sagittarius","taurus", "virgo", "capricorn","gemini", "libra", "aquarius","cancer", "scorpio", "pisces"];
const politics = ["liberalism", "anarcho-collectivism","anarcho-socialism","anarcho-communism","syndicalism","mutualism","social democracy","socialism","statism","authoritarianism","traditionalism","capitalism", "fundamentalism","progressivism","libertarianism","anarcho-capitalism"];
let politicsValue = politics[Math.floor(Math.random()*politics.length)];

const origins = ["Gliese 412","Omicron2 Eridani", "Altair","Alpha Centauri","Groombridge 34","Teegarden's Star","AD Leonis","Van Maanen's Star","YZ Ceti"]
let  origin = origins[Math.floor(Math.random()*origins.length)]

const descriptionsIn = JSON.parse(fs.readFileSync('descriptions.json', 'utf8'));
const descriptors = descriptionsIn.descriptions
const personalities = ["introverted","extroverted"]
let personality = personalities[Math.floor(Math.random()*personalities.length)] + " and " + descriptors[Math.floor(Math.random()*descriptors.length)]

//setting up the date
function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
let timeID = getDateTime();
let fileRoute = characterName + "Image";

//image attributes
var opts = {

    width: 360,
    height: 360,
    delay: 0,
    quality: 100,
    output: "jpeg",
    verbose: true,
    device: "FaceTime HD Camera"// "Webcam C170" "HD Pro Webcam C920 #3" "FaceTime HD Camera"
}

let prediction="";
for(var i=0;i<3;i++){
  let likesTop = random.int(min=1, max=70);
  let numPredicts = interpretations.tarot_interpretations[likesTop].fortune_telling.length
  let predictsTop = random.int(min=0, max=numPredicts-1);
  predictionTest = interpretations.tarot_interpretations[likesTop].fortune_telling[predictsTop] +"\n";
  while(predictionTest.includes("This card")){
    likesTop = random.int(min=1, max=70);
    numPredicts = interpretations.tarot_interpretations[likesTop].fortune_telling.length
    predictsTop = random.int(min=0, max=numPredicts-1);
    predictionTest = interpretations.tarot_interpretations[likesTop].fortune_telling[predictsTop] +"\n";
  }
  prediction = prediction + predictionTest;
}

//create a new webcam object with the given attributes
const Webcam = NodeWebcam.create( opts );



const takePicture = () => {
  Webcam.capture( fileRoute);
  setTimeout(sendPicture, 3000);
}
//watch the image folder for changes, send any changed images to the api
//console log the results

const sendPicture = () => {
  client.faces.detect( { files: fs.createReadStream(fileRoute + ".jpg"), attributes: "all" })
  .then( function(result){
    //console.log(result);
    var parsedresults = JSON.parse(result);
  
    if(parsedresults.photos[0].tags[0] != undefined){
      //facial attributes get printed out here

      let sendstring = "Future's Market thanks you for making a successful purchase :) \nhttp://future.click\n\n" +  "Gender: " + parsedresults.photos[0].tags[0].attributes.gender.value + "\n" + "Glasses: " + parsedresults.photos[0].tags[0].attributes.glasses.value + "\n" + "Smiling: " + parsedresults.photos[0].tags[0].attributes.glasses.value + "\n" + "Age: " + parsedresults.photos[0].tags[0].attributes.age_est.value + "\n" + "Mood: " + parsedresults.photos[0].tags[0].attributes.mood.value + "\n" + "Eyes: " + parsedresults.photos[0].tags[0].attributes.eyes.value + "\n" + "Lips: " + parsedresults.photos[0].tags[0].attributes.lips.value;
      // console.log(sendstring);
      let attributes = "\n" + "Personality: " + personality + "\n" + "Politics: " + politicsValue + "\n" + "Primordial Origins: " + "\n" +"  Sol: 96.78%"+ "\n  " + origin+": 1.38%" + "\n" + "  Other: 1.84%"
      charSheet = "\n\nYour Name: " + characterName + "\n" + "\n" + sendstring + attributes + "\n"+ "\n"+ "Scenes From Your Future: "  + "\n"+ prediction +"\n\n";
      console.log(charSheet);
      f_name = characterName +'Prediction.txt';
      //writes a file with the character sheet and then prints it out as a callback function
      fs.writeFile(f_name, charSheet, (err) => {  
          // throws an error, you could also catch it here
          if (err) throw err;
  
          // success case, the file was saved
        console.log('Sheet saved!');
          
      });
    } else{
      console.log("noface");
    }
  }); 
}

takePicture(sendPicture);
