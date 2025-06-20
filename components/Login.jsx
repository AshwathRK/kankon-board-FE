import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../src/App';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { addUserDetails } from '../src/slices/userslices';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Login() {

    const { setIsAuthenticated } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [notification, setNotify] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch()

    // let email = "as@mailinator.com"
    // let password = 'Dindigul@123'
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                serverUrl,
                { email, password },
                { withCredentials: true }
            );

            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            dispatch(addUserDetails(response.data.user));
            // console.log(response.data.user)
            toast.success("Login successful!");
            navigate('/user');
        } catch (error) {
            if (error.response) {
                // console.log(error.response.data.message)
                toast.error(error.response.data.message || "Login failed");
            } else {
                toast.error("Network error");
                // console.log(error)
            }
        }

        setEmail('');
        setPassword('');
    };

     return (
        <div className='loginPage w-full flex justify-center items-center bg-gray-200'>
            <div className='loginPageForm mx-4 w-340 bg-blue-100 grid rounded'>
                <div className='flex login justify-center items-center border-r-1 border-gray-300'>
                    <form className='loginForm flex flex-col justify-between h-80' onSubmit={handleSubmit}>
                        <h1 className='font-bold text-4xl'>Login</h1>
                        <h2 className='font-bold text-lg text-gray-500'>Doesn't have an account yet?
                            <Link to={'/signup'} className="text-blue-500 px-2">
                                Sign Up
                            </Link>
                        </h2>
                        <div className='flex flex-col'>
                            <label>Email Address:</label>
                            <input
                                className='border rounded px-2 py-1'
                                type="email"
                                placeholder='you@example.com'
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                            />
                        </div>
                        <div className='flex flex-col relative'>
                            <label>Password:</label>
                            <input
                                className='border rounded px-2 py-1 font-italic'
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Enter 12 characters or more'
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 bottom-1 text-xl"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        <Link to="/resetpassword" className="text-blue-500">
                            Forget password
                        </Link>

                        <button type="submit" className='loginbackgroundcolor text-white h-8 font-bold rounded hover:opacity-80 active:opacity-60 '>
                            Login
                        </button>

                    </form>
                </div>
                <div className='flex loginImage justify-center items-center'>
                    <img src="/Login_Logo.png" className="w-180 image" alt="login logo" />
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

