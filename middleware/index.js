var Comment = require("../models/comment");
var Campground = require("../models/campground");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be login in to do that!");
        res.redirect("/login");
    },
    checkUserCampground: function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
                if(err){
                    req.flash("error","Campground not found");
                    res.redirect("back");
                }else{
                    if(campground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("/camp/" + req.params.id);
                    }
                }
               
            });
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    res.redirect("back");
                }else{
                    if(comment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("/camp/" + req.params.id);
                    }
                }
               
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
        }
    }
}