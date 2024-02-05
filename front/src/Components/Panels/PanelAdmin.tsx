import React, { useState } from 'react'
import Topbar from '../Topbar/Topbar'
import "./PanelsAdmin.css"
import CreateUserTab from './PanelAdmin/CreateUserTab'
import ManageUserTab from './PanelAdmin/ManageUserTab'
import CreateClientTab from './PanelAdmin/CreateClientTab'
import { Toaster } from 'react-hot-toast'
import ManageClientTab from './PanelAdmin/ManageClientTab'

const PanelAdmin = () => {

  const [tab, setTab] = useState(1)

  const toggleTab = (index: number) => {
    setTab(index)
  }

  return (
    <div>
        <Topbar />
        <div className="admin_wrapper">
          <div className="bloc-tabs">
            <div className={tab === 1 ? 'active-tab' : 'tabs'} onClick={() => toggleTab(1)}>Create User</div>
            <div className={tab === 2 ? 'active-tab' : 'tabs'} onClick={() => toggleTab(2)}>Manage Users</div>
            <div className={tab === 3 ? 'active-tab' : 'tabs'} onClick={() => toggleTab(3)}>Create Client</div>
            <div className={tab === 4 ? 'active-tab' : 'tabs'} onClick={() => toggleTab(4)}>Manage Clients</div>
          </div>
          <div className={tab !== 2 ? 'content-tabs' : "content-tab-datatable"}>
            <div className={tab === 1 ? 'active-content' : 'content'}>
              <CreateUserTab />
            </div>
            <div className={tab === 2 ? 'active-content-datatable' : 'content'}>
              <ManageUserTab />
            </div>
            <div className={tab === 3 ? 'active-content' : 'content'}>
              <CreateClientTab />
            </div>
            <div className={tab === 4 ? 'active-content' : 'content'}>
              <ManageClientTab />
            </div>
          </div>
        </div>
        <div><Toaster position='bottom-center' reverseOrder={false} containerStyle={tab === 3 ? {bottom:170} : {bottom: 50}}/></div>
    </div>
  )
}

export default PanelAdmin