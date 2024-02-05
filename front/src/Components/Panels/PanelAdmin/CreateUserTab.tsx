import React, { useRef, useState } from 'react'
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';
import "./CreateUserTab.css"
import toast, { Toaster } from 'react-hot-toast';
import { InputMask } from 'primereact/inputmask';

export const CreateUserTab = () => {

    const [inputs, setInputs] = useState({firstName: "", lastName: "", password: "", email: "", role: "", phoneNumber: ""})
    const [isActive, setIsActive] = useState(true)
    const [clientRole, setClientRole] = useState(false)
    const [labRole, setLabRole] = useState(false)
    const [adminRole, setAdminRole] = useState(false)
    const [signResults, setSignResults] = useState(false)
    let occupationRef = useRef<HTMLSelectElement>(null)
    let titleRef = useRef<HTMLSelectElement>(null)
    const axios = useAxios()
    const { auth }: any = useAuth()

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target
        setInputs((prevFormData: any) => ({ ...prevFormData, [name]: value }))
    }

    const handleActiveChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsActive(event.target.checked)
    }

    const handleClientRoleChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setClientRole(event.target.checked)
    }

    const handleLabRoleChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setLabRole(event.target.checked)
    }

    const handleAdminRoleChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setAdminRole(event.target.checked)
    }

    const handleSignResultsChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setSignResults(event.target.checked)
    }

    function prepareRole() {
        let role = "user"
        if(clientRole)
            role += "_client"
        if(labRole)
            role += "_lab"
        if(adminRole)
            role += "_admin"
        return role
    }

    const requestBody = {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        password: Math.random().toString(36).slice(-8),
        email: inputs.email,
        active: isActive,
        role: prepareRole(),
        occupation: occupationRef.current?.value,
        phoneNumber: inputs.phoneNumber,
        signResults: signResults,
        title: titleRef.current?.value
    }

    async function postUser(loadingToast: any) {
        axios.post("user", requestBody, { 
          headers: {
            'Authorization': "Bearer " + auth?.token
          }})
          .then(() => {
            toast.dismiss(loadingToast)
            toast.success("User created")
            window.location.reload();
          })
          .catch((err) => {
            console.error(err)
            if(requestBody.email === "" || requestBody.firstName === ""|| requestBody.lastName === "") {
                toast.dismiss(loadingToast)
                toast.error("Fill in required fields")
            }
            else {
                toast.dismiss(loadingToast)
                toast.error("Failed to create user")
            }
          })
      }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const loadingToast = toast.loading("User is being created")
        postUser(loadingToast)
        setInputs({firstName: "", lastName: "", password: "", email: "", role: "", phoneNumber: ""})
        setIsActive(true)
        setSignResults(false)
        setClientRole(false)
        setLabRole(false)
        setAdminRole(false)
    }
      
  return (
    <div className="form-container">
        <form onSubmit={handleSubmit}>
            <div className='inputs-div'>
                <h2>User Data</h2>
                <label>First Name*: </label>
                <input 
                    type="text"
                    name="firstName"
                    value={inputs.firstName}
                    onChange={handleChange}
                />

                <label>Last Name*: </label>
                <input 
                    type="text"
                    name="lastName"
                    value={inputs.lastName}
                    onChange={handleChange}
                />

                <label>email*: </label>
                <input 
                    type="text"
                    name="email"
                    value={inputs.email}
                    onChange={handleChange}
                />

                <label>Phone Number: </label>
                <InputMask 
                    type="text"
                    name="phoneNumber"
                    value={inputs.phoneNumber}
                    onChange={handleChange}
                    mask="999-999-999"
                />

                <label>Occupation: </label>
                <select ref={occupationRef}>
                    <option value="">-</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Technician">Technician</option>
                </select>

                <label>Title: </label>
                <select ref={titleRef}>
                    <option value="">-</option>
                    <option value="Master">Master</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Professor">Professor</option>
                </select>
            </div>
        </form>
        <form onSubmit={handleSubmit}>
            <div className='roles'>
                <h2>Roles</h2>
                <div className="role-checkbox">
                    <label>Client:</label>
                    <input
                        type="checkbox"
                        name="client"
                        checked={clientRole}
                        onChange={handleClientRoleChange}
                    />
                    </div>
                    <div className="role-checkbox">
                    <label>Lab:</label>
                    <input
                        type="checkbox"
                        name="lab"
                        checked={labRole}
                        onChange={handleLabRoleChange}
                    />
                    </div>
                    <div className="role-checkbox">
                    <label>Admin:</label>
                    <input
                        type="checkbox"
                        name="admin"
                        checked={adminRole}
                        onChange={handleAdminRoleChange}
                    />
                </div>
            </div>
            <div className='settings-div'>
                <h2>Settings</h2>
                <div className='settings-checkbox'>
                {labRole ? 
                    <div>
                        <label>Sign Results: </label>
                        <input 
                            type="checkbox"
                            name="active"
                            checked={signResults}
                            onChange={handleSignResultsChange}
                        />
                    </div>
                    :
                null}
                    <div>
                        <label>active: </label>
                        <input 
                            type="checkbox"
                            name="active"
                            checked={isActive}
                            onChange={handleActiveChange}
                        />
                    </div>
                </div>
            </div> 
            <button type="submit">Create User</button>
        </form>
    </div>
  )
}

export default CreateUserTab