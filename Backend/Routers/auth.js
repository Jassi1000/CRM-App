import express from "express";
import passport from "passport";
import {
  googleCallback,
  logoutUser,
  getMe,
  getDashboard,
} from "../Controllers/authController.js";
import { isLoggedIn } from "../Middleware/protect.js";

const authRouter = express.Router();

// Google OAuth
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleCallback
);

// Logout
authRouter.get("/logout", logoutUser);

// Session check
authRouter.get("/me", getMe);

// Example protected route
authRouter.get("/dashboard", isLoggedIn, getDashboard);

export default authRouter;
