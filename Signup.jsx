import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import OAuth from '../components/OAuth'

const Signup = () => {

  const [formData,setFormData] =  useState({

    username : '',
    email : '',
    password : '',

  })

  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {

    const { name,value } = e.target

    setFormData({

      ...formData, [name] : value

    })

  }

  const clearError = () => {

    setError(null)

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const res = await axios.post('/api/v18/auth/signup' , formData, {

        headers : {

          "Content-Type" : "application/json" 

        }

      } )

      console.log(res);
  
      setLoading(false)
      setError(null)
      navigate('/signin')
      toast.success(res.data?.message, {

        position : "top-right"

      })

    } 
    
    catch (error) {

      setLoading(false)
      setError(error.response?.data?.message)
      toast.error(error.response?.data?.message, {

        position : "top-right"

      })

      setTimeout(clearError,10000)
      
    }

  }


  return (

    <div className=' mt-12 w-full h-full px-4 py-2 ' >
      <div className=' max-w-[600px] mx-auto w-full h-full px-4 py-2 flex flex-col gap-4  ' >
          <div className=' w-auto ' >
            <h1 className=' font-bold text-3xl text-black text-center ' > Sign Up </h1>
          </div>
          <div className=' w-auto mt-6  '  >
            <form action="" className=' w-full flex flex-col gap-4 ' onSubmit={handleSubmit}  >
              <input type="text" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange} placeholder='Username' name='username'   />
              <input type="email" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange}  placeholder='Email' name='email'   />
              <input type="password" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange}  placeholder='Password' name='password'   />
              <button disabled={loading} type='submit' className=' w-full border  px-4 py-2  rounded-md bg-[#334055] text-xl text-white ' > { loading ? "Loading..." : "Sign Up"  } </button>
              <OAuth/>
            </form>
        </div>
        <p className=' font-bold text-xl text-black ' >  Have an account ? <Link to={"/signin"} className=' text-blue-500 ' > <span> Sign in </span> </Link>  </p>
        {

          error && <p className='text-red-500 mt-5' > { error }  </p>

        }
      </div>
    </div>
    
  )
}

export default Signup
