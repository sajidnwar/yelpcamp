var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user")
router.get('/',(req,res)=>{
    res.render("landing")
})




router.get('/register',function(req,res){
    res.render("register");
})
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/camp"); 
        });
    });
});

router.get('/login',function(req,res){
    res.render("login")
})
router.post('/login',passport.authenticate("local",{
    successRedirect:"/camp",
    failureRedirect:"/login"
}),function(req,res){

})
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out")
    res.redirect("/camp")
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First")
    res.redirect("/login")
}
module.exports=router