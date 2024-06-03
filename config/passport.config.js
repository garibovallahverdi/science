import User from "../model/user.model.js";
import LocalStrategy from 'passport-local'
import GoogleStrategy from 'passport-google-oauth20'
import dotenv from 'dotenv' 
import passport from "passport";

dotenv.config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("TOKEN",accessToken);
      let user = await User.findOne({ where: { googleId: profile.id } });
  
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email:profile.email,
          image:profile.photos[0].value,
          first_name:profile.name.givenName,
          last_name:profile.name.familyName,
          displayName: profile.displayName,
          email: profile.emails[0].value 
        });
      }
     
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })); 
  
  passport.use(new LocalStrategy({
    usernameField: 'email', // HTML formundaki kullanıcı adı alanının adı
    passwordField: 'password' // HTML formundaki şifre alanının adı
  },
  async (email, password, done) => { 
    try {
      const user = await User.findOne({ where: { email: email } });
      
      if (!user) {
        return done(null, false, { message: 'Kullanıcı bulunamadı.' });
      }
      
      const auth = await bcrypt.compare(password,user.password)

      if (!auth) {
        return done(null, false, { message: 'Hatalı şifre.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  


 export default passport;