var Twitter = require('twitter')
var fs    = require("fs");
var config = require('./config.js')
var json2csv = require('json2csv');

var client = new Twitter({
    consumer_key: config.conkey,
    consumer_secret: config.consecret,
    access_token_key: config.accesskey,
    access_token_secret: config.accesssecret
  })



var fields = ['id_str','created_at','text', 'user.screen_name','user.lang','coordinates.coordinates'];
var newLine= "\r\n";
  
  
client.stream('statuses/filter', {
          track: 'future'
  
      }, function(tweetStream) {
  
          tweetStream.on('data', function(tweet) {
  //            console.log(tweet.)
  //            _cheesyTweet(tweet);
              var toCSV = { data: tweet, fields: fields, hasCSVColumnTitle: false };
  //            console.log(tweet.text);
  //            console.log(tweet.user.screen_name);
  //            console.log(tweet);
              fs.stat('futuretweets.csv', function (err, stat) {
                  if (err == null) {
                      console.log('File exists');
                      var csv = json2csv(toCSV) + newLine;
                      console.log(csv);
                      fs.appendFile('futuretweets.csv', csv, function (err) {
                          if (err) throw err;
                          console.log('The "data to append" was appended to file!');
                      });
                  }
                  else {
                      console.log('New file, just writing headers');
                      fields= (fields + newLine);
  
                      fs.writeFile('futuretweets.csv', fields, function (err, stat) {
                          if (err) throw err;
                          console.log('file saved');
                      });
                  }
              });
          });
});