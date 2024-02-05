import React, { useEffect, useState } from 'react'
import Topbar from '../Topbar/Topbar'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import useAuth from '../../hooks/useAuth'
import { FilterMatchMode } from 'primereact/api'
import "./PanelLab.css"
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import toast, { Toaster } from 'react-hot-toast'
import { InputMask } from 'primereact/inputmask'
import useRefreshToken from '../../hooks/useRefreshToken'
import useAxios from '../../hooks/useAxios'
import { TiTickOutline } from "react-icons/ti";
import axios from 'axios'

const PanelLab = () => {

  const [results, setResults] = useState<any[]>([]);
  const myAxios = useAxios()
  const [result, setResult] = useState<any>();
  const [savedResult, setSavedResult] = useState<any>();
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImage, setFullImage] = useState('');
  const { auth }: any = useAuth()
  const [addResultDialog, setAddResultDialog] = useState(false)
  const [modifyResultDialog, setModifyResultDialog] = useState(false)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [allClients, setAllClients] = useState<any[]>([])
  const [editingMode, setEditingMode] = useState(false)
  const [image, setImage] = useState<any>(null)
  const [imageUpdated, setImageUpdated] = useState("")
  const [cito, setCito] = useState(false)
  const [dilo, setDilo] = useState(false)
  const [filters, setFilters] = useState({
    'resultId': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'pesel': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'patientFirstName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'patientLastName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'clientId.clientName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'userId.lastName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'signed': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'priority': { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [inputs, setInputs] = useState({pesel: "", patientFirstName: "", patientLastName: ""})
  const [inputClient, setInputClient] = useState<any>()
  const [inputUser, setInputUser] = useState<any>()
  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target
    setInputs((prevFormData: any) => ({ ...prevFormData, [name]: value }))
  }

  const handleImageChange = (e:any) => {
    setImage(e.target.files[0])
    setResult((prev: any) => ({ ...prev, image: URL.createObjectURL(e.target.files[0]) }))
  }

  const uploadToCloudinary = async () => {
    const formData = new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "thesis")

  
    if(image !== null) {
      await axios.post("https://api.cloudinary.com/v1_1/djbyg5yx0/image/upload", formData)
      .then((response) => {
        setResult((prevFormData: any) => ({ ...prevFormData, image: response?.data?.url }))
        setImageUpdated(response?.data?.url)
      })
    }
  }

  useEffect(() => {
    if(result !== undefined) {
      updateResult(result?.resultId)
    }
  }, [imageUpdated])
  
  const handleResultChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target
    setResult((prevFormData: any) => ({ ...prevFormData, [name]: value }))
  }
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    createResult()
  }

  let emptyInputs = {
    pesel: '',
    patientFirstName: '',
    patientLastName: ''
};

  async function getResults() {
    myAxios.get("/result", { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((response) => {
        setResults(response.data)
      })
      .catch((err) => {
        console.error(err)
    })
  }

  async function getAllUsers() {
    myAxios.get("user", { 
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

  async function getAllClients() {
    myAxios.get("client/active", { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((response) => {
        setAllClients(response.data)
      })
      .catch((err) => {
        console.error(err)
    })
  }

  async function getResultById(id: any) {
    myAxios.get("/result/"+id, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((response) => {
        setResult(response.data)
      })
      .catch((err) => {
        console.error(err)
    })
  }

  const requestBodyCreate = {
    pesel: inputs?.pesel,
    patientFirstName: inputs?.patientFirstName,
    patientLastName: inputs?.patientLastName,
    userId: inputUser?.userId,
    clientId: inputClient?.clientId,
    signed: false,
    diagnosis: ""
  }

  async function createResult() {
    myAxios.post("/result", requestBodyCreate, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((response) => {
        toast.success("Result created")
        hideAddResultDialog()
        getResults()
        setInputs(emptyInputs)
        getResultById(response?.data?.resultId)
        showModifyResultDialog()
      })
      .catch((err) => {
        console.error(err)
        toast.error("Failed to crate result")
    })
  }

  useEffect(() => {
    getResults()
    getAllClients()
    getAllUsers()
  }, [])

  const assignedUserBodyTemplate = (rowData: { userId: any}) => {
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

  const toolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="Add result" style={{marginRight: "5px", height: "5vh", minHeight: "35px", width: "5vw", minWidth: "100px"}} onClick={showAddResultDialog}/>
        </React.Fragment>
    )
  }

  const hideAddResultDialog = () => {
    setAddResultDialog(false)
  }

  const showAddResultDialog = () => {
    setAddResultDialog(true)
  }

  const hideModifyResultDialog = () => {
    setModifyResultDialog(false)
    setEditingMode(false)
  }

  const showModifyResultDialog = () => {
    setModifyResultDialog(true)
  }

  function usersAssignedToClient() {
    let users = allUsers.filter(u => inputClient?.users?.includes(u.userId))
    users.forEach(u => u.fullName = (u.occupation + " " + u.firstName + " " + u.lastName))
    return users
  }

  const editBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
          <Button label="Edit" className="p-button-warning" style={{minHeight: "2rem", minWidth: "2rem"}} onClick={() => confirmModifyResult(rowData)} />
      </React.Fragment>
    );
  }

  const confirmModifyResult = (result: any) => {
    setSavedResult(result)
    setResult(result);
    showModifyResultDialog()
  } 

  useEffect(() => {
    setInputClient(result?.clientId)
    setInputUser(result?.userId)
  }, [result])

  function resultClientToString() {
    return result?.cliendId?.clientName !== undefined ? result?.cliendId?.clientName : ""
  }

  function resultAssignedUserToStrign() {
    return result?.userId !== null ? result?.userId?.occupation + " " + result?.userId?.firstName + " " + result?.userId?.lastName : ""
  }

  const discardChanges = () => {
    setResult(savedResult)
    setEditingMode(false)
  }

  function setPriority() {
    if(cito)
      return "cito"
    if(dilo)
      return "dilo"
  }

  const requestBodyUpdate = {
    pesel: result?.pesel,
    patientFirstName: result?.patientFirstName,
    patientLastName: result?.patientLastName,
    userId: result?.userId?.userId,
    clientId: result?.clientId?.clientId,
    signed: result?.signed,
    diagnosis: result?.diagnosis,
    image: result?.image,
    priority: setPriority()
  }

  async function updateResult(id: any){
    await myAxios.put("/result/"+id, requestBodyUpdate, { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((response) => {
        toast.success("Result updated")
        getResults()
        setSavedResult(result)
      })
      .catch((err) => {
        console.error(err)
        setResult(savedResult)
        toast.error("Failed to update result")
    })
  }

  async function signResult(id: any){
    const loadingToast = toast.loading("Sending notification")
    await myAxios.post("/result/"+id+"/sign", { 
      headers: {
        'Authorization': "Bearer " + auth?.token
      }})
      .then((response) => {
        toast.dismiss(loadingToast)
        toast.success("Result signed!")
        setResult((prev: any) => ({ ...prev, signed: true }))
        getResults()
      })
      .catch((err) => {
        toast.dismiss(loadingToast)
        console.error(err)
        toast.error("Failed to sign result")
    })
  }

  const saveChanges = async () => {
    setEditingMode(false)
    await uploadToCloudinary()
    await updateResult(result?.resultId)
    setImage(null)
  }

  const viewFullImage = (image: React.SetStateAction<string>) => {
    setFullImage(image)
    setShowFullImage(true)
  };
  
  const hideFullImage = () => {
    setShowFullImage(false)
  };

  const handleCitoChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
    setCito(e.target.checked)
    if(e.target.checked === true || dilo === true) {
      setDilo(false)
    }
  }

  const handleDiloChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
    setDilo(e.target.checked)
    if(e.target.checked === true || cito === true) {
      setCito(false)
    }
  }

  return (
    <div>
        <Topbar />
        <div className='laboratory-wrapper'>
          <Toolbar className="mb-4" left={toolbarTemplate}></Toolbar>
          <DataTable className="data-table" 
          value={results} 
          showGridlines 
          paginator rows={17} 
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
              <Column field="signed" header="Signed" sortable filter/>
              <Column style={{width: "6rem"}} field="priority" header="Priority" sortable filter/>
              <Column body={editBodyTemplate} exportable={false} />
          </DataTable>
          <Dialog resizable={false} visible={addResultDialog} style={{ width: '40vw', height: "70vh"}} header="Add Result" modal onHide={hideAddResultDialog}>
              <div className='add-result-container'>
                <form onSubmit={handleSubmit}>
                      <label>PESEL*: </label>
                      <InputMask 
                          type="text"
                          name="pesel"
                          value={inputs.pesel}
                          onChange={handleChange}
                          mask="99999999999"
                      />

                      <label>First Name: </label>
                      <input 
                          type="text"
                          name="patientFirstName"
                          value={inputs.patientFirstName}
                          onChange={handleChange}
                      />

                      <label>Last Name: </label>
                      <input 
                          type="text"
                          name="patientLastName"
                          value={inputs.patientLastName}
                          onChange={handleChange}
                      />

                      <label>Client: </label>
                      <Dropdown
                        style={{width: "calc(100% - 20px)", height: "5vh"}}
                        value={inputClient}
                        options={allClients}
                        optionLabel="clientName"
                        filter
                        onChange={(e) => setInputClient(e.value)}
                      />

                      <label>Assigned user: </label>
                      <Dropdown 
                        style={{width: "calc(100% - 20px)", height: "5vh"}}
                        value={inputUser}
                        options={usersAssignedToClient()}
                        optionLabel={"fullName"}
                        filter
                        onChange={(e) => setInputUser(e.value)}
                      />
                    <button type="submit" onClick={handleSubmit}>Create result</button>
                </form>
              </div>
          </Dialog>
          <Dialog resizable={false} visible={modifyResultDialog} style={{ width: '90vw', height: "77vh"}} header="Modify result" modal onHide={hideModifyResultDialog}>
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
                  <InputMask 
                      disabled={!editingMode}
                      type="text"
                      name="pesel"
                      value={result?.pesel}
                      onChange={handleResultChange}
                      mask="99999999999"
                  />

                  <label>First Name: </label>
                  <input 
                      disabled={!editingMode}
                      type="text"
                      name="patientFirstName"
                      value={result?.patientFirstName}
                      onChange={handleResultChange}
                  />

                  <label>Last Name: </label>
                  <input 
                      disabled={!editingMode}
                      type="text"
                      name="patientLastName"
                      value={result?.patientLastName}
                      onChange={handleResultChange}
                  />

                  <label>Client: </label>
                  <Dropdown
                    disabled={!editingMode}
                    style={{width: "calc(100% - 20px)", height: "5vh"}}
                    value={result?.clientId}
                    options={allClients}
                    optionLabel="clientName"
                    placeholder={resultClientToString()}
                    filter
                    onChange={(e) => {setResult((prev: any) => ({ ...prev, clientId: e.value })); setResult((prev: any) => ({ ...prev, userId: null }))}}
                    
                  />

                  <label>Assigned user: </label>
                  <Dropdown 
                    disabled={!editingMode}
                    style={{width: "calc(100% - 20px)", height: "5vh"}}
                    value={result?.userId}
                    options={usersAssignedToClient()}
                    optionLabel={"fullName"}
                    placeholder={resultAssignedUserToStrign()}
                    filter
                    onChange={(e) => setResult((prev: any) => ({ ...prev, userId: e.value }))}
                  />
                </form>
                <div className='diagnosis-container'>
                  <label>
                    Diagnosis
                    <textarea
                      disabled={!editingMode}
                      value={result?.diagnosis}
                      onChange={(e) => setResult((prev: any) => ({ ...prev, diagnosis: e.target.value }))}
                    />
                  </label>
                  <div>
                    <label>CITO:</label>
                    <input
                        disabled={!editingMode}
                        type="checkbox"
                        name="CITO"
                        checked={cito}
                        onChange={handleCitoChange}
                    />
                    <label>DILO:</label>
                    <input
                        disabled={!editingMode}
                        type="checkbox"
                        name="DILO"
                        checked={dilo}
                        onChange={handleDiloChange}
                    />
                  </div>
                  <div>
                    {result?.image === null ?
                    <input disabled={!editingMode} type="file" accept='image/*' onChange={e => handleImageChange(e)}/>
                    :
                    <input disabled={!editingMode} type="reset" onClick={() => {setImage(null); setResult((prev: any) => ({ ...prev, image: null }))}} />}
                    <div className='img-holder'>
                      <img onClick={() => viewFullImage(result?.image)} src={result?.image} />
                    </div>
                    <Dialog visible={showFullImage} onHide={hideFullImage} className='full-image-dialog'>
                      <img src={fullImage}/>
                    </Dialog>
                  </div>
                </div>
              </div>
              {!result?.signed ?
                <div className='buttons-wrapper'>
                  {!editingMode ?
                  <div>
                    <button type='button' className='edit-button' onClick={() => setEditingMode(true)}> Edit</button>
                    {(auth?.signResults && !result?.signed) ? 
                    <button type='button' className='sign-button' onClick={() => signResult(result?.resultId)}> Sign Result</button>
                    :
                    null}
                  </div> 
                  : 
                  <div>
                    <button type='button' className='discard-button' onClick={discardChanges}> Discard</button>
                    <button type='button' onClick={saveChanges}> Save</button>  
                  </div>}
                </div>
                :
                <div className='buttons-wrapper' style={{fontSize: "20px", color: "var(--color-primary)"}}>Result signed <TiTickOutline /></div>}
          </Dialog> 
        </div>
        <div><Toaster position='bottom-center' reverseOrder={false} containerStyle={{bottom: 50}}/></div>
    </div>
  )
}

export default PanelLab