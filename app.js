
const express = require('express');
const mongoose = require('mongoose');
const ejs =require('ejs');
const passport = require('passport');
const bodyParser = require('body-parser');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/home-routes');
const socket = require('socket.io');
const cookieSession = require('cookie-session');
const key = require('./config/keys');
const urlencodedParser = bodyParser.urlencoded({extended:false})
const app = express();
const User = require('./models/user');
const Posts = require('./models/posts');
const Winner = require('./models/wins');

var port = process.env.PORT || 3000;
const authCheck = (req,res,next)=>{
  if(!req.user){
    res.redirect('/auth/login')
  }else{
    next();
  }
}

mongoose.connect(`mongodb://${key.mongodb.user}:${key.mongodb.pass}@ds221631.mlab.com:21631/4pics`)
.then(()=>console.log('connected to mongodb'));


app.use(cookieSession({
  maxAge:24*60*60*1000,
  keys:[key.session.key]
}))
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
app.set('view engine','ejs')

app.use('/assets',express.static('assets'));

app.get('/',(req,res)=>{
  res.redirect('/auth/login')
})

app.get('/wincount',(req,res)=>{
  Winner.find({}).count().then((user)=>{
    res.json(user)
  })

})

app.get('/feed',authCheck,(req,res)=>{
  res.render('index',{user:req.user});
})

app.post('/feed/post',urlencodedParser,(req,res)=>{
 new Posts ({
    body:req.body.body,
    userID:req.body.id,
    points:req.body.upoints,
    username:req.body.name,
    thumb:req.body.pic,
    time:new Date()
  }).save();
  var answer = req.body.body;
  var idd = req.body.id;
  //console.log(answer,id)
  if(answer == 'sunflower'|| answer == 'Sunflower'){
    Winner.findOne({Usrid:idd}).then((user)=>{
      if(!user){
        User.findByIdAndUpdate(idd,{ $inc: { points: 48 }},(err,data)=>{
          if(err){
            console.log('error',err);
          }
        });
        new Winner ({
          Usrid:idd
        }).save().then(()=>{
          console.log('new winner');
        })
      }else{
        console.log('already won')
      }
    })

  }
})


var server = app.listen(port || 'localhost' || '192.168.0.28',()=>console.log(`listening to port ${port}`));
var io = socket(server);

io.on('connection',(socket)=>{
  console.log(`new socket conection id:${socket.id}`);

  Posts.find({}).then((docs)=>{
    socket.emit('feedHistory',docs)
  })

  socket.on('post',(data)=>{
    //send it to all other sockets
    io.sockets.emit('post',data);
  })
  socket.on('typing',(data)=>{
    socket.broadcast.emit('typing',data)
  })
})
