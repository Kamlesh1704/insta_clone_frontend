import React,{useState, useEffect} from 'react'
import PostDetails from '../components/PostDetails'
import ProfilePic from '../components/ProfilePic'
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { toast } from 'react-toastify';
import '../css/Profile.css'

export default function Profile() {
  var defultPic = 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?size=626&ext=jpg'
  const [user, setUser] = useState("")
  const [userGallery, setGallery] = useState([])
  const [savedPost, setSavedPost] = useState([])
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([])
  const [changePic, setChangePic] = useState(false)
  const [showGallery, setShowGallery] = useState(true)

  const notifyB = msg => toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const showDetails = () => {
    if(show){

      setShow(false)
    }else{
      setShow(true)
    }
  }

  const changeprofile = () => {
    if (changePic){
      setChangePic(false)
    }else{
      setChangePic(true)
    }
  }

  useEffect(()=> {
    const fetchData = async () => {
      try{const response = await fetch(`https://insta-clone-backend-1.onrender.com/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      const responseData = await response.json()
      setUser(responseData.user)
      setGallery(responseData.userPost)
      } catch(err){
        console.log(err)
      }
    }
    fetchData()
  },[])

  const getSavedPost = async () => {
    try{const token = localStorage.getItem("token")
    const response = await fetch("https://insta-clone-backend-1.onrender.com/savedposts",{
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    const savedData = await response.json()
    setSavedPost(savedData)}
    catch(err){
      console.log(err)
    }
  }

  const unSavePost = async (id) => {
    const response = await fetch("https://insta-clone-backend-1.onrender.com/unsaved", {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        postId: id
      })
    });
    const result = await response.json();
    const newData = savedPost.filter((each) => each._id !== result._id);
    setSavedPost(newData);
    notifyB("Post Unsaved Successfully");
  }

  const activegellaryClass = showGallery ? "activeGallery" : ""
  const activesavedClass = showGallery ? "" : "activeGallery"
  return (
    <div className='profile'>
    <div className="profile-frame">
      <div className="profile-pic">
        <img onClick={changeprofile} src={user.Photo ? user.Photo : defultPic} alt="" />
      </div>
      <div className="profile-data">
        <h3>{user.name}</h3>
        <div className="profile-info" style={{display:"flex"}}>
              <p>{userGallery ? userGallery.length:"0"} post</p>
              <p>{user.followers ? user.followers.length:"0"} followers</p>
              <p>{user.following ? user.following.length: "0"} followings</p>
        </div>
        </div>
    </div>
    <hr style={{width:"90%",opacity:"0.8",margin:"25px auto"}}/>
    <div style={{display:"flex", marginLeft:"110px"}}>
    <button 
      onClick={() => {
      setShowGallery(true)
      getSavedPost()}} 
      className={`post-saved-btn ${activegellaryClass}`}
    >
        <MdOutlinePhotoSizeSelectActual className='icon'/>
        <p>POSTS</p></button>
    <button onClick={() => {
      setShowGallery(false)
      getSavedPost()}} className={`post-saved-btn ${activesavedClass}`}>
        <FaRegBookmark className='icon-2'/>
        <p>SAVED</p></button>
    </div>

      {
        showGallery ? (    <div className="gallery">
        {
          userGallery.map((eachDetails)=> {
            return (
              <img src={eachDetails.photo} alt="gallery"
              onClick={()=> {setShow(true)
                setPosts(eachDetails)
              }} 
              key={eachDetails._id}/>
            )
          })
        }
      </div>):(
    <div className='gallery-save'>
      {
        savedPost.length === 0 ? (
          <div className='para'>
          <h2>No Post Saved</h2>
          </div>
        ):(
          savedPost.map((eachPost) => {
            return (
              <div className='savepic-logo'>
              <img src={eachPost.photo} alt='saved' key={eachPost._id}/>
                <FaBookmark className='save-icon' onClick={() => { unSavePost(eachPost._id) }}/>
              </div>
            )
          })
        )
      }
    </div>)
      }

    {
      show && (
        <PostDetails item={posts} showDetails={showDetails}/>
      )
    }
    {
    changePic && (
        <ProfilePic changeprofile={changeprofile} />
    )
    }
    </div>
  )
}
