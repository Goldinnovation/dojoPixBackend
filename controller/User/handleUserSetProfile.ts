import { Request, Response } from "express"
import { initializeApp } from 'firebase/app'
import config from '../../config/firebase'
import {getStorage, ref, deleteObject, getDownloadURL, uploadBytesResumable} from 'firebase/storage'
import prisma from "../../libs/prisma";
import giveCurrentDateTime from "../../utils/date";



interface AuthenticatedRequest extends Request{
    user?: any;
    decodedUserId: any
    file?: Express.Multer.File;
  }
  

  initializeApp(config.firebaseConfig);
const storage = getStorage();
let parsedBirthDay: Date | null = null;

  const handleparsedBirtday = async(userBirthDay: string) => {

    const [day, month, year] = userBirthDay.split('.');
    parsedBirthDay = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    return parsedBirthDay
    
  }


const handleUserSetProfile = async(req: Request,  res: Response) => { 

    const userId = (req as AuthenticatedRequest)?.decodedUserId
    const imageBuffer = req.file?.buffer
    const fileName =  req.file?.originalname as string ??  "defaultName"
    const mimetype = req.file?.mimetype as string ??  "image/jpeg"
    const userBirthDate = req.body?.userBirthDAY

    const parsedUserBirthdate = await handleparsedBirtday(userBirthDate)
    // console.log('parsedUserBirthdate', parsedUserBirthdate);


    if (!userId || userId === undefined || userId === " ") {
      res.status(400).json({ message: 'Invalid Request, userId is required' });
      return
    }
    if (!imageBuffer || imageBuffer === undefined ) {
      res.status(400).json({ message: 'Invalid Request, imageBuffer is required on File' });
      return
    }


    if(parsedUserBirthdate){
      console.log('parsedUserBirthdate', parsedUserBirthdate);
      await addImagetoCloud(imageBuffer, fileName, mimetype, userId, res, parsedUserBirthdate)
     
    }
  
      
   
  



}   


export const addImagetoCloud = async(buffer: any, fileName:string, mimetype: string, userId:string, res: Response, userBirthDay: Date) => {

  try{

    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `dojopixUserProfile/${dateTime}_${fileName}`);
  
  
    const metadata = {
      contentType: mimetype,
    };
  
    
  
    const uploadaction = uploadBytesResumable(
      storageRef,
      buffer,
      metadata
    );
  
      const snapshot = await uploadaction;
      const ImageUrl = await getDownloadURL(snapshot.ref);

      if(ImageUrl){
        await uploadImageUrlToDatabase( userId, ImageUrl, res, userBirthDay)
      }
    

  }catch(error){

    console.error('Erron on function: addImagetoCloud', error);
    res.status(500).json({ message: "Internal Server Error" });

  }
  
 

} 




export const uploadImageUrlToDatabase   = async(currentUserId:string, userCloudImgUrl: string, res: Response, CurrentUserBirthDate:Date) => {
  try{


    console.log('userId', currentUserId);
    console.log('cloudImgUrl', userCloudImgUrl);
    console.log('userBirthDay', CurrentUserBirthDate);


   const setUserProfileData = await prisma.account.update({
    where: {
      userId: currentUserId // Use the userId from the request
    },
    data: {
      userBirthDate: CurrentUserBirthDate, // Update the birthday
      userProfileImageUrl: userCloudImgUrl, // Update the profile image URL
      hasProfileDataSet: true // Set profile data flag to true
    }
   });
   console.log('updated the table account ', setUserProfileData);

  //  res.status(200).json({message: "Image was successfully stored"})
   res.json({message: "add connection to set User Profile", userId: setUserProfileData.userId, userProfileImage: setUserProfileData.userProfileImageUrl})

  }catch(error){

   console.error('Erron on function: uploadImageUrlToDatabase', error);
   res.status(500).json({ message: "Internal Server Error" });

  }

}

export default handleUserSetProfile