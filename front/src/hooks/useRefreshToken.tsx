import React from 'react'
import useAuth from './useAuth'
import axios from 'axios'

const useRefreshToken = () => {
  const {auth, setAuth}:any = useAuth()
  
  const refresh = async () => {
    const requestBody = {
      token: localStorage.getItem("refreshToken")?.replace(/['"]+/g, '')
    }
    const response = await axios.post("/auth/refreshToken", requestBody)
    setAuth((prev: any) => {
      return {...prev, token: response.data.token, refreshToken: localStorage.getItem("refreshToken"), role: response.data.role, signResults: response.data.signResults, userId: response.data.userId}
    })
    return response.data.token
  }
  return refresh
}

export default useRefreshToken