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
    Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedCampground){
        if(err){
            res.redirect("/camp")
        }else{
            res.redirect("/camp/" + req.params.id);
        }
    })
   
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

module.exports=router