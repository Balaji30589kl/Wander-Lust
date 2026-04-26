const express = require('express');
const router = express.Router({mergeParams:true});

const Review = require('../models/review');

const Listing = require('../models/listing');

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schema.js');


//middleware to validate review data
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body) ;
        if(error){
            let msg = error.details.map(el=>el.message).join(',');
            throw new ExpressError(400,msg);
        }else{
            next();
        }
}



//reviews 
router.post('/', validateReview , wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','Successfully added a new review!');
    res.redirect(`/listings/${listing.id}`);
}));

// delete review route
router.delete('/:reviewId',wrapAsync(async (req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review!');
    res.redirect(`/listings/${id}`);
}));


module.exports = router;