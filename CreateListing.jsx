import { useState } from "react";
import axios from 'axios'
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";


const CreateListing = () => {

  const {  currentUser } = useSelector((state) => state.app )
  const navigate = useNavigate()
  const [formData, setFormData] = useState({

    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imageUrls: [],
    userRef : currentUser?._id || ""

  });

  const [imagePreviews,setImagePreviews] = useState([])
  const [error,setError] = useState(false)
  const [loading,setLoading] = useState(false)

  const handleChange = (e) => {

    const { name, value,type, files, checked } = e.target;

    if (name === "imageUrls") {

      const newFiles = Array.from(files);

      if(newFiles.length +  formData.imageUrls.length > 6 ) {

        alert(' you can only select upto 6 images  ') ;
        return ;

      }

      const updatedFiles = [...formData.imageUrls, ...newFiles ].slice(0,6)

      setFormData({ ...formData, imageUrls: updatedFiles });


    } else if (type === "checkbox") {

      if(name === "sale" || name === "rent" ) {

        setFormData({ ...formData, type :  checked ? name : "rent" })

      }

      else {

        setFormData({ ...formData, [name] : checked });

      }

    } else {
      setFormData({ ...formData, [name]: value });
    }

  };

  const handleUpload = () => {

    const previews = formData.imageUrls.map((file) => URL.createObjectURL(file) ) ;

    setImagePreviews(previews)

  }

  const handleDelete = (index) => {

    const updatedFiles =  formData.imageUrls.filter((_,i) =>  i !== index );
    setFormData({...formData, imageUrls : updatedFiles })
    handleUpload()

  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    const formDataInstance = new FormData()

    Object.keys(formData).forEach((key) => {

      if(key !== 'imageUrls' ) {

        formDataInstance.append(key,formData[key])

      }

    } )

    formData.imageUrls.forEach((file) => {

      formDataInstance.append('imageUrls' , file )

    } )

    for (let pair of formDataInstance.entries()) {
      console.log(pair[0], pair[1]);
    }
    

    try {

      setLoading(true)
      setError(false)
      const response = await axios.post("/api/v18/listing/create", formDataInstance  )
      
      console.log('data', response);
      setLoading(false)
      navigate(`/listing/${response?.data?.data?._id}`)
      toast.success(response?.data?.message)
      
      

      

      
    } 
    
    catch (error) {

      console.log(error);
      setLoading(false)
      setError(error?.response?.data?.message)
      toast.error(error?.response?.data?.message)
      
      
    }


  }



  return (
    <>
      <main className=" p-3 max-w-4xl mx-auto ">
        <h1 className=" font-bold text-center text-3xl my-7 ">
          {" "}
          Create Listing{" "}
        </h1>
        <form action="" className=" flex flex-col sm:flex-row gap-4 "  onSubmit={handleSubmit} >
          <div className=" flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name "
              className=" p-3 rounded-lg border focus:outline-none  "
              name="name"
              minLength={10}
              maxLength={62}
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className=" p-3 rounded-lg border focus:outline-none  "
              name="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address "
              className=" p-3 rounded-lg border focus:outline-none  "
              name="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className=" flex gap-6 flex-wrap ">
              <div className=" flex gap-2 ">
                <input
                  type="checkbox"
                  name="sale"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span> Sell </span>
              </div>
              <div className=" flex gap-2 ">
                <input
                  type="checkbox"
                  name="rent"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span> Rent </span>
              </div>
              <div className=" flex gap-2  ">
                <input
                  type="checkbox"
                  name="parking"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span> Parking Spot </span>
              </div>
              <div className=" flex gap-2  ">
                <input
                  type="checkbox"
                  name="furnished"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span> Furnished </span>
              </div>
              <div className=" flex gap-2  ">
                <input
                  type="checkbox"
                  name="offer"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span> Offer </span>
              </div>
            </div>
            <div className=" flex flex-wrap gap-6 ">
              <div className=" flex gap-2 items-center ">
                <input
                  type="number"
                  name="bedrooms"
                  min={1}
                  max={10}
                  required
                  className=" p-3 border border-gray-300 rounded-lg focus:outline-none  "
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <span> Beds </span>
              </div>
              <div className=" flex gap-2 items-center ">
                <input
                  type="number"
                  name="bathrooms"
                  min={1}
                  max={10}
                  required
                  className=" p-3 border border-gray-300 rounded-lg focus:outline-none  "
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <span> Baths </span>
              </div>
              <div className=" flex gap-2 items-center ">
                <input
                  type="number"
                  name="regularPrice"
                  min={50}
                  max={10000000}
                  required
                  className=" p-3 border border-gray-300 rounded-lg focus:outline-none  "
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className=" flex flex-col ietms-center">
                  <p> Regular Price </p>

                  {

                    formData.type === 'rent' &&  (

                      <span className=" text-xs"> ($ / Month) </span>


                    )

                  }
                </div>
              </div>
              <div className=" flex gap-2 items-center ">
                <input
                  type="number"
                  name="discountPrice"
                  min={0}
                  max={10000000}
                  required
                  className=" p-3 border border-gray-300 rounded-lg focus:outline-none  "
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className=" flex flex-col ietms-center">
                  <p> Discounted Price </p>
                  {

                    formData.type === 'rent' && (


                      <span className=" text-xs"> ($ / Month) </span>

                    )

                  }
                </div>
              </div>
            </div>
          </div>
          <div className=" flex flex-col gap-4 flex-1  ">
            <p className=" font-semibold  ">
              {" "}
              Images :
              <span className=" font-normal text-gray-600 ml-2 ">
                {" "}
                The first image will be the cover (max 6){" "}
              </span>
            </p>
            <div className=" flex gap-4 ">
              <input
                type="file"
                name="imageUrls"
                id=""
                accept="image/*"
                className=" p-3 border border-gray-300 rounded-w-full "
                multiple
                onChange={handleChange}
              />
              <button
                type="button"
                className=" p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 "
                onClick={handleUpload}
              >
                {" "}
                Upload{" "}
              </button>
            
            </div>
            {

              imagePreviews.length > 0 && imagePreviews.map((url,index) => (

                <div className=" flex justify-between items-center p-3 border " key={index} >
                  <img src={url} alt="" className=" w-20 h-20 rounded-lg object-contain " />
                  <button type="button" className=" p-3 text-red-700  rounded-lg uppercase hover:opacity-75  " onClick={() => handleDelete(index) }  > Delete </button>
                </div>


              ) )

            }

            <button type="submit" className=" uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80  " disabled={loading} >
                {

                  loading ? "Loading..." : "Create listing"

                }
              
            </button>
            {error && <p className='text-red-700 mt-2 text-sm'>{error}</p>}
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateListing;
