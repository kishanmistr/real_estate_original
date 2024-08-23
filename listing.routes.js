import { Router } from "express";
import { createListing, deleteListing, getListing, updateListing } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT, upload.array("imageUrls",6) , createListing)
router.route("/delete/:id").delete(verifyJWT, deleteListing )
router.route("/update/:id").patch(verifyJWT, upload.array("imageUrls", 6), updateListing )
router.route("/get/:id").get(getListing)


export { router }


