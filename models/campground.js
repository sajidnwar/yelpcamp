var mongoose=require("mongoose");
var Comment=require("../models/comment")
mongoose.connect("mongodb://localhost/yelp_camp");
var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    price:Number,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});
module.exports=mongoose.model("Campground",campgroundSchema);
