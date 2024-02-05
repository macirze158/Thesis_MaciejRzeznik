import React from 'react'
import "./Topbar.css"
import useAuth from '../../hooks/useAuth'
import axios from '../../api/axios'
import { GiMicroscope } from "react-icons/gi";

const Topbar = () => {
  const { auth, setAuth }:any = useAuth()
  async function sendLogoutRequest() {
    const requestBody = {
      refreshToken: localStorage.getItem("refreshToken")?.replace(/['"]+/g, '')
    }
    axios.post("auth/logout", requestBody)
    .then(response => {
      if(response.status === 200){
        localStorage.setItem("refreshToken", "")
        setAuth("","","","","","","","")
      }
    })
    .catch((message) =>{
      console.error(String(message))
    })
  }

  return (
    <nav className='nav'>
        <a href="/" className="site-name" >e-Lab<GiMicroscope /></a>
        <button type="button" onClick={sendLogoutRequest}>Logout</button>
    </nav>
  )
}

export default Topbar