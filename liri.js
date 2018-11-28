require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify); // not currently working
var axios = require("axios");
var fs = require('fs');
var moment = require('moment');
moment().format();

var liriCommand = process.argv[2];
var arg = process.argv[3];

//build switch statement to run each function based on what user enters in command line


function runLiri () {
switch (liriCommand) {
    case 'concert-this':
        concertThis(arg);
        break;
    case 'spotify-this-song':
        spotifyThis(arg);
        break;
    case 'movie-this':
        movieThis(arg);
        break;
    case 'do-what-it-says':
        doThis(arg);
        break;
};
};
    //Commands needed:

    //concert-this
    //search bands in town api for an artist 
    function concertThis() {
        var artist = process.argv.slice(3).join(' ');
        console.log(artist);
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        //and return the following:
        //Name of venue
        //Venue Location
        //Date of Event
        axios.get(queryURL).then(
            function (response) {
                var result = response.data;
                for (var i = 0; i < result.length; i++) {
                    var datetime = response.data[i].datetime;
                    var dateArr = datetime.split('T');
                    console.log("======================================================");
                    console.log("Venue: " + result[i].venue.name +
                        "\nLocation: " + result[i].venue.city + ", " + result[i].venue.country +
                        "\nDate: " + moment(dateArr[0]).format("MM/DD/YYYY"));
                    console.log("======================================================");
                    
                    fs.appendFile('./log.txt', "\nVenue: " + result[i].venue.name +
                    "\nLocation: " + result[i].venue.city + ", " + result[i].venue.country +
                    "\nDate: " + moment(dateArr[0]).format("MM/DD/YYYY") + "\n==========================================", function (err) {
                    if (err) {
                        return console.log(err);
                } else { console.log("log.txt was updated");
            }
            })
                }
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data)
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                console.log(error.config);
            }

            )
    }

    //spotify-this-song
    //search song name 
    function spotifyThis () {
        var song = process.argv.slice(3).join('+');
        console.log(song);
        //if no song is provided -- default to Ace of Base, "I Saw the Sign"
        if (!song) {
            song = "the sign year:1993";
        }
        spotify.search({
            type: 'track',
            query: song,
            limit: 1
        })
            //display:
            //Artist
            //Song name
            //Preview link from spotify
            //Album that the song is from
            .then(function (response) {
                
                    var result = response.tracks;
                    console.log("======================================================");
                    console.log("Artist: " + result.items[0].artists[0].name +
                        "\nSong Name: " + result.items[0].name +
                        '\nPreview: ' + result.items[0].preview_url +
                        "\nAlbum: " + result.items[0].album.name);
                    console.log("======================================================");
                    
                    fs.appendFile('./log.txt', "\nArtist: " + result.items[0].artists[0].name +
                    "\nSong Name: " + result.items[0].name +
                    '\nPreview: ' + result.items[0].preview_url +
                    "\nAlbum: " + result.items[0].album.name + "\n==========================================", function (err) {
                    if (err) {
                        return console.log(err);
                } else { console.log("log.txt was updated");
            }
            })
                
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    //movie-this
    //search movie title 
    function movieThis () {
        var movieName = process.argv.slice(3).join(' ');
        console.log(movieName);
        if (!movieName) {
            movieName = 'Mr Nobody';
        }
        var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        //and display
        //Title of the movie
        //Year movie came out
        //IMDB Rating
        //Rotten Tomatoes score
        //Country where the movie was produced
        //Language of the movie
        //Plot of the movie
        //Actors in the movie
        axios.get(queryURL).then(
            function (response) {
                var result = response.data;
                console.log("======================================================");
                console.log('Title: ' + result.Title + '\nYear of Release: ' + result.Year + '\nIMDB Rating: ' + result.imdbRating +
                    '\nRotten Tomatoes Rating: ' + result.Ratings[1].Value + '\nCountry: ' + result.Country +
                    '\nLanguage: ' + result.Language + '\nPlot: ' + result.Plot + '\nActors: ' + result.Actors);
                console.log("======================================================");

                fs.appendFile('./log.txt', '\nTitle: ' + result.Title + '\nYear of Release: ' + result.Year + '\nIMDB Rating: ' + result.imdbRating +
                '\nRotten Tomatoes Rating: ' + result.Ratings[1].Value + '\nCountry: ' + result.Country +
                '\nLanguage: ' + result.Language + '\nPlot: ' + result.Plot + '\nActors: ' + result.Actors + "\n==========================================", function (err) {
                    if (err) {
                        return console.log(err);
                } else { console.log("log.txt was updated");
            }
            })
        }
        ).catch(function (error) {
            console.log(error);
        })
    }


    //do-what-it-says
    //use fs to take the text from random.txt and use it to call a liri command
    function doThis () {
        fs.readFile('./random.txt', 'utf8', function (error, data) {
            if (error) {
                return console.log(error);
            }

            liriCommand = data.split(",")[0].trim();
            arg = data.split(",")[1].trim();

            runLiri();
            

        })
    }


runLiri();
