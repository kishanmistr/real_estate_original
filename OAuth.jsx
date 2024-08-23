import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup  } from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signinSuccess } from '../redux/features/user.slice'
 
const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {

        try {

           const provider = new GoogleAuthProvider() // Provides Google authentication functionality.
           const auth = getAuth(app)  // Using getAuth ensures that you are working with the correct authentication instance for your Firebase app. This is particularly important if you have multiple Firebase projects or if you need to initialize Firebase in different environments.

           const result = await signInWithPopup(auth,provider)
           console.log(result);
            
           const userData = {}
           if(result?.user?.displayName) userData.name = result?.user?.displayName
           if(result?.user?.email) userData.email = result?.user?.email
           if(result?.user?.photoURL) userData.photo = result?.user?.photoURL


           const res = await axios.post('/api/v18/auth/google', userData )
           console.log(res);
           navigate('/')
           dispatch(signinSuccess(res.data.data))
            
        } 
        
        catch (error) {

            console.log(" couldn't sign in with google ", error);
            
        }

    }

  return (
    <>
      <button type='button' onClick={handleGoogleClick}  className='bg-red-700 font-semibold text-white p-3 text-xl rounded-lg uppercase hover:opacity-95' >
            Continue with google
      </button>
    </>
  )
}

export default OAuth
