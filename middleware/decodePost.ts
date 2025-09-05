import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any;
  decodedUserId: any;



}
interface DJwtPayload extends JwtPayload {
  userId: string;
  email: string; //before was Email
}

// Receives a user token and decodes it to the users Id and Email. Afterwards the function passes the decodedId and
//  the list of Selected interest to the local request property further to the next handler function 

const DecodeANDVerifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body) {
      
      const SECRET_KEY = process.env.JWT_SECRET_KEY as string;
      const authHeader = req.headers.authorization;
      // console.log('authHeader', authHeader);
      let token = authHeader;
      while (token && token.startsWith('Bearer ')) {
        token = token.substring(7);
      }

        
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }


      const decoded = jwt.verify(token, SECRET_KEY) as DJwtPayload;
      (req as AuthenticatedRequest).decodedUserId = decoded.userId;



      next();
    } else {
      res
        .status(400)
        .json({
          Message:
            "There have been a bad Request on the converToken middleware function",
        });
    }

  } catch (error) {
    console.error("Unexpected Error - CategoryConvertToken middleware function", error)
    res.status(500).json({ message: "Internal Server Error" })
  }

};

export default DecodeANDVerifyToken;
