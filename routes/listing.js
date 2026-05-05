const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const { listingSchema , reviewSchema } = require('../schema.js');
const Listing = require('../models/listing');

const{isLoggedIn, isOwner, validateListing} = require('../middleware.js');

const listingController = require('../controllers/listings.js');


router.route('/')
.get(wrapAsync( listingController.index))
.post(isLoggedIn, validateListing, wrapAsync( listingController.createListing));
//index route to show all listings

//new route to show form to create new listing
router.get('/new',isLoggedIn,listingController.renderNewForm);


router.route('/:id')
.get(  wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, validateListing, wrapAsync( listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))

//edit route to show form to edit a listing
router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync( listingController.renderEditForm)); 


module.exports = router;