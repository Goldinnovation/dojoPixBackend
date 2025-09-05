import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userSignUpRouter  from "./router/Auth/userSignUp"
import userLoginRouter  from "./router/Auth/userLogin"
import handleSetPlayerBackgroundRouter from "./router/Admin/handleSetPlayerBackground"
import passport from 'passport';
import configurePassport from './config/passport';
import userSetProfileData from "./router/User/userSetProfile"
import { initializeApp } from 'firebase/app';
import config from './config/firebase';

dotenv.config();

const app: Express = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport strategies
configurePassport(passport);
app.use(passport.initialize());
initializeApp(config.firebaseConfig);

// Auth routes
app.use('/auth/signup', userSignUpRouter);
app.use('/auth/login', userLoginRouter);
app.use('/api/set-player-background', handleSetPlayerBackgroundRouter);
app.use('/api/UpdateProfileData', userSetProfileData)

const PORT: string | number = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Connected with DojoPix Backend: http://localhost:${PORT}`);
  
});