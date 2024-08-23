import { Listing } from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from 'bcrypt'

const updateUserData = asyncHandler( async(req,res,next) => {

    // const { id }  = req.params

    const { username,email,password } = req.body

    if([username,email,password].some((field) =>  field.trim() === ''  )) {

        throw  new ApiError(400, " all fields are required " )

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)) {

        throw new ApiError(400, " invalid email format  ")

    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

    if(!passwordRegex.test(password)) {

        throw  new ApiError(400, " password must be atleast 8 characters long , at least one Uppercase, at least one lowercase and one number  " )

    }
    
    const existedUser = await User.findById(req.user?._id)

    if(!existedUser) {

        throw  new ApiError(404, " user not existed " )

    }

    const updatefields = {}

    if(username) updatefields.username = username.toLowerCase()
    if(email) updatefields.email = email
    if(password) updatefields.password = await bcrypt.hash(password,10)

    const updateUser = await User.findByIdAndUpdate(

        req.user?._id , {

            $set : updatefields

        },

        {

            new : true

        }

    ).select("-password -refreshToken")

    return  res.status(200).json( new ApiResponse(200, updateUser, "  user update successfully " ) )


} )

const updateUserAvatar = asyncHandler( async(req,res,next) => {

    // const { id } = req.params

    const existedUser = await User.findById(req.user?._id)

    if(!existedUser) {

        throw  new ApiError(404, " user not existed " )

    }

    let avatarLocalPath  ;

    if(req.file && req.file?.path) {

        avatarLocalPath  = req.file?.path

    }

    let avatar

    if(avatarLocalPath) {

        if(existedUser.avatar) {

            await deleteImageFromCloudinary(existedUser.avatar)

        }

        avatar = await uploadOnCloudinary(avatarLocalPath)

        if(!avatar.url) {

            throw new ApiError(400 , " url is required " )

        }

    }

    else {

        avatar = { url : existedUser.avatar }

    }

    const updateUser =  await User.findByIdAndUpdate(

        req.user?._id, {


            $set : {

                avatar : avatar.url

            }

        },

        {

            new : true

        }


    ).select(" -password -refreshToken ")
    
    return res.status(200).json( new ApiResponse(200, updateUser, "  user update avatar successfully "  ) )

} )

const deleteUser = asyncHandler( async(req,res,next) => {

    if(req.user._id.toString() !== req.params.id ) {

        throw  new ApiError(401, " params and verifyjwt both are different  " )

    }

    const deletedUser = await User.findByIdAndDelete(req.params.id)
    

    const options = {

        httpOnly : true,
        secure : true

    }

    return res.status(200).clearCookie("accessToken", options ).clearCookie("refreshToken" , options ).json( new ApiResponse(200, {} , " delete user successfully " ) )


} )

const getUserListings = asyncHandler( async(req,res,next) => {

    if(req.user._id.toString() === req.params.id ) {

        const listings = await Listing.find({ userRef : req.params.id })

        return res.status(200).json( new ApiResponse(200, listings, " user listings here "  ) )

    }

    else {

        throw  new ApiError(401, " you can only view your own listings " )

    }
   

} )



export { updateUserData, updateUserAvatar,deleteUser, getUserListings }
