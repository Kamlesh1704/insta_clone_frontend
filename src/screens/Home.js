import React, { useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import '../css/Home.css';

export default function Home() {
  var defultPic = 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?size=626&ext=jpg';
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);                    
  const [item, setItem] = useState([]);
  const navigate = useNavigate();
  let limit = 10;
  let skip = 0;

  const notifyA = msg => toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

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

  useEffect(() => {
    const jwt_token = localStorage.getItem("token");
    if (!jwt_token) {
      navigate("./signup");
    }
    fetchPosts();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchPosts = () => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`https://insta-clone-backend-1.onrender.com/allPosts?limit=${limit}&skip=${skip}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await res.json();
        setData((data) => [...data, ...result]);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }

  const handleScroll = () => {
    if (document.documentElement.clientHeight + window.pageYOffset >= document.documentElement.scrollHeight) {
      skip = skip + 10;
      fetchPosts();
    }
  }

  const likePost = async (id) => {
    const response = await fetch("https://insta-clone-backend-1.onrender.com/like", {
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
    const newData = data.map((posts) => {
      if (posts._id === result._id) {
        return result;
      } else {
        return posts;
      }
    });
    setData(newData);
  }

  const unlikePost = async (id) => {
    const response = await fetch("https://insta-clone-backend-1.onrender.com/unlike", {
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
    const newData = data.map((posts) => {
      if (posts._id === result._id) {
        return result;
      } else {
        return posts;
      }
    });
    setData(newData);
  }

  const savePost = async (id) => {
    const response = await fetch("https://insta-clone-backend-1.onrender.com/saved", {
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
    const newData = data.map((posts) => {
      if (posts._id === result._id) {
        return result;
      } else {
        return posts;
      }
    });
    setData(newData);
    notifyB("Post Saved Successfully");
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
    const newData = data.map((posts) => {
      if (posts._id === result._id) {
        return result;
      } else {
        return posts;
      }
    });
    setData(newData);
    notifyB("Post Unsaved Successfully");
  }

  const makeComment = async (id, commented) => {
    try {
      const response = await fetch("https://insta-clone-backend-1.onrender.com/comment", {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          text: commented,
          postId: id
        })
      });
      const result = await response.json();
      const newData = data.map((posts) => {
        if (posts._id === result._id) {
          return result;
        } else {
          return posts;
        }
      });
      setData(newData);
      notifyB("Comment Posted Successfully");
      setComment("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="home">
      {
        data.map((eachPost) => {
          return (
            <div className="cardd" key={eachPost._id}>
              <div className="card-header">
                <div className="card-pic">
                  <img src={eachPost.postedBy.Photo ? eachPost.postedBy.Photo : defultPic} alt="profile" />
                </div>
                <Link to={`/profile/${eachPost.postedBy._id}`}>
                  <h5 className='name-link'>{eachPost.postedBy.name}</h5>
                </Link>
              </div>
              <div className="card-image">
                <img src={eachPost.photo} alt="photo" />
              </div>
              <div className="card-content">
                <div className="spanandlike">
                  <div className='likeandlogo'>
                    {
                      eachPost.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ? (
                        <span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => { unlikePost(eachPost._id) }}>
                          favorite
                        </span>
                      ) : (
                        <span className="material-symbols-outlined" onClick={() => { likePost(eachPost._id) }}>
                          favorite
                        </span>
                      )
                    }
                    <p>{eachPost.likes.length} Likes</p>
                  </div>
                  {
                    eachPost.saved === JSON.parse(localStorage.getItem("user"))._id ? (
                      <FaBookmark onClick={() => { unSavePost(eachPost._id) }} />
                    ) : (
                      <FaRegBookmark onClick={() => { savePost(eachPost._id) }} />
                    )
                  }
                </div>
                <p>{eachPost.body}</p>
                <p style={{ fontWeight: "bolder", cursor: "pointer" }} onClick={() => {
                  setShow(true)
                  setItem(eachPost)
                }}>View all comments</p>
                <div className="add-comment">
                  <span className="material-symbols-outlined">
                    mood
                  </span>
                  <input type="text" placeholder='Add a comment' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                  <button className="comment" onClick={() => { makeComment(eachPost._id, comment) }}>post</button>
                </div>
              </div>
            </div>
          )
        })
      }
      {
        show && (
          <div className="showComment">
            <div className="container">
              <div className="postPic">
                <img src={item.photo} alt="" />
              </div>
              <div className="details">
                <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                  <div className="card-pic">
                    <img src={defultPic} alt="profile" />
                  </div>
                  <h5>{item.postedBy.name}</h5>
                </div>
                <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                  {
                    item.comments.map((eachComment) => {
                      return (
                        <p className="comm" key={eachComment._id}>
                          <span className="commentor" style={{ fontWeight: "bolder" }}>{eachComment.postedBy.name} </span>
                          <span className="commentText">{eachComment.comment}</span>
                        </p>
                      )
                    })
                  }
                </div>

                <div className="card-content">
                  <p>{item.likes.length} likes</p>
                  <p>{item.body}</p>
                  <div className="add-comment">
                    <span className="material-symbols-outlined">
                      mood
                    </span>
                    <input type="text" placeholder='Add a comment' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                    <button className="comment" onClick={() => {
                      makeComment(item._id, comment)
                      setShow(false)
                    }} >post</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="close-comment" onClick={() => { setShow(false) }}>
              <span className="material-symbols-outlined material-symbols-outlined-comment ">
                close
              </span>
            </div>
          </div>
        )
      }
    </div>
  )
}
