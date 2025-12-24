const express = require('express');
const app = express();
const mongoose =  require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const methodoverride = require('method-override');
const { listingSchema } = require('./schema.js');

app.set('view_engine','ejs');
app.set('views',path.join(__dirname,'/views'));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(methodoverride('_method'));

app.engine('ejs',ejsMate);


const Mongo_URL="mongodb://127.0.0.1:27017/wanderLust";
main().then(
    (res)=>{
        console.log("Connected to MongoDB");
    }
).catch((err)=>{console.log(err)});
async function main(){
    await mongoose.connect(Mongo_URL);
}



app.get('/',(req,res)=>{
    res.send("Hello World");
});



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
app.get('/listings', wrapAsync( async (req,res)=>{
    const listings = await Listing.find({});
    res.render('listings/index.ejs',{listings:listings});
    
}));

//new route to show form to create new listing
app.get('/listings/new',(req,res)=>{
    res.render('listings/new.ejs');
});

app.post('/listings', validateListing, wrapAsync( async (req,res,next)=>{
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect(`/listings`);
     
    
})
);

//show route to show details of a single listing
app.get('/listings/:id',  wrapAsync(async (req,res)=>{
    let {id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs',{listing:listing});

}));

//edit route to show form to edit a listing
app.get('/listings/:id/edit', wrapAsync( async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{listing:listing});

})); 

//update route to update a listing
app.put('/listings/:id', validateListing, wrapAsync( async (req,res)=>{
    if(!req.body.listing) {
        throw new ExpressError(400,"Invalid Listing Data");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete('/listings/:id', wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));
// app.get('/testlistings',async (req,res)=>{
//     let samplemodel = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing description",
//         price:1000,
//         location:"sample location",
//         country:"Sample Country"  
//     });
//     await samplemodel.save();
//     res.send("Listings will be shown here");
// });


app.all(/.*/, (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let{statusCode = 500 ,message ="Something went wrong"} = err;
    res.status(statusCode).render('error.ejs',{err});
    //res.status(statusCode).send(   message);
    });

app.listen(8081,()=>{
    console.log("Server is running on port 8081");
});