var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
   res.render("landing");
});


// AUTH ROUTES
router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
   var newUser = User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){
          req.flash("error", err.message);
          return res.redirect("/register");
      } 
      passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to YelpCamp!" + user.username);
          return res.redirect("/campgrounds"); 
      });
   });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// handling login
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
});

// logout route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "You Logged Out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;