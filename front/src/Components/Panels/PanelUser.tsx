import React, { useEffect, useState } from 'react'
import Topbar from '../Topbar/Topbar'
import "./PanelUser.css"
import useAuth from '../../hooks/useAuth'
import useAxios from '../../hooks/useAxios'
import toast, { Toaster } from 'react-hot-toast'

const PanelUser = () => {
  const { auth }: any = useAuth()
  const axios = useAxios()
  const [user, setUser] = useState<any>()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [daysOffFrom, setDaysOffFrom] = useState<any>()
  const [daysOffTo, setDaysOffTo] = useState<any>()
  
  async function getUser() {
    axios.get("/user/"+auth?.userId, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((respose) => setUser(respose?.data))
      .catch((err) => console.error(err))
  }

  const requestBody = {
    password: password
  }

  async function changePassword() {
    axios.put("/user/changePassword/"+auth?.userId, requestBody, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((respose) => {
        toast.success("Password updated")
      })
      .catch((err) => {
        console.error(err)
        toast.error("Failed to update password")
      })
  }

  const verifyPassword = () => {
    if(password === confirmPassword) {
      changePassword()
      setPassword("")
      setConfirmPassword("")
    } else {
      toast.error("Passwords are not the same")
    }
  }

  const requestBodyDaysOff = {
    from: daysOffFrom,
    to: daysOffTo
  }

  async function changeDaysOffRequest() {
    axios.put("/user/changeDaysOff/"+auth?.userId, requestBodyDaysOff, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((respose) => {
        toast.success("Days Off Updated")
      })
      .catch((err) => {
        console.error(err)
        toast.error("Failed to update Days Off")
      })
  }

  const changeDaysOff = () => {
    changeDaysOffRequest()
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    setDaysOffFrom(user?.daysOffFrom)
    setDaysOffTo(user?.daysOffTo)
  }, [user])

  return (
    <div>
        <Topbar />
        <div className='user-wrapper'>
          <div className='user-details'>
            <h2>User Details</h2>

            <label> UserID
              <input
              disabled={true}
              type="text"
              name="userId"
              value={user?.userId}
              />
            </label>

            <label> First Name
              <input
              disabled={true}
              type="text"
              name="firstName"
              value={user?.firstName}
              />
            </label>

            <label> Last Name
              <input
              disabled={true}
              type="text"
              name="lastName"
              value={user?.lastName}
              />
            </label>

            <label> Email
              <input
              disabled={true}
              type="text"
              name="email"
              value={user?.email}
              />
            </label>

            <label> Phone Number
              <input
              disabled={true}
              type="text"
              name="phoneNumber"
              value={user?.phoneNumber}
              />
            </label>

            <label> Occupation
              <input
              disabled={true}
              type="text"
              name="occupation"
              value={user?.occupation}
              />
            </label>

            <label> title
              <input
              disabled={true}
              type="text"
              name="title"
              value={user?.title}
              />
            </label>

          </div>
          <div>
            <div className='password-change'>
              <div className='password-inputs'>
                <label> Password:
                  <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <label> Confirm Password:
                  <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
                </label>
              </div>
              <button onClick={verifyPassword}>Change Password</button>
            </div>
            <div className='days-off-change'>
             <div className='days-off-inputs'>
                <label> Days Off From
                  <input type='date' value={daysOffFrom} onChange={(e) => setDaysOffFrom(e.target.value)}></input>
                </label>
                <label> Days Off To
                  <input type='date' value={daysOffTo} min={daysOffFrom} onChange={(e) => setDaysOffTo(e.target.value)}></input>
                </label>
              </div>
              <button onClick={changeDaysOff}>Change</button>
            </div>
          </div>
        </div>
      <div><Toaster position='bottom-center' reverseOrder={false} containerStyle={{bottom: 50}}/></div>
    </div>
  )
}

export default PanelUser