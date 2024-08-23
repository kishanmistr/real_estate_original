import dotenv from 'dotenv'
import { connectDB } from './db/index.js'
import { app } from './app.js'

dotenv.config({

    path : "./.env"

})

connectDB()
.then(() => {

    app.get('/', (req,res) => {

        res.send(` kishan mistry `)


    } )

    app.listen(process.env.PORT || 3001 , () => {

        console.log(` server at http://localhost:${process.env.PORT} `);

    }  )

    


} )
.catch((error) => {

    console.log(error, " mongodb connection failed " );

} )