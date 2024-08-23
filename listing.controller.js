import { Listing } from "../models/listing.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageFromCloudinary, uploadMultipleImages } from "../utils/cloudinary.js";

const createListing = asyncHandler( async (req,res,next) => {

   const { name,description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer, userRef  } = req.body 

   let uploadImages
   if(req.files) {

    uploadImages = await uploadMultipleImages(req?.files)


   }

   if(!uploadImages || uploadImages.length === 0 ) {

    throw  new ApiError(400," image upload failed " )

   }

   const newListing =  await Listing.create(

    {

        name,
        description,
        address,
        regularPrice,
        discountPrice,
        bathrooms,
        bedrooms,
        furnished,
        parking,
        type,
        offer,
        imageUrls : uploadImages.map((img) => img?.url ),
        userRef


    }

   )

   const createdData = await Listing.findById(newListing?._id)

   return  res.status(200).json( new ApiResponse(200, createdData , " create listing successfully " ) )
    
} )

const deleteListing = asyncHandler( async(req,res,next) => {

    const { id } = req.params

    const listing = await Listing.findById(id)

    if(!listing) {

        throw new ApiError(404, " listing not found " )

    }

    // if (req.user.id.toString() !== listing.userRef) {

    //     throw new ApiError(401, 'You can only delete your own listings!') 

    // }

    const imageurls = listing.imageUrls

    try {
        for (const imageUrl of imageurls) {
          
            await deleteImageFromCloudinary(imageUrl)

        }
      } catch (error) {

        console.log(error);
        

      }
    

    const deletedUser = await Listing.findByIdAndDelete(id) 

    return  res.status(200).json( new ApiResponse(200, {}, " Listing has been deleted " ) )

    


} )

const updateListing = asyncHandler( async(req,res,next) => {

    console.log('Request Body:', req.body);
    
    const { name,description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer,userRef, deletedImages  } = req.body
    const { id } = req.params

    const listing = await Listing.findById(id)

    if(!listing) {

        throw  new ApiError(404, " listing not found " )

    }

    // if (req.user.id.toString() !== listing.userRef) {

    //     throw new ApiError(401, 'You can only update your own listings!') 

    // }

    const updatefields = {}

    if(name) updatefields.name = name
    if(description) updatefields.description = description
    if(address) updatefields.address = address
    if(regularPrice) updatefields.regularPrice = regularPrice
    if(discountPrice) updatefields.discountPrice = discountPrice
    if(bathrooms) updatefields.bathrooms = bathrooms
    if(bedrooms) updatefields.bedrooms = bedrooms
    if(furnished) updatefields.furnished = furnished
    if(parking) updatefields.parking = parking
    if(type) updatefields.type = type
    if(offer) updatefields.offer = offer
    if(userRef) updatefields.userRef = userRef



    let newImageUrls = [...listing.imageUrls];
    
    // Handle image upload
    if (req.files && req.files.length > 0 ) {

      const  uploadImages = await uploadMultipleImages(req.files);

        if (!uploadImages || uploadImages.length === 0) {

            throw new ApiError(400, "Image upload failed");

        }
        
        // Add newly uploaded images to updateFields
        newImageUrls = [...newImageUrls, ...uploadImages.map((img) => img.url)];

        // for (const imageUrl of listing.imageUrls) {
        //     await deleteImageFromCloudinary(imageUrl);
        // }

    } 
    
    

    if( deletedImages && deletedImages.length > 0 )  {

        for( const imageUrl of deletedImages ) {

            if(imageUrl) {

                await  deleteImageFromCloudinary(imageUrl)
                newImageUrls = newImageUrls.map((url) => url !== imageUrl )

            }

        }
       
       
    }

    updatefields.imageUrls = newImageUrls

    const updatedListing = await Listing.findByIdAndUpdate(  id , {

        $set : updatefields

    },

    {

        new : true

    }

    )

    return  res.status(200).json( new ApiResponse(200, updatedListing , " update user data successfully "  ) )

} )


const getListing = asyncHandler( async(req,res,next) => {

    const { id } = req.params

    const listing = await Listing.findById(id)

    if(!listing) {

        throw new ApiError(404 , " listing not found")

    }

    return res.status(200).json( new ApiResponse(200, listing , " get listing successfully " ) ) 

} )


export { createListing,deleteListing , updateListing , getListing }


