import React, { useState } from 'react'
import "./CreateClientTab.css"
import useAxios from '../../../hooks/useAxios'
import useAuth from '../../../hooks/useAuth'
import toast, { Toaster } from 'react-hot-toast'

export const CreateClientTab = () => {
    const [inputs, setInputs] = useState({clientName: "", city: "", address: "", nip: ""})
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target
        setInputs((prevFormData: any) => ({ ...prevFormData, [name]: value }))
    }
    
    const axios = useAxios()
    const { auth }: any = useAuth()

    const requestBody = {
        clientName: inputs.clientName,
        city: inputs.city,
        address: inputs.address,
        nip: inputs.nip,
        active: true
    }

    async function postClient(loadingToast: any) {
        axios.post("client", requestBody, { 
          headers: {
            'Authorization': "Bearer " + auth?.token
          }})
          .then(() => {
            toast.dismiss(loadingToast)
            toast.success("Client created")
          })
          .catch((err) => {
            console.error(err)
            if(requestBody.clientName === "") {
                toast.dismiss(loadingToast)
                toast.error("Fill in required fields")
            }
            else {
                toast.dismiss(loadingToast)
                toast.error("Failed to create client")
            }
          })
      }

      const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        setInputs({clientName: "", city: "", address: "", nip: ""})
        const loadingToast = toast.loading("Client is being created")
        postClient(loadingToast)
    }
      
  return (
    <div className="client-form-container">
        <form onSubmit={handleSubmit}>
            <div className='inputs-div'>
                <h2>Client Data</h2>
                <label>Client Name*: </label>
                <input 
                    type="text"
                    name="clientName"
                    value={inputs.clientName}
                    onChange={handleChange}
                />

                <label>City: </label>
                <input 
                    type="text"
                    name="city"
                    value={inputs.city}
                    onChange={handleChange}
                />

                <label>Address: </label>
                <input 
                    type="text"
                    name="address"
                    value={inputs.address}
                    onChange={handleChange}
                />

                <label>NIP: </label>
                <input 
                    type="text"
                    name="nip"
                    value={inputs.nip}
                    onChange={handleChange}
                /> 
            </div>
            <button type="submit">Create Client</button>
        </form>
    </div>
  )
}

export default CreateClientTab