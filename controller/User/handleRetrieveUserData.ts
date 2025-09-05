import { Response, Request } from "express"







const handleRetrieveUserData = (req: Request, res:Response) => {

    try{
        res.json({message: "connected with Retrieve Data"})

    }catch(error){


    }

}

export default handleRetrieveUserData