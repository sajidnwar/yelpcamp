var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment")
var data=[
    {
        name:"river",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEoXgVKIPYAdEUj2mhHTVywSRo4iKfb6bY12ZP_9uRBW25AWBW5A",
        description:"Water is cold"
    }
]
function seedDB(){
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
        //console.log("removed campgrounds!!");
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err)
                }else{
                    //console.log("Added Campground")
                    Comment.create(
                        {
                            text:"Great place ever",
                            author:"ME"
                        },function(err,comment){
                            if(err){
                                console.log(err)
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                //console.log("comment added")
                            }
                        }
                    )
                }
            })
        })
    })
}
module.exports=seedDB;