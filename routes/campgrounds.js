var express=require("express");
var router=express.Router();
var Campground=require('../models/campground')
var middleware=require("../middleware")
//var request=require("request")

router.get('/',(req,res)=>{
    
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index",{camp:allCampgrounds,currentUser:req.user})
        }
    })
    
})
router.post('/',middleware.isLoggedIn,(req,res)=>{
    var author={
        id:req.user.id,
        username:req.user.username
    }
    var newc={name:req.body.name,image:req.body.image,description:req.body.description,price: req.body.price,author:author}
    Campground.create(newc,function(err,newlyCreated){
        if(err){
            console.log(err)
        }else{
            res.redirect('/camp');
        }
    })
    
    
})
router.get('/new',middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new")
})
router.get('/:id',(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show",{camp:foundCampground})
        }
    })
    
})
router.get('/:id/edit',middleware.checkUserCampground,(req,res)=>{
    Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
           console.log(err)
       }else{
        res.render("campgrounds/edit",{camp:foundCampground})
        }
    
        })
    
})
router.put("/:id",middleware.checkUserCampground,function(req,res){
    Campground.findOneAndUpdate(req.params.id,req.body.camp,function(err,updatedCampground){
        if(err){
            res.redirect("/camp")
        }else{
            res.redirect("/camp/" + req.params.id);
           // res.redirect("/camp")
           //res.status(201).send("/camp/"+req.params.id)
        }
    })
    // var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    // Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
    //     if(err){
    //         req.flash("error", err.message);
    //         res.redirect("back");
    //     } else {
    //         req.flash("success","Successfully Updated!");
    //         res.redirect("/camp/" + req.params.id);
    //     }
    // });
})
router.delete("/:id",middleware.checkUserCampground,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/camp")
        }else{
            res.redirect("/camp")
        }
    })
})

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error","Please Login first")
//     res.redirect("/login")
// }
// function checkCampgroundOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id,function(err,foundCampground){
//             if(err){
//                 //res.redirect("/camp")
//                 res.redirect("back");
//             }else{
//                 //does user own the campground
//                 //res.send("Here is the page")
//                 ////console.log(foundCampground)
//                     //console.log(foundCampground.author.id)
//                  if(foundCampground.author.id.equals(req.user.id)){
//                     res.render("campgrounds/edit",{camp:foundCampground})
//                      next()
//                  }else{
//                 //     //console.log("ypu donot  have permission to do")
//                    res.redirect("back");
//                  }
//             }
//         })
//     }
//     else{
//         res.redirect("back");
//     }
// }
module.exports=router