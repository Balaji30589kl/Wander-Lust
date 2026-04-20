const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const { listingSchema , reviewSchema } = require('../schema.js');
const Listing = require('../models/listing');



//middleware to validate listing data
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body) ;
        if(error){
            let msg = error.details.map(el=>el.message).join(',');
            throw new ExpressError(400,msg);
        }else{
            next();
        }
}

//index route to show all listings
router.get('/', wrapAsync( async (req,res)=>{
    const listings = await Listing.find({});
    res.render('listings/index.ejs',{listings:listings});
    
}));

//new route to show form to create new listing
router.get('/new',(req,res)=>{
    res.render('listings/new.ejs');
});


//create route to create a new listing witht the middleware to validate listing data
router.post('/', validateListing, wrapAsync( async (req,res,next)=>{
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect(`/listings`);
     
    
})
);

//show route to show details of a single listing
router.get('/:id',  wrapAsync(async (req,res)=>{
    let {id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listings/show.ejs',{listing:listing});

}));

//edit route to show form to edit a listing
router.get('/:id/edit', wrapAsync( async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{listing:listing});

})); 

//update route to update a listing
router.put('/:id', validateListing, wrapAsync( async (req,res)=>{
    if(!req.body.listing) {
        throw new ExpressError(400,"Invalid Listing Data");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//Delete route to delete a listing
router.delete('/:id', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));


module.exports = router;