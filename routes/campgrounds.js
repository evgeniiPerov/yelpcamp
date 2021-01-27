
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
//function move to controllers folder
const campgrounds = require('../controllers/campgrounds');
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
//npm i multer
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

//DOCS OF ROU*TE!!!!
router.route('/')
    //create /campgrounds, info about him from dir campgrounds, file index.ejs, defined campgrounds!
    .get(catchAsync(campgrounds.index))
    //req.body ll be empty but router.use in top help for info -> new model Campground
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("YES BABY IT WORKED!")
// })

//in this web we create new campground, MUST BE UP OF campgrounds/:id, 'if after it ll be id (new = id)'
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
//DOCS OF ROUTE!!!!!
router.route('/:id')
    //id for campgrounds, use with router get async function use require param id for data
    .get(catchAsync(campgrounds.showCampground))
    //edit and update campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))



router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;