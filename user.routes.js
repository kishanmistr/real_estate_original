import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteUser, getUserListings, updateUserAvatar, updateUserData } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/updateData/:id").patch(verifyJWT , updateUserData )
router.route("/updateAvatar/:id").patch(verifyJWT, upload.single("avatar"), updateUserAvatar )
router.route("/deleteUser/:id").delete(verifyJWT, deleteUser )
router.route("/listings/:id").get(verifyJWT, getUserListings ) 

export { router }

