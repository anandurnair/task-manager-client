import React, { useEffect, useState } from 'react'
import { SiGoogledocs } from "react-icons/si";
import Button from './buttons/button'
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const [token,setToken] = useState(null)
  useEffect(() => {
    
    setToken(localStorage.getItem('token'))
    
  },[])
  const handleLogout = () => {
    alert('Are you sure you want to logout?')
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')
  }
  return (
    <div className='w-full flex justify-between items-center py-3 px-4 md:px-28 bg-blue-500'>
        <SiGoogledocs  color='white' size={30}/>
        {
          token ? <button
          type="button" 
          className="px-4 h-10 bg-white text-blue-500 flex justify-center items-center  font-semibold rounded-md"
          onClick={handleLogout}
        >Logout</button> : (
<div className='flex gap-3'>
      
      <Button className='ml-10 bg-white' value={'Login'}/>
      <Button className='ml-10 bg-white' value={'Signup'}/>
      </div>
          )
        }
        
        
    </div>
  )
}

export default Navbar
