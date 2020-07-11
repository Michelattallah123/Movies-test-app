const axios                    = require('axios').default,
      express                  = require('express'),
      mongoose                 = require("mongoose"),
      passport                 = require("passport"),
      LocalStrategy            = require("passport-local"),
      passportLocalMongoose    = require("passport-local-mongoose"),
      bodyParser               = require("body-parser"),
      flash                    = require("connect-flash");

let   ejs                      = require('ejs'),
      Movie                    = require("./models/movie.js"),
      User                     = require("./models/user.js"),
      seedDB                   = require("./public/scripts/seed.js"),
      randomNum                = require("./public/scripts/randomNum.js"),
      movieRoutes              = require("./routes/movies.js"),
      authRoutes               = require("./routes/index.js");
      

//=============
//CONFIGURATION
//=============
const app = express();
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); 
mongoose.connect('mongodb://127.0.0.1:27017/movie_app', {useNewUrlParser: true, useUnifiedTopology: true});

//=============
//PASSPORT
//=============
app.use(require("express-session")({
	secret: "my dirty secret",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB();

//=============
//ROUTES
//=============


//INDEX
app.get("/",function(req,res){
    res.redirect("/movies");
});

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//MOVIES
app.use("/movies",movieRoutes);

//AUTH 
app.use(authRoutes);




app.listen(3000,function(){
	console.log("Alright, we are on!!!")
});
