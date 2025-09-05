import { Request, Response } from "express";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import config from '../../config/firebase';
import giveCurrentDateTime from '../../utils/date';
import tmp from 'tmp';
import fs from 'fs';
import { execFile } from 'child_process';
import gifsicle from 'gifsicle';
import prisma from "../../libs/prisma";

// Initialize Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

interface AuthenticatedRequest extends Request{
  user?: any;
  decodedUserId: any
  file?: Express.Multer.File;
}


const handleUploadCloudURLToDB = async (cloudFileURL: string, req: AuthenticatedRequest, res: Response) => {

  try {

    const currentUserId = (req as AuthenticatedRequest)?.decodedUserId
    const mimetype = req.file?.mimetype as string
    
    
    if (!currentUserId || currentUserId === undefined || currentUserId === " ") {
      res.status(400).json({ message: 'Invalid Request, currentUserId is required' });
      return;
  }

  //  const updatedBackGround =  await prisma.picture.update({
  //     where: {
  //       picture_owner_id: currentUserId,

  //     },
  //     data: {
  //       gifUrl: gifUrl
  //     }
  //   })
// 
    // console.log('updatedBackGround', updatedBackGround);
    res.json({ message: `Successfully created the ${mimetype} Image upload`, uploadedFileUrl: cloudFileURL })

  }
  catch (error) {
    console.log("Server Error on handleUploadGifUrlToDB handler function, CatchBlock - True:", error)
    res.status(500).json({ message: "Internal Server Error" });
  }



}



// 4. Step - Utility function to upload file to Firebase
const uploadFileToFirebase = async (
  storageRef: any, 
  buffer: Buffer, 
  metadata: any, 
  req: AuthenticatedRequest, 
  res: Response
) => {
  try {
    // Tells Firebase exactly where to store the file
    const uploadTask = uploadBytesResumable(storageRef, buffer, metadata);
    
    const snapshot = await uploadTask;
    const uploadedGifUrl = await getDownloadURL(snapshot.ref);

    handleUploadCloudURLToDB(uploadedGifUrl, req, res)
  } catch (error) {
    throw error;
  }
};


// 3. Step -  Utility function to compress GIF (placeholder implementation)
export const compromiseImagefile = async (buffer: any, res:Response): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {

      const tmpInputFile = tmp.fileSync({ postfix: "gif" });
      const tmpOutputFile = tmp.fileSync({ postfix: "gif" });
      fs.writeFileSync(tmpInputFile.name, buffer);

      execFile(
        gifsicle,
        [
          "--resize",
          "500x700",
          "--optimize",
          // "--delay", "10",  //reduces the speed of the gif 
          "--output",
     
          tmpOutputFile.name,
          tmpInputFile.name,
        ],
        (error) => {
          error &&
            (() => {
              return reject(error);
            });

          const optimizedGifBuffer = fs.readFileSync(tmpOutputFile.name);
          resolve(optimizedGifBuffer);
        }
      );
    } catch (error) {
      console.log("Server Error on compromiseGif handler function, CatchBlock - True:", error)
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};



// 2. Step - Process the image upload
const processUserBackgroundImagefile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "File could not be found" });
      return;
    }

    const file = req.file as Express.Multer.File;
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `dojoPixPlayBackground/${dateTime}_${file.originalname}`
    );

    const compromiseGifData = await compromiseImagefile(file.buffer, res);
    const metadata = { contentType: "image/gif" };

    await uploadFileToFirebase(storageRef, compromiseGifData, metadata, req, res);
    
 

  } catch (error) {
    console.log("Server Error on processUserBackgroundGifImage handler function, CatchBlock - True:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};






// 1. Step - Input Valitdation
const handleSetPlayerBackground = async (req: Request, res: Response) => {
  try {

  // const userId = (req as AuthenticatedRequest)?.decodedUserId

  // const imageBuffer = req.file?.buffer
  // const fileName =  req.file?.originalname as string ??  "defaultName"
  // const mimetype = req.file?.mimetype as string ??  "image/jpeg"
  // const userBirthDate = req.body?.userBirthDAY


  // console.log('request', req.body);

    // Early validation - check if user is authenticated
    const userId = (req as AuthenticatedRequest)?.decodedUserId;
    console.log('userId', userId);
    // if (!userId) {
    //   return res.status(401).json({ 
    //     message: "Unauthorized: User ID not found" 
    //   });
    // }

    // Early validation - check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        message: "Bad Request: No file uploaded" 
      });
    }

    // Early validation - check file type
    const allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];
    const mimetype = req.file.mimetype;
    if (!allowedMimeTypes.includes(mimetype)) {
      return res.status(400).json({ 
        message: "Bad Request: Invalid file type. Only GIF, JPEG, PNG, and WebP are allowed" 
      });
    }

    // Early validation - check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        message: "Bad Request: File too large. Maximum size is 10MB" 
      });
    }

    // Process the image upload
    await processUserBackgroundImagefile(req as AuthenticatedRequest, res);

  } catch (error) {
    console.error("Error in handleSetPlayerBackground:", error);
    return res.status(500).json({ 
      message: "Internal Server Error" 
    });
  }
};

export default handleSetPlayerBackground;


