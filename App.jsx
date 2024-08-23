import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import Listing from "./pages/Listing"
import UpdateListing from "./pages/UpdateListing"


function App() {

  return (
      <>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/signin" element={<Signin/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/listing/:listingId" element={<Listing/>} />
            <Route element={<PrivateRoute/>} >
             <Route path="/profile" element={<Profile/>} />
             <Route path="/create-listing" element={<CreateListing/>} />
             <Route path="/update-listing/:listingId" element={<UpdateListing/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
  )
}

export default App
