import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

export default function SearchUser() {
    const [search, setsearch] = useState("");
    const [users, setUsers] = useState([]);

    const searchUsers = async() => {
        try{const response = await fetch(`https://insta-clone-backend-1.onrender.com/searcheduser/${search}`,{
          method:'GET',
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")    
          }  
        })
        const result = await response.json()
        setUsers(result)
      }catch(err){
        console.log(err)
      }
      }
  return (
  <>
    <div className='search-div'>
    <div>
        <input type='text' value={search} placeholder='Search User' onChange={(e) => {
        setsearch(e.target.value)
        }}/>
        <button type='button' onClick={() => {searchUsers()
        setsearch("")
        }}>Search</button>
    </div>
    <hr style={{color:"grey"}}/>
    <div> 
        {
            users.map((eachuser) => {
            if(eachuser.Photo){
                return (
                    <Link className='oneuser' to={`/profile/${eachuser._id}`}>
                    <img src={eachuser.Photo} alt="user" />
                    <p>{eachuser.name}</p>
                    </Link>
                )
            }else{
                return(
                    <Link className='oneuser' to={`/profile/${eachuser._id}`}>
                        <img src='data:image/jpeg;base64,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' alt='user' />
                    <p>{eachuser.name}</p>
                    </Link>
                )
            }
            })
        }
        </div>
    </div>     
    </>
  )
}
