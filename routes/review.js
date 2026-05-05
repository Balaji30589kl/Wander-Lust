const express = require('express');
const router = express.Router({mergeParams:true});

const Review = require('../models/review');

const Listing = require('../models/listing');

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schema.js');

const{validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');



const reviewController = require('../controllers/reviews.js');
const review = require('../models/review');



//reviews 
router.post('/',isLoggedIn, validateReview , wrapAsync( reviewController.createReview));

// delete review route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;