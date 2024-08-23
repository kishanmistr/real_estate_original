import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signupUser = asyncHandler( async(req,res,next) => {

    const { username,email,password } = req.body

    if([username,email,password].some((field) => field.trim() === '' )) {

        throw  new ApiError(400, " all fields are required " )

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {

        throw new ApiError(400, " invalid email format ")

    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    if(!passwordRegex.test(password)) {

        throw  new ApiError(400, " password must be at least 8 characters long, contain at least one uppercase letter, one number  ")
    }

    const existedUser = await User.findOne({email}) 

    if(existedUser) {

        throw new ApiError(409, " user already exists "  )

    }


    const createUser = await User.create(

        {

            username : username.toLowerCase(),
            email,
            password

        }

    )

    const createdUser = await User.findById(createUser?._id).select("-password -refreshToken")

    return  res.status(200).json( new ApiResponse(200, createdUser , " user create successfully " ) )


} )

const generateAccessAndRefreshToken = async (userId) => {

    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false })
    
        return { accessToken , refreshToken }

    } 
    
    catch (error) {

        throw new ApiError(500, " something went wrong while generating refresh and access token " )
        
    }

}

const signinUser = asyncHandler( async(req,res,next) => {

    const { email,password } = req.body

    if([email,password].some((field) => field.trim() === '' ) ) {

        throw  new ApiError(400, " all fields are required " )

    }

    const user = await User.findOne({email})

    if(!user) {

        throw  new ApiError(404, " user doesn't exists ")

    }

    const passwordValid = await user.isPasswordCorrect(password)

    if(!passwordValid) {

        throw  new ApiError(401, " invalid user credentials ")

    }

    const { accessToken, refreshToken } =  await generateAccessAndRefreshToken(user?._id)

    const loggedInUser = await User.findById(user?._id).select(" -password -refreshToken ")

    const options = {

        httpOnly : true,
        secure : true

    }

    return  res.status(200).cookie("accessToken", accessToken, options ).cookie("refreshToken" , refreshToken , options ).json( new ApiResponse(200, {

        user : loggedInUser, accessToken, refreshToken

    },

    "user loggedin successfully"

 ) )

}  )

const google = asyncHandler( async(req,res,next) => {

    try {

        const { name, email, photo } = req.body

        const user = await User.findOne({email})

        if(user) {

            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)

            const options = {

                httpOnly : true,
                secure : true

            }

            const createdUser = await User.findById(user?._id).select(" -password -refreshToken ")

            return res.status(200).cookie("accessToken" , accessToken, options ).cookie("refreshToken" , refreshToken, options ).json( new ApiResponse(200, createdUser ," user create successfully " ) )

        }

        else {

            const generatedPassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8)

            const newUser = await User.create({

                username : name.toLowerCase(),
                email ,
                password : generatedPassword,
                avatar : photo

            })

            const { accessToken, refreshToken  } = await generateAccessAndRefreshToken(newUser?._id)

            const options = {

                httpOnly : true,
                secure : true

            }

            const createdUser = await User.findById(newUser?._id).select("-password -refreshToken")

            return res.status(200).cookie("accessToken", accessToken, options ).cookie("refreshToken", refreshToken, options ).json( new ApiResponse(200, createdUser, " user create successfully " ) )

        }

        
    } 
    
    catch (error) {

        next(error)
        
    }

} )

const signOutUser = asyncHandler( async(req,res,next) => {

    await User.findByIdAndUpdate(

        req.user?._id , {

            $unset : {

                refreshToken : 1

            }

        },

        {

            new : true

        }

    )

    const options = {

        httpOnly : true,
        secure : true

    }

    return res.status(200).clearCookie("accessToken" , options).clearCookie("refreshToken", options ).json( new ApiResponse(200, {} , " signout user successfully " ))

} )

export { signupUser, signinUser, generateAccessAndRefreshToken, google, signOutUser }
