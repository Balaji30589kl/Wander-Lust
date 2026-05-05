const Listing = require('../models/listing');

module.exports.index = async (req,res)=>{
    const listings = await Listing.find({});
    res.render('listings/index.ejs',{listings:listings});
    
};

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs');
};

module.exports.showListing = async (req,res)=>{
    let {id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing){
        req.flash('error','Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing:listing});

};

module.exports.createListing = async (req,res,next)=>{
        
        const newListing = new Listing(req.body.listing);
        
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash('success','Successfully created a new listing!');
        res.redirect(`/listings`);
     
    
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs',{listing:listing});

};

module.exports.updateListing = async (req,res)=>{
    if(!req.body.listing) {
        throw new ExpressError(400,"Invalid Listing Data");
    }
    let {id} = req.params;
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash('success','Successfully updated the listing!');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the listing!');
    res.redirect('/listings');
};