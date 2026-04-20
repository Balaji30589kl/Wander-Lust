const express = require('express');
const app = express();
const mongoose =  require('mongoose');

const path = require('path');
const ejsMate = require('ejs-mate');
;
const ExpressError = require('./utils/ExpressError');
const methodoverride = require('method-override');


const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

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


app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);


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