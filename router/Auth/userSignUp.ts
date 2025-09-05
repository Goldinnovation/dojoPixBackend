import { Router, Request, Response } from "express"
const router = Router()
import handleSignup from "../../controller/Auth/handleSignup.js"



// router.get("/")

router.post('/', handleSignup);

export default router