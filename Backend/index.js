import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './Models/user.js';
import connectDB from './Config/database.js';
import authRouter from './Routers/auth.js';
import uploadRouter from './Routers/upload.js';
import createRouter from './Routers/create.js';
import vendorRouter from './Routers/vendor.js';
import { deliveryReceipt } from './Controllers/deliverController.js';
import getRouter from './Routers/getdata.js';

dotenv.config();
const app = express();
app.use(express.json());

app.set("trust proxy", 1);  // add this line

// Connect MongoDB
connectDB();

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend URL
  credentials: true // allow cookies
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "none"
  }
}));


// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serialize & Deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });
    }
    return done(null, user);
  } catch (err) {
    console.error("GoogleStrategy error:", err);
    return done(err, null);
  }
}));

// Routes
app.use("/auth", authRouter);
app.use("/api/v1",uploadRouter); 
app.use("/api/v1",createRouter);
app.use("/api/v1",getRouter);
// Dummy vendor API
app.use("/api/vendor", vendorRouter);
app.post("/api/v1/delivery-receipt", deliveryReceipt);

// // Example protected route
// app.get('/api/dashboard', isLoggedIn, (req, res) => {
//   res.json({ message: `Welcome ${req.user.name} to your dashboard!` });
// });

app.listen(process.env.PORT || 4000, () => console.log('Server running on port 5000'));

















// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     // Redirect frontend after login
//     res.redirect('http://localhost:3000/dashboard');
//   }
// );

// app.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.json({ success : true , message: 'Logged out' });
//   });
// });

// Middleware to check authentication
// export function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.status(401).json({ message: 'Unauthorized' });
// }

// Route to check session
// app.get('/api/me', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ loggedIn: true, user: req.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });
