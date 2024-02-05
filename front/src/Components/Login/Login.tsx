import React, { useState } from 'react'
import "./Login.css"
import { FaUser, FaKey } from "react-icons/fa";
import { GiMicroscope } from "react-icons/gi";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';


        

export const Login = () => {
  const { auth, setAuth }:any = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  async function sendLoginRequest() {
    toast.dismiss();
    const requestBody = {
      email: email,
      password: password
    }
    axios.post("auth/login", requestBody)
    .then(response => {
      if(response.status === 200){
        const role = response.data.role
        const token = response.data.token
        const refreshToken = response.data.refreshToken
        const signResults = response.data.signResults
        const userId = response.data.userId
        setAuth({email, password, role, token, refreshToken, signResults, userId}) 
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken))
        navigate("/")
      } else {
        setEmail("")
        setPassword("")
        toast.error("Invalid e-mail or password")
      }
    })
    .catch((message) =>{
      setEmail("")
      setPassword("")
      toast.error("Invalid e-mail or password")
    })
    
  }

  return (
    localStorage.getItem("refreshToken") !== "" && auth?.role?.includes("user") ? <Navigate to="/" state={{from: location}} replace /> :
    <div className='wrapper'>
        <form action=''>
            <h1><GiMicroscope /> e-Lab</h1>
            <div className="input-box">
                <input type="text" placeholder='E-mail' autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <FaUser className="icon"/>
            </div>
            <div className="input-box">
                <input type="password" placeholder='Password' autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <FaKey className="icon"/>
            </div>
            <button type='button' onClick={() => sendLoginRequest()}>Login</button>
        </form>
        <div><Toaster position='bottom-center' reverseOrder={false} containerStyle={{bottom: 300}}/></div>
    </div>
  )
}

export default Login
