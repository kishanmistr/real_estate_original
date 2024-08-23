import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = () => {

  const { currentUser } = useSelector((state) => state.app )

  return (

    <div className=' w-full h-24 bg-gray-300 px-4 py-2 ' >
      <div className=' w-full h-full px-4 py-2 max-w-[1240px] mx-auto flex justify-between items-center gap-4 ' >
          <div className='  w-auto ' >
            <h1 className=' font-bold text-black sm:text-3xl text-normal ' > <span className=' text-red-500' > KISMI</span>CODE</h1>
          </div>
          <div className=' w-auto ' >
            <form action="" className=' w-full '  >
                <div>
                  <input type="text" placeholder=' Search... ' className=' w-full px-4 py-2 focus:outline-none text-xl rounded-md ' />
                </div>
            </form>
          </div>
          <ul className=' flex gap-5 items-center  ' >
            <Link to={"/"} >
                <li className=' hidden sm:inline ' > Home </li>
            </Link>
            <Link to={"/about"} >
                <li className=' hidden sm:inline ' > About </li>
            </Link>
            <Link to={"/profile"} >
                {

                  currentUser ?
                  ( currentUser?.avatar ? ( ( <img src={ currentUser?.avatar } alt='profile' className=' w-7 h-7 rounded-full object-cover '  />   ) ) :  <li className='hidden text-blue-500 text-xl font-semibold sm:inline'>{currentUser.username}</li>  ) 
                  : (  <> <li className=' hidden sm:inline ' > Signin </li> </> )

                }
            </Link>
          </ul>
      </div>
    </div>

  )
}

export default Header
