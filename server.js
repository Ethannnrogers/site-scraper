var express = require("express");
var handlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var path = require("path");
var axios = require("axios");
var logger = require("morgan");


var db = require("./models");
var PORT = 5000;
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost/site_scraper");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {});


//Routessssssss
app.get("/scrape", function(req, res) {

  // if (req) {
  //   db.Article.remove({}, function (err) {
  //     console.log("dropped Articles");
  //   })
  // }
  
  //uhh idk what this does
  axios.get("https://www.nytimes.com/").then(function(response) {
    //load something to cheerio and save it as $
    var $ = cheerio.load(response.data);
    var results = [];
    $("h2.story-heading").each(function(i, element) {
      var link = $(element).children().attr("href");
      var title = $(element).children().text();
      
      
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
      title: title,
      link: link
        });
      });
      
      $("p.summary").each(function(i, element) {
      
        var summary = $(element).children().text();
      
        results.push({
          summary: summary
        });
      });

      db.Articles.create(results)
      .then(function(dbArticles) {
        console.log(dbArticles);
      })
      .catch(function(err) {
        return res.json(err);
      });
      
      res.send("Scrape Complete");
    });
  });


  //Route for getting the articles
  app.get("/articles", function(req, res) {
    db.Articles.find({}).then(function(dbArticles) {
      res.json(dbArticles);
    })
    .catch(function(err) {
      res.json(err);
    });
  });


  //Route for grabbing a specific Article by id\
app.get("/articles/:id", function(req, res) {
  db.Articles.findOne({_id: req.params.id }).populate("notes").then(function(dbArticles) {
    res.json(dbArticles);
  })
  .catch(function(err) {
    res.json(err);
  });
});


//Route for saving/updating an Articles notes
app.post("/articles/:id", function(req, res) {
  db.Notes.create(req.body).then(function(dbNotes) {
    return db.Articles.findOneAndUpdate({ _id: req.params.id }, { note: dbNotes._id }, { new: true});
  })
  .then(function(dbArticles){
    res.json(dbArticles);
  })
  .catch(function(err) {
    res.json(err);
  });
});


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/html/index.html"));
  });


//Server is running
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});