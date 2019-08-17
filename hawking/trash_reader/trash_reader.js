const random = require('random');
const util = require('util');
const fs = require('fs');
var briggs = JSON.parse(fs.readFileSync('briggsmeyer.json', 'utf8'));
let characterName = process.argv[2];
let objectName = process.argv[3];


let personality_number = random.int(min=0, max=15)
let type = briggs.personalities[personality_number].name
let description = briggs.personalities[personality_number].description

// likes="";
// dislikes="";
// for(var i=0;i<3;i++){
// 	let likesTop = random.int(min=1, max=70);
// 	let likeR = random.int(min=0, max=3);
// 	likes = likes + interpretations.tarot_interpretations[likesTop].meanings.shadow[likeR] +"\n";
// 	dislikes = dislikes + interpretations.tarot_interpretations[likesTop].meanings.light[likeR] +"\n";
// }

	
// console.log("Your Name: " + characterName)
// console.log("Position: " + yourJob);
// console.log("")
// console.log("All characterists on 1-10 scale: 1 is low and 10 is high");
// console.log(character_stats);
// console.log("Your likes: "+ "\n" + likes);
// console.log("Your dislikes: "+ "\n" + dislikes);

// console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));


var logo_text = "\n\nFuture's Market thanks you for making a successful purchase :) \nhttp://future.click\n\n"

charSheet = logo_text + "Your Name: " + characterName + "\n" +"Your trash object: " + objectName+"\n\n" +characterName + ", you are a " +type + "\n" + description;
console.log(charSheet);
f_name = 'CharacterSheet'+characterName+'.txt';
//writes a file with the character sheet and then prints it out as a callback function
fs.writeFile(f_name, charSheet, (err) => {  
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
	console.log('Sheet saved!');
		
});

