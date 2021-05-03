var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require('../models/campground')
var Comment=require('../models/comment')
var middleware = require("../middleware");

router.get('/new',middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{camp:foundCampground})
        }
    })
    
})
router.post('/',middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
            res.redirect('/camp')
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong");
                }else{
                    comment.author.id=req.user.id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Comment Added!');
                    res.redirect('/camp/'+campground._id)
                }
            })
        }
    })
    
})

router.get("/:comment_id/edit",middleware.checkUserComment,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back")
        }else{
            res.render("comments/edit",{camp_id:req.params.id,comment:foundComment})
        }
    })
    
})
router.put("/:comment_id",middleware.checkUserComment,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back")
        }else{
            //res.redirect("/camp/"+ req.params.id)
            res.redirect("/camp/"+req.params.id)
        }
    })
})
router.delete("/:comment_id",middleware.checkUserComment,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back")
        }else{
            res.flash("success","Comment deleted!");
            res.redirect("/camp/"+req.params.id)
        }
    })
})
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error","Please Login First ")
//     res.redirect("/login")
// }
module.exports=router