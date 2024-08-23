import { Router } from "express";
import { google, signinUser, signOutUser, signupUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/signup").post(signupUser)
router.route("/signin").post(signinUser)
router.route("/google").post(google)
router.route("/signout").post( verifyJWT ,signOutUser)


export { router }