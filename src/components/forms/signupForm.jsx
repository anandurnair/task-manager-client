import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Form validation logic
  const validateForm = () => {
    let formErrors = {};

    // Validate first name
    if (!firstName) {
      formErrors.firstName = "First name is required";
    }

    // Validate last name
    if (!lastName) {
      formErrors.lastName = "Last name is required";
    }

    // Validate email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !emailRegex.test(email)) {
      formErrors.email = "Please enter a valid email address";
    }

    // Validate password
    if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long";
    }

    // Validate confirm password
    if (confirmPassword !== password) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    return formErrors;
  };

  // Handle normal form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, { firstName, lastName, email, password });
      if (res.status === 201 && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/home');
      }
    } catch (error) {
      toast.error(`Error signing up: ${error.response?.data?.message || error.message}`);
    }

    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  // Handle Google signup
  const signupWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUser(tokenResponse);
    },
    onError: (error) => toast.error(`Google signup failed: ${error.message}`)
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
          setProfile(res.data);
          const data = {
            firstName: res.data.given_name,
            lastName: res.data.family_name || "",
            email: res.data.email,
            password: res.data.id, // You may want to handle password differently
            type: "google"
          };

          axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, data).then((res) => {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/home");
          }).catch((err) => {
            toast.error(`Error signing up: ${err.response?.data?.message || err.message}`);
          });
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
        {/* Normal Signup Form */}
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className={`w-full p-2 h-10 border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-400'}`}
          required
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className={`w-full p-2 h-10 border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-400'}`}
          required
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={`w-full p-2 h-10 border-2 ${errors.email ? 'border-red-500' : 'border-gray-400'}`}
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={`w-full p-2 h-10 border-2 ${errors.password ? 'border-red-500' : 'border-gray-400'}`}
          required
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className={`w-full p-2 h-10 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-400'}`}
          required
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

        <button type="submit" className="px-6 h-10 w-full bg-blue-500 text-white font-semibold">
          Signup
        </button>

        <p className="font-semibold">
          Already have an account?{" "}
          <a href="/" className="text-blue-600">
            Login
          </a>
        </p>

      
          <button
            type="button"
            className="px-4 h-10 bg-blue-500 flex justify-center items-center text-white font-semibold rounded-md"
            onClick={() => signupWithGoogle()}
          >
            Signup with Google
          </button>
       
      </form>
    </>
  );
};

export default SignupForm;
