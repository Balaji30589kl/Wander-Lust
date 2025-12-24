const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const Mongo_URL="mongodb://127.0.0.1:27017/wanderLust";
main().then(
    (res)=>{
        console.log("Connected to MongoDB");
    }
).catch((err)=>{console.log(err)});
async function main(){
    await mongoose.connect(Mongo_URL);
}

const initDb = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data); 
    console.log("Database Initialized with sample data");
}

initDb();
