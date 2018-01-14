var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//Campground.create(
//    {
//        name: "Granite Hill",
//        image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg",
//        description: "This is a huge granite hill. No bathroom, no water. Just granite."
//
//    },  function(err, campground){
//            if(err)
//            {
//                console.log(err);
//            }
//            else
//            {
//                console.log("Newly created campground ....");
//                console.log(campground);
//            }
//});
    

app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine", "ejs");


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //get all the data from database
    Campground.find({}, function(err, allCampgrounds){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {campgrounds: allCampgrounds});             
        }
    });
    
});

app.post("/campgrounds", function(req, res){
   //get data from form and add it to campground array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name: name, image: image, description: desc};
   //create a new campground and save to DB
   Campground.create(newCampground, function(err, newlyCreated){
       if(err)
       {
           console.log(err);
       }
       else
       {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");       
       }
   });
   
});

app.get("/campgrounds/new", function(req, res){
    res.render("form.ejs");
});

app.get("/campgrounds/:id", function(req, res){
    //find campground with that id
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err)
       {
           console.log(err);
       }
       else
       {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started !");
});