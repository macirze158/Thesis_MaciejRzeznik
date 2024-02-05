import React from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Panels from './Components/Panels/Panels';
import { Route, Routes } from 'react-router-dom';
import NotFoundPage from './Components/NotFountPage/NotFoundPage';
import RequireAuth from './Components/RequireAuth/RequireAuth';
import Unauthorized from './Components/Unauthorized/Unauthorized';
import PersistLogin from './Components/PersistLogin/PersistLogin';
import PanelAdmin from './Components/Panels/PanelAdmin';
import PanelUser from './Components/Panels/PanelUser';
import PanelLab from './Components/Panels/PanelLab';
import PanelClient from './Components/Panels/PanelClient';

function App() {
  return (
    <main className='App'>  
      <Routes>

        {/* Private*/}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRole={"user"}/>}>
            <Route path="/" element={<Panels />} />
            <Route path="/user" element={<PanelUser />} />
          </Route>
          <Route element={<RequireAuth allowedRole={"client"}/>}>
            <Route path="/client" element={<PanelClient />} />
          </Route>
          <Route element={<RequireAuth allowedRole={"lab"}/>}>
            <Route path="/laboratory" element={<PanelLab />} />
          </Route>
          <Route element={<RequireAuth allowedRole={"admin"}/>}>
            <Route path="/admin" element={<PanelAdmin />} />
          </Route>
        </Route>

        {/* Public*/}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Not Found routes*/}
        <Route path="/*" element={<NotFoundPage />}/>
        
      </Routes>
    </main>
  );
}

export default App;
