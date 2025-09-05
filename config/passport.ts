import {PassportStatic} from 'passport';
import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy} from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback  } from 'passport-jwt';
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();


const prisma = new PrismaClient();
const SECRET_KEY=  process.env.JWT_SECRET_KEY as string


if (!SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY is not defined');
}


interface User{
    id: string,
    userId: string, 
    userEmail: string, 
    userName: string,
    userPassword: string
    
}



console.log('SECRET_KEY', SECRET_KEY);



export default function(passport: PassportStatic){
    passport.use(
        new LocalStrategy(
          { usernameField: 'loginEmail', passwordField: 'loginPassword' },
          async (loginEmail: string, loginPassword: string, done: (Error: any, user?: Express.User | false, options?: { message: string }) => void ) => {
         

           try{
            
            const user = await prisma.account.findFirst({    //checks if the user exist in the db 
                where: {
                    userEmail: loginEmail
                }
            }); 
            if(!user){
                console.log('user on authenticated', user);
                return done(null,false, {message: "User not found"}); //user not found
            }

            const checkPasswordMatch = await bcrypt.compare(loginPassword, user.userPassword);

            if(checkPasswordMatch){
                console.log('password matched - user successfully logged in')
               
                return done(null, user); // Authentication was successful
            }
            else{
                console.log('password does not match ')
                return done(null, false, {message: "Incorrect Password"}); //Password does not match
            }

           }catch(error: any){
            console.log(error)
            if (error instanceof Error) {
                return done(error);
              } else {
                return done(new Error('An unknown error occurred'));
              }
           }
        })

    
    );
   
    passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET_KEY,
      },
      async (jwtPayload: any , done: VerifiedCallback) => {
        try {
          const user = await prisma.account.findUnique({
            where: {
              userId: jwtPayload.userId,
            },
          });
          if (user) {
            console.log('user in jwt founded');
            return done(null, user);
          } else {
            console.log('user in jwt not founded');
            return done(null, false);
          }
        } catch (error) {
          console.log('JWT user error; Token Invalid');
          return done(error, false);
        }
      }
    )
  );

    
    passport.serializeUser((user: Express.User | false, done:(err: any, id?: string) => void ) => {  
       
        done(null,( user as User).userId);
    });
    
    passport.deserializeUser(async(userId: string, done: (err: any, user?: Express.User | false) => void) => { 
        try{
            const user = await prisma.account.findUnique({
                where: {
                    userId: userId
                    
                }
            })

            // console.log(user)
            if(!user){
                console.error('User not found');
                return done(new Error('User not found'))
            }

            done(null, user)
           

        }catch(error)
        {
            console.error('Deserialize user error:', error);
            done(error)
        }
    })

}; 
// Generate a JWT token when the your successfully logged In 

export function generateToken(user: User) {
  return jwt.sign({ userId: user.userId, email: user.userEmail, name: user.userName}, SECRET_KEY, { expiresIn: '5h' });
}
