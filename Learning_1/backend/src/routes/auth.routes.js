import {Router} from 'express'

import {userRegister,refreshToken} from "../controllers/auth.controllers.js"
import getMe  from "../controllers/user.controller.js"



const router=Router()

router.post("/register",userRegister)
router.get("/me",getMe)
router.get('/refreshToken',refreshToken)

export default router