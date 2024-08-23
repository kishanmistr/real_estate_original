import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.middleware.js'

const app = express()

app.use(cors({

    origin : process.env.CORS_ORIGIN,
    credentials : true

})) 

app.use(express.json({

    limit : "16mb"

}))

app.use( express.urlencoded({

    limit : "16mb",
    extended : true

}) )

app.use( express.static("public") )
app.use(cookieParser())

// import and declaration

import { router as authRouter } from './routes/auth.routes.js'
import { router  as  userRouter }  from './routes/user.routes.js'
import { router as listingRouter } from './routes/listing.routes.js'

app.use('/api/v18/user', userRouter )
app.use('/api/v18/auth', authRouter )
app.use('/api/v18/listing', listingRouter )




app.use(errorHandler)

export { app }












