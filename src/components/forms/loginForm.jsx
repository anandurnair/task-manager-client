import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, { email, password });
      
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
     
    } catch (error) {
      console.log(error);
      
      toast.error(`Error logging in: ${error.response?.data?.message || error.message}`);
    }
    setEmail("");
    setPassword("");
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUser(tokenResponse);
      console.log(tokenResponse);
    },
    onError: (error) => toast.error(`Google login failed: ${error.message}`)
  });

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("res.data",res.data);
          setProfile(res.data);
          const data ={
            firstName : res.data.given_name,
            lastName : res.data.family_name,
            email : res.data.email,
            password : res.data.id,
            type : "google"
          }

          axios.post(`${process.env.REACT_APP_BASE_URL}/login`, data).then((res) => {
            
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/home");

          }).catch((err) =>{
            console.log(err)
            toast.error(`Error logging in: ${err.response?.data?.message || err.message}`);
          } );
        })
        .catch((err) => console.log(err));
    }
  }, [user, navigate]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    toast.info("Logged out from Google.");
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-full border-4 rounded-lg border-blue-500 px-3 py-5 md:px-7 md:py-10 flex flex-col gap-3 items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 h-10 border-2 border-gray-400"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 h-10 border-2 border-gray-400"
          required
        />
        <button type="submit" className="px-6 h-10 w-full bg-blue-500 text-white font-semibold">
          Login
        </button>

        <p className="font-semibold">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600">
            Signup
          </a>
        </p>

        
          <button
            type="button"
            className="px-4 h-10 bg-blue-500 flex justify-center items-center text-white font-semibold rounded-md"
            onClick={() => loginWithGoogle()}
          >
            Login with Google
          </button>
       
      </form>
    </>
  );
};

export default LoginForm;
