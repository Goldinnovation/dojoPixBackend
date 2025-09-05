import { Router } from "express"
const router = Router()
import handleLogin from "../../controller/Auth/handleLogin.js"

router.post('/', handleLogin);

export default router
