import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import  axios from 'axios'
import { updateUserStart, updateUserSuccess, updateUserFailure,deleteUserStart , deleteUserSuccess, deleteUserFailure, signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/features/user.slice'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Profile = () => {

  const fileRef = useRef(null)
  const { currentUser,error,loading } = useSelector((state) => state.app )
  const [formData,setFormData] = useState({

    username : "",
    email : "",
    password : "",
    avatar : ""

  })
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError,setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
        avatar: currentUser.avatar || ""
      });
    }
  }, [currentUser]);


  const handleChange = (e) => {

    const { value,name,files } = e.target

    if(name === 'avatar' ) {

        setFormData({

          ...formData, avatar : files[0] ? URL.createObjectURL(files[0]) : formData.avatar

        })

    }

    else {

      setFormData({ ...formData, [name] : value })

    }
    

  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    const updateData = {}

    if(formData.username) updateData.username = formData.username
    if(formData.email) updateData.email = formData.email
    if(formData.password) updateData.password = formData.password

    const formAvatar  = new FormData()

    if(fileRef.current?.files[0]) {

        formAvatar.append("avatar" ,  fileRef.current?.files[0] )

    }

    else if( formData.avatar.length > 0 ) {

      formAvatar.append("avatar" , formData.avatar )

    }


    try {

      dispatch(updateUserStart())
      const responseData = await axios.patch(`/api/v18/user/updateData/${currentUser._id}`, updateData )
      console.log(responseData);

      let updateUserData = responseData.data.data

      if(formAvatar.get("avatar")) {

        const responseAvatar = await axios.patch(`/api/v18/user/updateAvatar/${currentUser._id}`, formAvatar, {

          headers : {

            'Content-Type' : 'multipart/form-data'

          }

        })
        console.log(responseAvatar);

        updateUserData = {

          ...updateUserData, 
          avatar : responseAvatar.data.data.avatar

        }

        setUpdateSuccess(true)

      }

      dispatch(updateUserSuccess(updateUserData))
      setUpdateSuccess(true)
      
    } 

    
    catch (error) {

      dispatch(updateUserFailure(error?.response?.data?.message))
      console.log(error);
      
    }


  }

  const handleDeleteUser = async () => {

    
    try {

      dispatch(deleteUserStart())
      const response = await axios.delete(`/api/v18/user/deleteUser/${currentUser._id}`)
      dispatch(deleteUserSuccess(response.data.data))
      

    } 
    
    catch (error) {

      dispatch(deleteUserFailure(error.response?.data?.message))
      
    }


  }

  const handleSignOutUser = async () => {

    try {

      dispatch(signOutUserStart())
      const response = await axios.post(`/api/v18/auth/signout`)
      console.log(response);
      dispatch(signOutUserSuccess(response.data.data))
      
    } 
    
    catch (error) {

      dispatch(signOutUserFailure(error.response.data.message))
      
    }

  }

  const handleFileClick = () => {

    fileRef.current.click()

  }

  const handleShowListings = async () => {

    try {

      setShowListingsError(false)
      const response = await axios.get(`/api/v18/user/listings/${currentUser._id}`)
      console.log(response);
      setUserListings(response?.data?.data)

    } 
    
    catch (error) {

      console.log(error);
      setShowListingsError(true)
      
    }


  }

  const handleListingDelete =  async (listingId) => {

    try {

      const response = await axios.delete(`/api/v18/listing/delete/${listingId}`)
      console.log(response);

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId ) )
      
      
    } 
    
    catch (error) {

      console.log(error, " error while delete listing ");
      
      
    }


  }

  

  return (

    <>
      <div className=' mt-12 w-full h-full px-4 py-2 ' >
          <div className=' max-w-[600px] mx-auto w-full h-full px-4 py-2 flex flex-col gap-4  ' >
            <div className=' w-auto ' >
              <h1 className=' font-bold text-3xl text-black text-center ' > Profile </h1>
            </div>
            <div className=' w-auto mt-6  ' >
              <form action="" className=' w-full flex flex-col gap-4 ' onSubmit={handleSubmit}  >
                <div className=' flex flex-col ' >
                    <input type="file" accept='image/*' name='avatar' onChange={handleChange} className=' hidden ' ref={fileRef}  />
                    <img src={ formData.avatar || currentUser.avatar  } className=' self-center rounded-full mb-4 w-24 h-24 ' onClick={handleFileClick}  alt="" />
                </div> 
                <input type="text" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange}  defaultValue={ currentUser?.username }  placeholder='Username' name='username'   />
                <input type="email" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange} defaultValue={ currentUser?.email }   placeholder='Email' name='email'   />
                <input type="password" className=' w-full border focus:outline-none px-4 py-2  rounded-md  ' onChange={handleChange} placeholder='Password' name='password'   />
                <button  type='submit' disabled={loading} className=' w-full border  px-4 py-2  rounded-md bg-[#334055] text-xl text-white ' > { loading ? "Loading..." : "Update" } </button>
                <Link to={"/create-listing"}  > <button className=' bg-green-700 text-white px-4 py-2 rounded-lg uppercase text-center w-full ' > create listing </button> </Link>
              </form>
           </div>
           <div  className='  flex justify-between' >
            <span  className=' text-red-500 cursor-pointer font-semibold ' onClick={handleDeleteUser} > Delete Account </span>
            <span  className=' text-red-500 cursor-pointer font-semibold ' onClick={handleSignOutUser} > Sign Out </span>
           </div>
            {

              error && <p className=' text-red-500 mt-4' > { error ? error : "" } </p>

            } 
            {

              updateSuccess && <p className='  text-green-500 mt-2' >  { updateSuccess ? ' user update successfully ' : '' } </p>

            }
            <button className=' text-green-700 w-full' onClick={handleShowListings} > Show Listings </button>
            <p className=' text-red-500 mt-5 ' > { showListingsError ? " error showing listings " : "" }  </p>
            {

              userListings && userListings.length > 0 && (

                <div className=' flex flex-col gap-4' >
                    <h1 className=' font-bold text-2xl mt-7 text-center ' > Your Listings </h1>

                    {

                      userListings.map((listing) => (

                        <div key={listing._id} className=' border rounded-lg p-3 flex justify-between items-center gap-4 ' >
                            <Link to={`/listing/${listing._id}`} >
                                <img src={listing.imageUrls[0]} alt="Listings cover" className=' h-16 w-16 object-contain ' />
                            </Link>
                            <Link to={`/listing/${listing._id}`} className=' text-slate-700 font-semibold hover:underline truncate  flex-1 ' >
                               <p> { listing.name }  </p>
                            </Link>
                            <div className=' flex flex-col items-center ' >
                                <button className=' text-red-700 uppercase' onClick={() =>  handleListingDelete(listing._id) } >
                                    Delete
                                </button>
                                <Link to={`/update-listing/${listing._id}`} >
                                    <button className=' text-green-700 uppercase ' > Edit </button>
                                </Link>
                            </div>
                        </div>

                      ) )

                    }

                </div>

              )

            }
          </div>
      </div>
    </>
    
  )
}

export default Profile
