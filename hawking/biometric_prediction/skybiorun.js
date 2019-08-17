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
const politics = ["left", "left","left","right"];
const interests = ["Business and Industry",
"Advertising",
"Agriculture",
"Architecture",
"Aviation",
"Banking",
"Investment banking",
"Online banking",
"Retail banking",
"Business",
"Construction",
"Design",
"Fashion design",
"Graphic design",
"Interior design",
"Economics",
"Engineering",
"Entrepreneurship",
"Health care",
"Higher education",
"Management",
"Marketing",
"Nursing",
"Online",
"Digital marketing",
"Display advertising",
"Email marketing",
"Online advertising",
"Search engine optimization",
"Social media",
"Social media marketing",
"Web design",
"Web development",
"Web hosting",
"Personal finance",
"Creditcards",
"Insurance",
"Investment",
"Mortgage loans",
"Real estate",
"Retail",
"Sales",
"Science",
"Small business",
"Entertainment",
"Games",
"Action games",
"Board games",
"Browser games",
"Card games",
"Casino games",
"First-person shooter games",
"Gambling",
"Massively multiplayer online games",
"Massively multiplayer online role-playing games",
"Online games",
"Online poker",
"Puzzle video games",
"Racing games",
"Role-playing games",
"Shooter games",
"Simulation games",
"Sports games",
"Strategy games",
"Video games",
"Word games",
"Live events",
"Ballet",
"Bars",
"Concerts",
"Dancehalls",
"Music festivals",
"Nightclubs",
"Parties",
"Plays",
"Theatre",
"Movies",
"Action movies",
"Animated movies",
"Anime movies",
"Bollywood movies",
"Comedy movies",
"Documentary movies",
"Drama movies",
"Fantasy movies",
"Horror movies",
"Musical theatre",
"Science fiction movies",
"Thriller movies",
"Music",
"Blues music",
"Classical music",
"Country music",
"Dance music",
"Electronic music",
"Gospel music",
"Heavy metal music",
"Hip hop music",
"Jazz music",
"Music videos",
"Pop music",
"Rhythm and blues music",
"Rock music",
"Soul music",
"Reading",
"Books",
"Comics",
"E-books",
"Fiction books",
"Literature",
"Magazines",
"Manga",
"Mystery fiction",
"Newspapers",
"Non-fiction books",
"Romance novels",
"TV",
"TV comedies",
"TV game shows",
"TV reality shows",
"TV talkshows",
"Family and relationships",
"Dating",
"Family",
"Fatherhood",
"Friendship",
"Marriage",
"Motherhood",
"Parenting",
"Weddings",
"Fitness and wellness",
"Bodybuilding",
"Meditation",
"Physical exercise",
"Physical fitness",
"Running",
"Weight training",
"Yoga",
"Food and drink",
"Alcoholic beverages",
"Beer",
"Distilled beverage",
"Wine",
"Beverages",
"Coffee",
"Energy drinks",
"Juice",
"Soft drinks",
"Tea",
"Cooking",
"Baking",
"Recipes",
"Cuisine",
"Chinese cuisine",
"French cuisine",
"German cuisine",
"Greek cuisine",
"Indian cuisine",
"Italian cuisine",
"Japanese cuisine",
"Korean cuisine",
"Latin American cuisine",
"Mexican cuisine",
"Middle Eastern cuisine",
"Spanish cuisine",
"Thai cuisine",
"Vietnamese cuisine",
"Food",
"Barbecue",
"Chocolate",
"Desserts",
"Fast food",
"Organic food",
"Pizza",
"Seafood",
"Veganism",
"Vegetarianism",
"Restaurants",
"Coffeehouses",
"Diners",
"Fast casual restaurants",
"Fast food restaurants",
"Hobbies and activities",
"Arts and music",
"Acting",
"Crafts",
"Dance",
"Drawing",
"Drums",
"Fine art",
"Guitar",
"Painting",
"Performing arts",
"Photography",
"Sculpture",
"Singing",
"Writing",
"Current events",
"Home and garden",
"Do it yourself (DIY)",
"Furniture",
"Gardening",
"Home Appliances",
"Home improvement",
"Pets",
"Birds",
"Cats",
"Dogs",
"Fish",
"Horses",
"Pet food",
"Rabbits",
"Reptiles",
"Politics and social issues",
"Charity and causes",
"Community issues",
"Environmentalism",
"Law",
"Military",
"Politics",
"Religion",
"Sustainability",
"Veterans",
"Volunteering",
"Travel",
"Adventure travel",
"Air travel",
"Beaches",
"Car rentals",
"Cruises",
"Ecotourism",
"Hotels",
"Lakes",
"Mountains",
"Nature",
"Theme parks",
"Tourism",
"Vacations",
"Vehicles",
"Automobiles",
"Boats",
"Electric vehicle",
"Hybrids",
"Minivans",
"Motorcycles",
"RVs",
"SUVs",
"Scooters",
"Trucks",
"Shopping and fashion",
"Beauty",
"Beauty salons",
"Cosmetics",
"Fragrances",
"Hair products",
"Spas",
"Tattoos",
"Clothing",
"Children’s clothing",
"Men’s clothing",
"Shoes",
"Women’s clothing",
"Fashion accessories",
"Dresses",
"Handbags",
"Jewelry",
"Sunglasses",
"Shopping",
"Boutiques",
"Coupons",
"Discount stores",
"Luxury goods",
"Online shopping",
"Shopping malls",
"Toys",
"Sports and outdoors",
"Outdoor recreation",
"Boating",
"Camping",
"Fishing",
"Horseback riding",
"Hunting",
"Mountain biking",
"Surfing",
"Sports",
"American football",
"Association football (Soccer)",
"Auto racing",
"Baseball",
"Basketball",
"College football",
"Golf",
"Marathons",
"Skiing",
"Snowboarding",
"Swimming",
"Tennis",
"Thriathlons",
"Volleyball",
"Technology",
"Computers",
"Computer memory",
"Computer monitors",
"Computer processors",
"Computer servers",
"Desktop computers",
"Free software",
"Hard drives",
"Network storage",
"Software",
"Tablet computers",
"Consumer electronics",
"Audio equipment",
"Camcorders",
"Cameras",
"E-book readers",
"GPS devices",
"Game consoles",
"Mobile phones",
"Portable media players",
"Projectors",
"Smartphones",
"Televisions"]
const origins = [""]
//const personality = ["introverted","extroverted"]

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
let fileRoute = "public/images/test_image_"+ timeID;

//image attributes
var opts = {

    width: 360,
    height: 360,
    delay: 0,
    quality: 100,
    output: "jpeg",
    verbose: true,
    device: "HD Pro Webcam C920"// "Webcam C170"
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
let theInterests = "";
for(var i=0; i< 5;i++){
  let interestsTop = random.int(min=0, max=interests.length-1)
  theInterests = theInterests + interests[interestsTop] + "\n" ;
}

//create a new webcam object with the given attributes
const Webcam = NodeWebcam.create( opts );



const takePicture = () => {
  Webcam.capture( "public/images/test_image_"+ timeID);
  setTimeout(sendPicture, 3000);
}
//watch the image folder for changes, send any changed images to the api
//console log the results

const sendPicture = () => {
  client.faces.detect( { files: fs.createReadStream('./public/images/' + "test_image_"+ timeID + ".jpg"), attributes: "all" })
  .then( function(result){
    //console.log(result);
    var parsedresults = JSON.parse(result);
  
    if(parsedresults.photos[0].tags[0] != undefined){
      //facial attributes get printed out here
      var signValue = random.int(min=0,max=11);
      var politicsValue = random.int(min=0,max=3);
      let sendstring = "Future's Market thanks you for making a successful purchase :) \nhttp://future.click\n\n" +  "Gender: " + parsedresults.photos[0].tags[0].attributes.gender.value + "\n" + " Glasses: " + parsedresults.photos[0].tags[0].attributes.glasses.value + "\n" + " Smiling: " + parsedresults.photos[0].tags[0].attributes.glasses.value + "\n" + " Age: " + parsedresults.photos[0].tags[0].attributes.age_est.value + "\n" + " Mood: " + parsedresults.photos[0].tags[0].attributes.mood.value + "\n" + "  Eyes: " + parsedresults.photos[0].tags[0].attributes.eyes.value + "\n" + " Lips: " + parsedresults.photos[0].tags[0].attributes.lips.value;
      // console.log(sendstring);
      let attributes = "\n" + " Politics: " + politics[politicsValue] + "\n" + " Primordial Origins: " + "\n" +"Sol: 96.78%"+ "\n" + "Blue Snowball Nebula: 1.38%" + "\n" + "Other: 1.84%"
      charSheet = "\n\nYour Name: " + characterName + "\n" + "\n" + sendstring + attributes + "\n" + "\n" + "Your Interests: "+ "\n" + theInterests+ "\n"+ "\n"+ "Your Future: "  + "\n"+ prediction;
      console.log(charSheet);
      f_name = 'Prediction'+characterName+'.txt';
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
