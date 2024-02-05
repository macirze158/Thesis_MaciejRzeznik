import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import "primereact/resources/themes/lara-light-green/theme.css"
import "./ManageUserTab.css"
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import toast, { Toaster } from 'react-hot-toast'
import { Toolbar } from 'primereact/toolbar'
import useAxios from '../../../hooks/useAxios'

export const ManageUserTab = () => {
  
  const [loading, setLoading] = useState(false)
  const axios = useAxios()
  const { auth }: any = useAuth()
  const [data, setData] = useState([])
  const [allUsers, setAllUsers] = useState([])
  let emptyUser = {
    userId: "",
    firstName: '',
    lastName: "",
    email: '',
    phoneNumber: "",
    occupation: "",
    title: "",
    userRole: "",
    signResults: false,
    active: false
};
  const [user, setUser] = useState(emptyUser)
  const [modifyUserDialog, setModifyUserDialog] = useState(false)
  const [filters, setFilters] = useState({
    'lastName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'firstName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'phoneNumber    ': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'occupation': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'title': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'role': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'signResults': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'active': { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button label="Edit" className="p-button-warning" style={{minHeight: "2rem", minWidth: "2rem"}} onClick={() => confirmModifyUser(rowData)} />
            </React.Fragment>
        );
    }
    const confirmModifyUser = (user: any) => {
        setUser(user);
        setModifyUserDialog(true);
    }

    const hideDeleteUserDialog = () => {
        setModifyUserDialog(false);
    }

    const deleteUser = () => {
        let _users = allUsers.filter(val => val !== user);
        const requestBody = {
            userId: user.userId
          }
        setAllUsers(_users);
        setModifyUserDialog(false);
        setUser(emptyUser);
        axios.delete("user", {headers: {'Authorization': "Bearer " + auth?.token}, data: requestBody})
        .then(() => {toast.success("User deleted")})
        .catch((err) => {
            console.error(err)
            toast.error("Failed to delete user")
        })
    }

    const toggleActive = () => {
        setModifyUserDialog(false);
        setUser(emptyUser);
        axios.put("user/toggleActive/" + user.userId, { 
            headers: {
              'Authorization': "Bearer " + auth?.token
            }})
        .then(() => {toast.success("Toggled active")})
        .catch((err) => {
            console.error(err)
            toast.error("Failed to toggle active")
        })
        .finally(() => {getUsers()})
    }

    const deleteUserDialogFooter = (
        user.active ?
        <React.Fragment>
            <Button label="Cancel" style={{width: "25%"}} className="p-button" onClick={hideDeleteUserDialog}></Button>
            <Button label="Deactivate" severity="warning" style={{width: "25%"}} className="p-button" onClick={toggleActive}></Button>
            <Button label="Delete" severity="danger" style={{width: "25%"}} className="p-button" onClick={deleteUser}></Button>
        </React.Fragment>
        :   
        <React.Fragment>
            <Button label="Cancel" style={{width: "25%"}} className="p-button" onClick={hideDeleteUserDialog}></Button>
            <Button label="Activate" severity="warning" style={{width: "25%"}} className="p-button" onClick={toggleActive}></Button>
            <Button label="Delete" severity="danger" style={{width: "25%"}} className="p-button" onClick={deleteUser}></Button>
        </React.Fragment>
    );

    const getUsers = () => {
        setLoading(true)
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
        .finally(() => {
            setLoading(false)
          })
    }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div>   
        {loading ? (<div>Loading data</div>) : (
        <DataTable className="data-table" 
        value={allUsers} 
        showGridlines 
        stripedRows
        paginator rows={18}
        removableSort 
        filters={filters} 
        filterDisplay="row"
        tableStyle={{width: '100%'}}>
            <Column field="userId" header="ID" sortable />
            <Column field="firstName" header="First Name" sortable filter/>
            <Column field="lastName" header="Last Name" sortable filter/>
            <Column field="email" header="Email" sortable filter/>
            <Column field="phoneNumber" header="Phone Number" sortable filter/>
            <Column field="occupation" header="Occupation" sortable filter/>
            <Column field="title" header="Title" sortable filter/>
            <Column field="role" header="User Role" sortable filter/>
            <Column field="signResults" header="Sign Results" sortable filter/>
            <Column field="active" header="Active" sortable filter/>
            <Column body={actionBodyTemplate} exportable={false} />
        </DataTable>)}
        <Dialog visible={modifyUserDialog} style={{ width: '30vw', height: "15vh"}} header="Settings" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div>
                    <span>Modifying user <b>{user?.firstName} {user?.lastName}</b></span>
                </div>
        </Dialog>
    </div>
  ) 
}

export default ManageUserTab