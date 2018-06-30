const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user');
const key=require('./keys');

passport.serializeUser((user,done)=>{
  done(null,user.id);
})

passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
    done(null,user);
  })
})

passport.use( new GoogleStrategy ({
  //options
  callbackURL:'/auth/google/redirect',
  clientID:key.google.clientId,
  clientSecret:key.google.clientSecret
},
  //call back function
(accessToken,refreshToken,profile,done)=>{
  User.findOne({googleID:profile.id}).then((user)=>{
    if(user){
      done(null,user)
    }else{
      new User({
        username:profile.displayName,
        googleID:profile.id,
        thumbnail:profile._json.image.url,
        points:1
      }).save().then((newUser)=>{
        done(null,newUser)
      })
    }
  })


}))
