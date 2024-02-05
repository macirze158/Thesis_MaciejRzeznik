import React, { useEffect, useState } from 'react'
import "./ManageClientTab.css"
import useAuth from '../../../hooks/useAuth'
import { RxUpdate } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';
import { Toolbar } from 'primereact/toolbar';
import useAxios from '../../../hooks/useAxios';

export const ManageClientTab = () => {
  const [clients, setClients] = useState<any[]>([])
  const axios = useAxios()
  const [value, setValue] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<any[]>([])
  const [permittedUsers, setPermittedUsers] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [assignUserDialog, setAssignUserDialog] = useState(false)
  const [permitUserDialog, setPermitUserDialog] = useState(false)
  const [user, setUser] = useState()
  const [client, setClient] = useState({
    clientId: '',
    clientName: '',
    city: '',
    address: '',
    nip: '',
    users: [''],
    active: "",
    notificationUsers: [''],
    permittedUsers: ['']
  })
  const { auth }: any = useAuth()
  const [deleteClientDialog, setDeleteClientDialog] = useState(false)
  const hideDeleteClientDialog = () => {
    setDeleteClientDialog(false);
  }

  const deleteClient = () =>{
    axios.delete("client/"+client.clientId, { 
        headers: {
          'Authorization': "Bearer " + auth?.token
        }})
        .then((response) => {
          toast.success("Client deleted")
        })
        .catch((err) => {
          toast.error("Failed to delete client")
          console.error(err)
      })
      .finally(() => {
        getClients()
        setDeleteClientDialog(false);
      })
  }

  const confirmDeleteClient = () => {
    setDeleteClientDialog(true);
  }

  const deleteClientDialogFooter = (
    <React.Fragment>
        <Button label="No" style={{width: "25%"}} className="p-button" onClick={hideDeleteClientDialog}></Button>
        <Button label="Delete" severity="danger" style={{width: "25%"}} className="p-button" onClick={deleteClient}></Button>
    </React.Fragment>
);

  async function getClients() {
    axios.get("client/active", { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((response) => {
        setClients(response.data)
      })
      .catch((err) => {
        console.error(err)
    })
  }

  async function getUsers() {
    axios.get("user/assignedTo/"+client.clientId, { 
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

  function setNotAnassignedUsers() {
    const unassigned = allUsers.filter(user => !assignedUsers.some(assignedUser => assignedUser.userId === user.userId))
    return unassigned.filter(user => (user.role).includes("client"))
  }

  async function getAllUsers() {
    axios.get("user", { 
        headers: {
          'Authorization': "Bearer " + auth?.token
    }})
    .then((response) => {
        setAllUsers(response.data)
    })
    .catch((err) => {
        console.error(err)
    })
  }

  const requestBody = {
    clientName: client.clientName,
    city: client.city,
    address: client.address,
    nip: client.nip,
    active: client.active,
    users: client.users
}

  async function updateClient() {
    axios.put("client/"+client.clientId, requestBody, { 
        headers: {
          'Authorization': "Bearer " + auth?.token
        }})
        .then((response) => {
          toast.success("Client updated")
        })
        .catch((err) => {
          console.error(err)
          toast.error("Failed to update client")
        })
  }

  async function updatePermittedUsers(pUsers: any[] | undefined) {

    const reqBody = {
      permittedUsers: pUsers
    }

    axios.put("client/"+client.clientId+"/permitted-users", reqBody, { 
        headers: {
            'Authorization': "Bearer " + auth?.token
        }})
        .then((response) => {
            toast.success("Updated permmited users")
        })
        .catch((err) => {
            console.error(err)
            toast.error("Failed to update  permitted users")
        })
  }   

  const handleChange = (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value
    setValue(selectedValue)
    setClientByClientName(selectedValue)
  }

  const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target
    setClient((prevFormData: any) => ({ ...prevFormData, [name]: value }))
}

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault()
  }

   const [filters, setFilters] = useState({
    'lastName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'firstName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

  useEffect(() =>  {
    getClients()
    getAllUsers()
  }, [])

  useEffect(() =>  {
    if(clients[0] !== undefined) {
        setValue(clients[0].clientName)
        setClientByClientName(clients[0].clientName)
    }
  }, [clients])

  useEffect(() => {
    getUsers()
    if(client?.permittedUsers !== null) {
        setPermittedUsers(client.permittedUsers)
    } else {
        setPermittedUsers([])
    }
  }, [client])

  function setClientByClientName(clientName: any) {
    setClient(clients.find(_client => _client.clientName === clientName))
  }

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button label="Unassign" className="p-button-danger" style={{minHeight: "1rem", minWidth: "1rem"}} onClick={() => confirmUnassignUser(rowData)} />
            </React.Fragment>
        );
    }

    const removePermissionBodyTemplate = (rowData: any) => {
      return (
          <React.Fragment>
              <Button label="Remove" className="p-button-danger" style={{minHeight: "1rem", minWidth: "1rem"}} onClick={() => confirmRemovePermission(rowData)} />
          </React.Fragment>
      );
  }

    const assignUserBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button label="Assign" style={{minHeight: "1rem", minWidth: "1rem"}} onClick={() => confirmAssignUser(rowData)}/>
            </React.Fragment>
        );
    }

    const permitUserBodyTemplate = (rowData: any) => {
      return (
          <React.Fragment>
              <Button label="Permit" style={{minHeight: "1rem", minWidth: "1rem"}} onClick={() => confirmPermitUser(rowData)}/>
          </React.Fragment>
      );
  }

    const confirmAssignUser = (user: any) => {
        setUser(user);
        const reqBody = {
            userId: user.userId,
            clientId: client.clientId
        }
        assignUser(reqBody) 
    }

    const confirmPermitUser = async (user: any) => {
      setUser(user);
      const _permittedUsers = permittedUsers
      _permittedUsers.push(user.userId)
      setPermittedUsers(_permittedUsers)
      updatePermittedUsers(_permittedUsers);
    }

    const confirmUnassignUser = (user: any) => {
        setUser(user);
        const reqBody = {
            userId: user.userId,
            clientId: client.clientId
        }
        unassignUser(reqBody)
    }

    const confirmRemovePermission = (user: any) => {
      setUser(user);
      const updatedUsers = permittedUsers.filter((item) => item !== user.userId);
      setPermittedUsers(updatedUsers);
      updatePermittedUsers(updatedUsers);
    }

    async function assignUser(reqBody: any) {
        axios.post("client/assign", reqBody, { 
            headers: {
              'Authorization': "Bearer " + auth?.token
            }})
            .then((response) => {
              toast.success("User assigned")
              getUsers()
              setNotAnassignedUsers()
            })
            .catch((err) => {
              console.error(err)
              toast.error("Failed to assign user")
            })
      }

      async function unassignUser(reqBody: any) {
        axios.delete("client/unassign", {headers: {'Authorization': "Bearer " + auth?.token}, data: reqBody})
            .then((response) => {
              toast.success("User unassigned")
              getUsers()
              setNotAnassignedUsers()
            })
            .catch((err) => {
              console.error(err)
              toast.error("Failed to unassign user")
            })
      }

    const toolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Assign user" style={{marginRight: "5px"}} onClick={showAssignUserDialog}/>
            </React.Fragment>
        )
    }

    const permisionToolbarTemplate = () => {
      return (
          <React.Fragment>
              <Button label="Permit user" style={{marginRight: "5px"}} onClick={showPermitUserDialog}/>
          </React.Fragment>
      )
  }

    const hideAssignUserDialog = () => {
        setAssignUserDialog(false);
    }

    const showAssignUserDialog = () => {
        setAssignUserDialog(true)
    }

    const hidePermitUserDialog = () => {
      setPermitUserDialog(false);
  }

  const showPermitUserDialog = () => {
    setPermitUserDialog(true)
  }

  function unpermittedUsers() {
    const users = assignedUsers.filter(user => !permittedUsers?.some(_user => _user === user.userId))
    return users
  }

  function allPermittedUsers() {
    const users = assignedUsers.filter(user => permittedUsers?.some(_user => _user === user.userId))
    return users
  }

  return (
    <div className='client-manage-container'>
        <div className='client-data'>
            <select value={value} onChange={handleChange}>
                {clients.map((client) => (
                    <option value={client.clientName}>{client.clientName}</option>
                ))}
            </select>
            <form onSubmit={handleSubmit}>
            <div className='inputs-div'>
                <h2>Client Data</h2>
                <label>ID: </label>
                <input 
                    disabled={true}
                    type="text"
                    name="id"
                    value={client.clientId}
                />

                <label>Client Name: </label>
                <input 
                    disabled={true}
                    type="text"
                    name="clientName"
                    value={client.clientName}
                />

                <label>City: </label>
                <input 
                    type="text"
                    name="city"
                    value={client.city}
                    onChange={handleInputChange}
                />

                <label>Address: </label>
                <input 
                    type="text"
                    name="address"
                    value={client.address}
                    onChange={handleInputChange}
                />

                <label>NIP: </label>
                <input 
                    type="text"
                    name="nip"
                    value={client.nip}
                    onChange={handleInputChange}
                />  
            </div>
            <button className='client-button' type="button" onClick={confirmDeleteClient}>Delete Client <MdDelete /></button>
            <button className='client-button' type="submit" onClick={updateClient}>Update Client <RxUpdate /></button>
            </form>
            <Dialog visible={deleteClientDialog} style={{ width: '30vw', height: "15vh"}} header="Confirm" modal footer={deleteClientDialogFooter} onHide={hideDeleteClientDialog}>
                <div>
                    <span>Are you sure you want to delete client?</span>
                </div>
            </Dialog>
        </div>  
        <div className='client-tables'>
            <div>
                <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>
                <DataTable className="data-table" 
                value={assignedUsers} 
                showGridlines 
                paginator rows={9} 
                removableSort 
                filters={filters} 
                filterDisplay="row"
                tableStyle={{width: '100%'}}>
                    <Column field="firstName" header="First Name" sortable filter/>
                    <Column field="lastName" header="Last Name" sortable filter/>
                    <Column field="email" header="Email" sortable filter/>
                    <Column body={actionBodyTemplate} exportable={false} />
                </DataTable>
                <Dialog visible={assignUserDialog} style={{ width: '60vw', height: "43vh"}} header="Assign User" modal onHide={hideAssignUserDialog}>
                    <div>
                        <DataTable className="data-table" 
                        value={setNotAnassignedUsers()} 
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
                            <Column body={assignUserBodyTemplate} exportable={false} />
                        </DataTable>
                    </div>
                </Dialog>
            </div>
            <div>
                <Toolbar className="mb-4" left={permisionToolbarTemplate}></Toolbar>
                <DataTable className="data-table" 
                value={allPermittedUsers()} 
                showGridlines 
                paginator rows={9} 
                removableSort 
                filters={filters} 
                filterDisplay="row"
                tableStyle={{width: '100%'}}>
                    <Column field="firstName" header="First Name" sortable filter/>
                    <Column field="lastName" header="Last Name" sortable filter/>
                    <Column field="email" header="Email" sortable filter/>
                    <Column body={removePermissionBodyTemplate} exportable={false} />
                </DataTable>
                <Dialog visible={permitUserDialog} style={{ width: '60vw', height: "43vh"}} header="Permit User" modal onHide={hidePermitUserDialog}>
                    <div>
                        <DataTable className="data-table" 
                        value={unpermittedUsers()} 
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
                            <Column body={permitUserBodyTemplate} exportable={false} />
                        </DataTable>
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
  )
}

export default ManageClientTab