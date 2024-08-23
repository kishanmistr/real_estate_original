import { v2 as cloudinary  } from 'cloudinary'
import fs from 'fs'
import { ApiError } from './ApiError.js'


cloudinary.config({

    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET

})

const uploadOnCloudinary = async (fileLocalPath) => {

    try {

        if(!fileLocalPath) return null

        const response = await cloudinary.uploader.upload(fileLocalPath, {

            resource_type : "image",
            folder : "realestate_final2"
        

        })

        try {

            if (fs.existsSync(fileLocalPath)) {

                fs.unlinkSync(fileLocalPath);

            }
        }
        
        catch (error) {

            console.error("Error deleting file:", error);
            
        }

        return response
        
    } 
    
    catch (error) {

        fs.unlinkSync(fileLocalPath)
        return  null

        
    }

}

const uploadMultipleImages = async (files) => {

    try {

        
        if(!files || files.length === 0 ) return []

        const uploadPromises =  files.map((file) => uploadOnCloudinary(file.path) );
        const response = await Promise.all(uploadPromises)

        if (response.some(res => !res)) {
            throw new ApiError(500, "One or more image uploads failed");
        }

        return response

    } 
    
    catch (error) {

        throw  new ApiError(500, error.message || " error while uploading images to cloudinary " )

        
    }

}

const deleteImageFromCloudinary = async (imageUrl) => {

   try {

     if(imageUrl.trim() === '' ) {
 
         throw new ApiError(400,  "url is required" )
 
     }
     
     const parts = imageUrl.split('/')
     const publicId = parts.slice(7).join('/').split('.')[0]
    //  const publicId = imageUrl.split('/').pop().split('.')[0];
     console.log(publicId, " public id for deleting image ");
     
     const result = await cloudinary.uploader.destroy(publicId , {

        resource_type : "image",

        
     } )
     console.log(result);
     return result
     

   } 
   
   catch (error) {

        throw new ApiError(401, error.message || " error while delete image from cloudinary " )
    
   }

}

export { uploadOnCloudinary,deleteImageFromCloudinary, uploadMultipleImages }


