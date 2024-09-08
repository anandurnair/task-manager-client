import React from 'react'
import Navbar from '../components/navbar';
import SignupForm from '../components/forms/signupForm';
const Signup = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center ">
    <Navbar />
    <div className="md:w-5/12 h-screen flex flex-col p-5 md:p-10 gap-4  ">
      <h2 className="text-3xl text-blue-500 font-bold text-left">Signup</h2>
      <SignupForm/>
    </div>
  </div>
  )
}

export default Signup
