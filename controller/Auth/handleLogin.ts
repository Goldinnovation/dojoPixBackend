import { Request, Response, NextFunction } from 'express';
import passport, { use } from 'passport';
import { generateToken } from '../../config/passport';
import prisma from '../../libs/prisma';

interface LoginRequestBody {
  loginEmail?: string;
  loginPassword?: string;
}

// Promisified Passport local authentication
const authenticateLocal = (req: Request, res: Response, next: NextFunction) =>
  new Promise<any>((resolve, reject) => {
    try {
      passport.authenticate('local', { session: false }, (err: Error | null, user: any, info?: { message: string }) => {
        try {
          if (err) {
            return reject(err);
          }
          if (!user) {
            console.log('user', user);
            return res.status(401).json({ success: false, message: info?.message || 'Login failed' });
          }
          // console.log('user', user);
          return resolve(user);
        } catch (innerError) {
          return reject(innerError);
        }
      })(req, res, next);
    } catch (error) {
      return reject(error);
    }
  });



// Controller for the login route: authenticates via Passport and returns JWT
const handleLogin = async (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction): Promise<void> => {
  try {

    const user = await authenticateLocal(req, res, next);
   
    const token = generateToken(user);

    const usersafeImageUrl = (user.userProfileImageUrl?.trim() || "not Available");

  

 
    // console.log('token', token);

    res.status(200).json({ message: 'Login successful', token, setProfileData:  user.hasProfileDataSet, userImage: usersafeImageUrl});
    return;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export default handleLogin;