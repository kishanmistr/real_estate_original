import { ApiError } from "../utils/ApiError.js";

const errorHandler  = async (err,req,res,next) => {

    if(err instanceof ApiError ) {

        return  res.status(err.statusCode).json({ message : err.message })

    }

    else {

        return res.status(500).json({ message : " internal server occured " })

    }

}

export { errorHandler }
