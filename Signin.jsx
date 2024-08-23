import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector  } from 'react-redux'
import { signInStart,signinSuccess, signinFailure,clearError } from '../redux/features/user.slice'
import OAuth from '../components/OAuth'


const Signin = () => {


  const [formData,setFormData] =  useState({

    email : '',
    password : '',

  })
  const { loading, error } = useSelector((state) =>  state.app )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const handleChange = (e) => {

    const { name,value } = e.target

    setFormData({

      ...formData, [name] : value

    })

  }



  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      dispatch(signInStart())

      const res = await axios.post('/api/v18/auth/signin' , formData, {

        headers : {

          "Content-Type" : "application/json" ,
          
        },

        withCredentials : true

      } 

    )

      console.log(res.data.data.user);
      dispatch(signinSuccess(res.data.data.user))
      navigate('/')
      toast.success(res.data?.message, {

        position : "top-right"

      })

    } 
    
    catch (error) {

      dispatch(signinFailure(error.response?.data?.message))
      toast.error(error.response?.data?.message, {

        position : "top-right"

      })

      setTimeout(() => dispatch(clearError()) ,10000)
      
    }

  }

  return (

    <div className=' mt-12 w-full h-full px-4 py-2 ' >
      <div className=' max-w-[600px] mx-auto w-full h-full px-4 py-2 flex flex-col gap-4  ' >
          <div className=' w-auto ' >
            <h1 className=' font-bold text-3xl text-black text-center ' > Sign In </h1>
          </div>
          <div className=' w-auto mt-6  '  >
            <form action="" className=' w-full flex flex-col gap-4 ' onSubmit={handleSubmit}  >
              <input type="email" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange}  placeholder='Email' name='email'   />
              <input type="password" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange}  placeholder='Password' name='password'   />
              <button disabled={loading} type='submit' className=' w-full border  px-4 py-2  rounded-md bg-[#334055] text-xl text-white ' > { loading ? "Loading..." : "Sign In"  } </button>
              <OAuth/>
            </form>
        </div>
        <p className=' font-bold text-xl text-black ' >  Don't Have an account ? <Link to={"/signup"} className=' text-blue-500 ' > <span> Sign Up </span> </Link>  </p>
        {

          error && <p className='text-red-500 mt-5' > { error }  </p>

        }
      </div>
    </div>
    
  )
}

export default Signin
