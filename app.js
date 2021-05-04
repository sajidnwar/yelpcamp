const express=require("express");
const server=express();
var bodyparser=require("body-parser")
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override")
var flash=require("connect-flash")
var session = require("express-session")
var cookieParser = require("cookie-parser")

server.use(express.json())
var Campground=require("./models/campground")
var Comment=require("./models/comment")
var User=require("./models/user")
var commentRoutes=require('./routes/comments')
var campgroundRoutes=require('./routes/campgrounds')
var indexRoutes=require('./routes/index')

// mongoose.connect("mongodb://localhost/yelp_camp");
// mongodb+srv://sajid:<password>@yelpcamp.r43zr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://sajid:anwarmine@cluster0.r43zr.mongodb.net/yelpcamp?retryWrites=true&w=majority");
server.use(bodyparser.urlencoded({extended: true}));
server.set("view engine", "ejs");
server.use(express.static(__dirname + "/public"));
server.use(methodOverride('_method'));
server.use(cookieParser('secret'));

var seedDB=require("./seeds")
//seedDB()

server.use(require("express-session")({
    secret:"Sajid is proficient in java",
    resave:false,
    saveUninitialized:false
}))
server.use(passport.initialize())
server.use(passport.session())
server.use(flash())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
server.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error")
    res.locals.success=req.flash("success")
    next();
})

// Campground.create(
//     {
//         name:"Bryce",
//         image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKNCie7ptk5osOhepgl_Qe6HLyrgjttCj6CH0EacY147IXNp1B",
//         description:"A better place to view"
//     },function(err,campground){
//         if(err){
//             console.log("Some error");
//         }else{
//             console.log("Newly Campground Created");
//             console.log(campground);
//         }
//     }
// )

// var camp=[
//     {name:"Bryce",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKNCie7ptk5osOhepgl_Qe6HLyrgjttCj6CH0EacY147IXNp1B"},
//     {name:"Wee World",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPVpd7l0VTJHmLgubO8dCQ7QX5WE7zYvxd4D4lZULcnt_KlYXPQA"},
//     {name:"Global",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs2tFQyyo6bzO7Zs_New0ge4yra_4RgWhLSxo3SVDaQILTtSdh2w"},
//     {name:"Bryce",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKNCie7ptk5osOhepgl_Qe6HLyrgjttCj6CH0EacY147IXNp1B"},
//     {name:"Wee World",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPVpd7l0VTJHmLgubO8dCQ7QX5WE7zYvxd4D4lZULcnt_KlYXPQA"},
//     {name:"Global",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs2tFQyyo6bzO7Zs_New0ge4yra_4RgWhLSxo3SVDaQILTtSdh2w"}

// ]
//server.set("views",__dirname+"/views")

server.use("/",indexRoutes)
server.use("/camp",campgroundRoutes)
server.use("/camp/:id/comments",commentRoutes)

//server.listen(27017,()=>{console.log("server has started at http://localhost:3333 ")})
server.listen(process.env.PORT,process.env.IP,()=>{console.log("server has started at http://localhost:3333 ")})