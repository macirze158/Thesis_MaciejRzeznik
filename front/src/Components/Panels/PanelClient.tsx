import React, { useEffect, useState } from 'react'
import Topbar from '../Topbar/Topbar'
import "./PanelClient.css"
import useAuth from '../../hooks/useAuth'
import useAxios from '../../hooks/useAxios'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { IoMdSettings } from "react-icons/io";
import { Dialog } from 'primereact/dialog'
import { OrderList } from 'primereact/orderlist'
import toast, { Toaster } from 'react-hot-toast'

const PanelClient = () => {
  const { auth }: any = useAuth()
  const axios = useAxios()
  const [results, setResults] = useState()
  const [result, setResult] = useState<any>();
  const [viewResultDialog, setViewResultDialog] = useState(false)
  const [assignedClients, setAssignedClients] = useState<any[]>([])
  const [inputClient, setInputClient] = useState<any>()
  const [notificationHierarchy, setNotificationHierarchy] = useState<any[]>([""])
  const [changeNotificationHierarchy, setChangeNotificationHierarchy] = useState(false)
  const [editNotificationHierarchy, setEditNotificationHierarchy] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImage, setFullImage] = useState('');
  const [addUserToNhDialog, setAddUserToNhDialog] = useState(false)
  const [assignedUsers, setAssignedUsers] = useState<any[]>([])
  const [user, setUser] = useState<any>()
  const [filters, setFilters] = useState({
    'resultId': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'pesel': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'patientFirstName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'patientLastName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'clientId.clientName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'userId.lastName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'priority': { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const assignedUserBodyTemplate = (rowData: { userId: any }) => {
    const { userId } = rowData;
    const assignedUser = `${userId?.firstName} ${userId?.lastName}`;
    if (userId?.firstName !== undefined && userId?.lastName !== undefined) {
      return (
        <div>
          {assignedUser}
        </div>
      );
    }
    return (
      <div>
        N/A
      </div>
    );
  };

  const viewBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
          <Button label="View" className="p-button-info" style={{minHeight: "2rem", minWidth: "2rem"}} onClick={() => confirmViewResult(rowData)} />
      </React.Fragment>
    );
  }

  const confirmViewResult = (result: any) => {
    setResult(result);
    setViewResultDialog(true)
  } 

  const showEditNotificationHierarchy = () => {
    setEditNotificationHierarchy(true)
  }

  const hideEditNotificationHierarchy = () => {
    setEditNotificationHierarchy(false)
  }

  const toolbarNhTemplate = () => {
    return (
        <React.Fragment>
            <Button label="Add User to Notifiation Hierarchy" style={{marginRight: "5px"}} onClick={showAddnUserToNhDialog}/>
        </React.Fragment>
    )
  }

  const showAddnUserToNhDialog = () => {
    setAddUserToNhDialog(true)
  }

  const hideAddnUserToNhDialog = () => {
    setAddUserToNhDialog(false)
  }

  const discardChanges = () => {
    setNotificationHierarchy(inputClient?.notificationUsers)
  }

const toolbarNhSaveTemplate = () => {
  return (
      <React.Fragment>
          <Button label="Discard" severity="warning" style={{marginRight: "5px"}} onClick={() => discardChanges()}/>
          <Button label="Save" style={{marginRight: "5px"}} onClick={() => updateNotificationHierarchy()}/>
      </React.Fragment>
  )
}

const addUserToNhBodyTemplate = (rowData: any) => {
  return (
      <React.Fragment>
          <Button label="Add" style={{minHeight: "1rem", minWidth: "1rem"}} onClick={() => confirmAddUserToNh(rowData)}/>
      </React.Fragment>
  );
}

const confirmAddUserToNh = (user: any) => {
  setUser(user);
  const prevNh = notificationHierarchy
  const nh = notificationHierarchy
  nh.push(user.userId)
  setNotificationHierarchy(nh)
  updateNotificationHierarchy()
}

function setUsersNotAddedToNh() {
  const users = assignedUsers.filter(user => !notificationHierarchy?.some(_user => _user === user.userId))
  return users
}

const handleNhChange = (event: React.SetStateAction<any[]>) => {
  setNotificationHierarchy(event)
}

const itemTemplate = (user: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => {
  const _user: any = assignedUsers.find((u) => {return u.userId === user})
  return (  
      <div className='order-list-layout'>
          <span className="order-list-field">Name: {_user?.firstName} {_user?.lastName}</span>
           <span className="order-list-field">Occupation: {_user?.occupation ? _user?.occupation : "-"}</span>
           <span className="order-list-field">Email: {_user?.email} </span>
           <Button label='Remove' severity="danger" className="order-list-field" onClick={() => {confirmRemoveUserFromNh(user)}}/>
      </div>
  );
};

const confirmRemoveUserFromNh = (user: any) => {
  setNotificationHierarchy(prevNh => {return prevNh.filter(item => item !== user)})
}

const hideFullImage = () => {
  setShowFullImage(false)
};

const viewFullImage = (image: React.SetStateAction<string>) => {
  setFullImage(image)
  setShowFullImage(true)
};

function assignedUser() {
  return result?.userId?.firstName + " " + result?.userId?.lastName
}

  async function getAssignedUsers() {
    axios.get("/client/user/"+auth?.userId, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((respose) => setAssignedClients(respose?.data))
      .catch((err) => console.error(err))
  }

  async function getClientResults() {
    axios.get("/result/client/"+inputClient?.clientId, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((respose) => setResults(respose?.data))
      .catch((err) => console.error(err))
  }

  const requestBody = {
    notificationUsers: notificationHierarchy
  }

  async function updateNotificationHierarchy() {
    axios.put("client/"+inputClient.clientId+"/notification-hierarchy", requestBody, { 
        headers: {
            'Authorization': "Bearer " + auth?.token
        }})
        .then((response) => {
            toast.success("Notification Hierarchy updated")
            setInputClient(((prev: any) => ({ ...prev, notificationUsers: notificationHierarchy })))
        })
        .catch((err) => {
            console.error(err)
            toast.error("Failed to update Notification Hierarchy")
        })
}

async function getUsers() {
  axios.get("user/assignedTo/"+inputClient?.clientId, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
  }})
  .then((response) => {
      setAssignedUsers(response.data)
  })
  .catch((err) => {
      console.error(err)
  })
}

  const canChangeHierachyTree = () => {
    if(inputClient?.permittedUsers?.includes(auth?.userId)){
      setChangeNotificationHierarchy(true)
    } else {
      setChangeNotificationHierarchy(false)
    }
  }

  useEffect(() => {
    getAssignedUsers()
    getClientResults()
  }, [])

  useEffect(() => {
    getClientResults()
    setNotificationHierarchy(inputClient?.notificationUsers)
    getUsers()
    canChangeHierachyTree()
  }, [inputClient])
  
  return (
    <div>
        <Topbar />
        <div className='clients-wrapper'>

          <Dropdown
            style={{width: "calc(60%)", height: "5vh", minHeight: "50px", marginBottom: "5px", marginTop: "5px"}}
            value={inputClient}
            options={assignedClients}
            optionLabel="clientName"
            filter
            onChange={(e) => setInputClient(e.value)}
           />
           
           {changeNotificationHierarchy ? 
           <Button severity="info" className='settings-button' onClick={showEditNotificationHierarchy}>Notification Hierarchy<IoMdSettings /></Button>
           :
           null}

          <DataTable className="data-table" 
          value={results} 
          showGridlines 
          paginator rows={15} 
          removableSort 
          filters={filters} 
          filterDisplay="row"
          tableStyle={{width: '100%'}}>
              <Column style={{width: "6rem"}} field="resultId" header="ID" sortable filter/>
              <Column field="pesel" header="PESEL" sortable filter/>
              <Column field="patientFirstName" header="Firs Name" sortable filter/>
              <Column field="patientLastName" header="Last Name" sortable filter/>
              <Column field="clientId.clientName" header="Client" sortable filter/>
              <Column field="userId.lastName" body={assignedUserBodyTemplate} header="Assigned User" sortable filterPlaceholder='Search by last name' filter/>
              <Column style={{width: "6rem"}} field="priority" header="Priority" sortable filter/>
              <Column body={viewBodyTemplate} exportable={false} />
          </DataTable>
          <Dialog resizable={false} visible={viewResultDialog} style={{ width: '90vw', height: "77vh"}} header="Modify result" modal onHide={() => setViewResultDialog(false)}>
              <div className='modify-result-container'>
                <form>
                  <label>ID: </label>
                  <input 
                      disabled={true}
                      type="text"
                      name="resultId"
                      value={result?.resultId}
                  />

                  <label>PESEL*: </label>
                  <input 
                      disabled={true}
                      type="text"
                      name="pesel"
                      value={result?.pesel}
                  />

                  <label>First Name: </label>
                  <input 
                      disabled={true}
                      type="text"
                      name="patientFirstName"
                      value={result?.patientFirstName}
                  />

                  <label>Last Name: </label>
                  <input 
                      disabled={true}
                      type="text"
                      name="patientLastName"
                      value={result?.patientLastName}
                  />

                  <label>Client: </label>
                  <input 
                      disabled={true}
                      type="text"
                      name="clientName"
                      value={result?.clientId?.clientName}
                  />

                  <label>Assigned user: </label>
                  <input 
                      disabled={true}
                      type="text"
                      name="assignedUser"
                      value={assignedUser()}
                  />

                </form>
                <div className='diagnosis-container'>
                  <label>
                    Diagnosis
                    <textarea
                      disabled={true}
                      value={result?.diagnosis}
                    />
                  </label>
                  <div>
                    <label>CITO:</label>
                    <input
                        disabled={true}
                        type="checkbox"
                        name="CITO"
                        checked={result?.priority === "cito"}
                    />
                    <label>DILO:</label>
                    <input
                        disabled={true}
                        type="checkbox"
                        name="DILO"
                        checked={result?.priority === "dilo"}
                    />
                  </div>
                  <div>
                    <div className='img-holder'>
                      <img onClick={() => viewFullImage(result?.image)} src={result?.image} />
                    </div>
                    <Dialog visible={showFullImage} onHide={hideFullImage} className='full-image-dialog'>
                      <img src={fullImage}/>
                    </Dialog>
                  </div>
                </div>
              </div>
          </Dialog> 
          <Dialog resizable={false} visible={editNotificationHierarchy} style={{ width: '60vw', height: "60vh"}} header="Edit Notification Hierarchy" modal onHide={hideEditNotificationHierarchy}>
            <Toolbar className="mb-4 order-list-toolbar" style={{width: "57.5vw", marginTop: "40px"}} left={toolbarNhTemplate} right={toolbarNhSaveTemplate}></Toolbar>
              <OrderList
                  listStyle={{height: "50vh"}} 
                  dragdrop={true} 
                  value={notificationHierarchy}
                  onChange={(e) => handleNhChange(e.value)} 
                  itemTemplate={itemTemplate} 
                  header="Notification Hierarchy">
              </OrderList>
              {JSON.stringify(inputClient?.notificationUsers) !== JSON.stringify(notificationHierarchy) ? <div style={{color: "red"}}>There are unsaved changes</div> : null}
                <Dialog visible={addUserToNhDialog} style={{ width: '60vw', height: "43vh"}} header="Add User to Notification Hierarchy" modal onHide={hideAddnUserToNhDialog}>
                    <div>
                        <DataTable className="data-table" 
                        value={setUsersNotAddedToNh()} 
                        showGridlines 
                        paginator rows={11}
                        stripedRows
                        removableSort 
                        filters={filters} 
                        filterDisplay="row"
                        tableStyle={{width: '100%'}}>
                            <Column field="firstName" header="First Name" sortable filter/>
                            <Column field="lastName" header="Last Name" sortable filter/>
                            <Column field="email" header="Email" sortable filter/>
                            <Column body={addUserToNhBodyTemplate} exportable={false} />
                        </DataTable>
                    </div>
                </Dialog>
          </Dialog>
        </div>
      <div><Toaster position='bottom-center' reverseOrder={false} containerStyle={{bottom: 50}}/></div>
    </div>
  )
}

export default PanelClient