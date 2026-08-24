import {Router} from 'express'

import {userRegister,refreshToken,logOut,logAll,logIn,verifyEmail} from "../controllers/auth.controllers.js"
import getMe  from "../controllers/user.controllers.js"
 



const router=Router()

router.post("/register",userRegister)
router.post("/login",logIn)
router.post("/logout",logOut)
router.get("/logAll",logAll)
router.get("/me",getMe)
router.post('/refreshToken',refreshToken)
router.post('/verifyemail',verifyEmail)

export default router