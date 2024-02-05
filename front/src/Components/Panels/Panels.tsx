import React, { useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import useAuth from '../../hooks/useAuth'
import Topbar from '../Topbar/Topbar'
import "./Panels.css"
import { FaUser } from "react-icons/fa";
import { FaRegHospital } from "react-icons/fa";
import { GiMicroscope } from "react-icons/gi";
import { MdAdminPanelSettings } from "react-icons/md";
import { useNavigate } from 'react-router-dom'

export const Panels = () => {

  const { auth }: any = useAuth()
  const axios = useAxios()
  const navigate = useNavigate()

  const userActive = auth?.role?.includes("user")
  const clientActive = auth?.role?.includes("client")
  const labActive = auth?.role?.includes("lab")
  const adminActive = auth?.role?.includes("admin")

  return (
    <div className="panels">
      <Topbar />
      <h1>Choose a panel</h1>
      <div className="panels_wrapper">
        <button disabled={!userActive} onClick={() => navigate("/user")}>User<br /><FaUser /></button>
        <button disabled={!clientActive} onClick={() => navigate("/client")}>Client<br /><FaRegHospital /></button>
        <button disabled={!labActive} onClick={() => navigate("/laboratory")}>Laboratory<br /><GiMicroscope /></button>
        <button disabled={!adminActive} onClick={() => navigate("/admin")}>Admin<br /><MdAdminPanelSettings /></button>
      </div>
    </div>
  )
}

export default Panels