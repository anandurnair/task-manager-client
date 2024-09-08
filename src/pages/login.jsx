import React from "react";
import Navbar from "../components/navbar";
import LoginForm from "../components/forms/loginForm";
const Login = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center ">
      <Navbar />
      <div className="md:w-5/12 h-screen flex flex-col p-5 md:p-10 gap-4  ">
        <h2 className="text-3xl text-blue-500 font-bold text-left">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
