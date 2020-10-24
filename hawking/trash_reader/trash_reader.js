const random = require('random');
const util = require('util');
const fs = require('fs');
let characterName = process.argv[2];
let objectName = process.argv[3];

const mantras = JSON.parse(fs.readFileSync('personality_test.json', 'utf8'));


let personality_number = random.int(min=0, max=300)
let mantra = mantras.personality_test[personality_number]
mantra = "\""+mantra+ "\""
console.log(mantra)

var logo_text = "\n\nFuture's Market thanks you for making a successful purchase :) \nhttp://future.click\n\n"

charSheet = logo_text + "Your Name: " + characterName + "\n" +"Your trash object: " + objectName+"\n\n" +characterName + ", this is your mantra:"  +"\n\n" +mantra;
charSheet = charSheet + "\n\n" + "For best results, repeat your mantra thrice daily at 9AM, 12PM, and 9PM."
charSheet = charSheet + "\n" + "That's thrice daily as in, you say it three times each and every day, but each time you say it you only need to say it once."
charSheet = charSheet + "\n" + "So at 9AM you say " + mantra + " (only once), and then once again at noon and 9PM, each time only once. I don't know what happens if you say it more than that each time, I've never tried it myself. If you do try it could you let me know what happens?" 

charSheet = charSheet + "\n\n" + "Anyway, good luck!"
charSheet = charSheet + "\n\n"

console.log(charSheet);
f_name = characterName+'CharacterSheet'+'.txt';
//writes a file with the character sheet and then prints it out as a callback function
fs.writeFile(f_name, charSheet, (err) => {  
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
	console.log('Sheet saved!');
		
});

