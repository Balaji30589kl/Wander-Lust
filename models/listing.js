const { ref } = require('joi');
const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
                // Use a direct image CDN URL, not an Unsplash page URL
                default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1080&auto=format&fit=crop"
        }
    },
    price:{
        type: Number,
    },
    location:{
        type: String,
    },
    country:{
        type: String,
    },
    reviews: [{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
});
listingSchema.post('findOneAndDelete', async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in:listing.reviews}});
    }
    
})


const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;