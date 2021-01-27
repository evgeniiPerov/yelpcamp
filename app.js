if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//npm i connect-mongo  
//npm install @mapbox/mapbox-sdk  

//npm i dotenv  in file .env add every passwords and key but ignore to use github uploads!
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//express,path,moongoose connection install in node!, campground from models
//npm i cloudinary multer-storage-cloudinary
//npm i method-override
//npm i multer -> Image rules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
//npm i ejs-mate
const ejsMate = require('ejs-mate');
//we have const from expresserror
const ExpressError = require('./utils/ExpressError');
//npm i method-override
const methodOverride = require('method-override');
//npm i express-session
const session = require('express-session');
//npm i connect-flash
const flash = require('connect-flash');
//npm i passport passport-local passport-local-mongoose
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
//npm i express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
//npm i helmet
const helmet = require('helmet');


//router 
const userRoutes = require('./routes/users')
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const { MongoStore } = require('connect-mongo');
const MongoDBStore = require('connect-mongo')(session);
// const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

// "mongodb://localhost:27017/yelp-camp",
//mongoose connection from docs of mongoose with database yelp-camp
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

//mongoose connection with error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

// app of express
const app = express();

//set ejs in ejs-mate module
app.engine('ejs', ejsMate)
// set application + set ejs files in app in dir views Care about double '__'
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//for app.post for new web!
app.use(express.urlencoded({ extended: true }));
//method-override
app.use(methodOverride('_method'));
//new script from public folder
app.use(express.static(path.join(__dirname, 'public')))
//mongo sanitize
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 3600
})

store.on('error', function (e) {
    console.log('session store error', e)
})

//express-session config
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
//express-session+flash
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet())
//Help configs for using webs
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dflpbdyly/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// dflpbdyly
//passport Middleware docs 
app.use(passport.initialize());
//should be BELOW session 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//passport docs
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//routers folder
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

//Create a 'web' with get
app.get("/", (req, res) => {
    res.render("home");
});


//* If all dont exist we see this
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


//what we seee than has error
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

//Local host 3000
app.listen(3000, () => {
    console.log("Serving on port 3000");
});
