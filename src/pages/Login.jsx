import React, { useState } from 'react';
import { Button ,TextField } from '../ui-components';
import { loginApi } from '../api/auth.api';
import { useAuth } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {

  const [userid,setUserid] = useState("")
  const [password,setPassword] = useState("")
  const {setAuth} = useAuth()
  const navigate = useNavigate()
  function handleLogin(){
    loginApi({userid,password}).then((resp)=>{
      setAuth(resp?.data)
      localStorage.setItem("token",true)
      navigate("/")
    })
    
  }

  // console.log(userid,password)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md space-y-5">
        

        <TextField placeholder="Enter User ID" label="User ID" onChange={(e) => setUserid(e.target.value)} />

        <TextField placeholder="Enter Password" label="Password" type="password" onChange={(e) => setPassword(e.target.value)}/>

        <Button className="w-full"  onClick={handleLogin}>Login</Button>
      </div>
    </div>
  );
}
