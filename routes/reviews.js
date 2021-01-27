const express = require('express');
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const Campground = require("../models/campground");
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
//npm i joi
// const Joi = require('joi');
// const { reviewSchema } = require('../schemas.js');




router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//find ID after delete him, pull for mongodb.
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;