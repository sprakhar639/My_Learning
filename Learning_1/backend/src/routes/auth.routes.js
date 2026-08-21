import {Router} from 'express'

import {userRegister,refreshToken,logOut} from "../controllers/auth.controllers.js"
import getMe  from "../controllers/user.controllers.js"
 



const router=Router()

router.post("/register",userRegister)
router.post("/logout",logOut)
router.get("/me",getMe)
router.post('/refreshToken',refreshToken)

export default router