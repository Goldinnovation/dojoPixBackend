import { Request, Response } from 'express';
import prisma from '../../libs/prisma';
import bcrypt from 'bcrypt'

interface SignupRequest {
  userName: string;
  userEmail: string;
  userPassword: string; // will be stored in schema field userPassword1
}

// Checks whether an account exists with the provided userName.
const checkUserExistsByUserName = async (userName: string): Promise<boolean> => {
  try {
    const userExist = await prisma.account.findFirst({
        where: { userName: userName }
    });
    return userExist !== null
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('checkUserExistsByUserName error', error);
    throw error;
  }
};

// Checks whether an account exists with the provided userEmail.
const checkUserExistsByEmail = async (userEmail: string): Promise<boolean> => {
  try {
    const userExist = await prisma.account.findFirst({
        where: { userEmail: userEmail }
    });
    return userExist !== null
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('checkUserExistsByEmail error', error);
    throw error;
  }
};

// Creates a new account record using Prisma and returns the created entity.
const createUserAccount = async (
  userName: string,
  userEmail: string,
  hashedUserPassword: string,
) => {
  try {
    return await prisma.account.create({
      data: {
        userName,
        userEmail,
        userPassword: hashedUserPassword,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('createUserAccount error', error);
    throw error;
  }
}

// Controller for the signup route: checks conflicts and creates the user.
const handleSignup = async (req: Request<{}, {}, SignupRequest>, res: Response): Promise<void> => {

      try {
       

        const { userName, userEmail, userPassword } = req.body;

        
        const userNameExists = await checkUserExistsByUserName(userName)
        if (userNameExists) {
          res.status(409).json({ message: "user Name already Exist" })
          return;
        }

        const userEmailExists = await checkUserExistsByEmail(userEmail)
        if (userEmailExists) {
          res.status(409).json({ message: "user Email already Exist" })
          return;
        }
       const hashedPassword = await bcrypt.hash(userPassword, 10);
       await createUserAccount(userName, userEmail, hashedPassword)
        res.status(201).json({ message: 'created new Account' })
        return;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Signup error', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
};

export default handleSignup;
