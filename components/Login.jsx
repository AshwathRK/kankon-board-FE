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
            toast.success("Login successful!");
            navigate('/user');
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Login failed");
            } else {
                toast.error("Network error");
            }
        }

        setEmail('');
        setPassword('');
    };

    return (
        <div className='loginPage w-full flex justify-center items-center bg-gray-200'>
            <div className='loginPageForm mx-4 w-340 bg-blue-100 grid rounded-xl'>
                <div className='flex login px-5 justify-center items-center border-r-1 border-gray-300'>
                    <form className='loginForm flex flex-col justify-between h-102' onSubmit={handleSubmit}>
                        <div>
                            <h1 className='font-bold text-4xl poppins-extrabold primery'>Welcome back</h1>
                            <h4 className='font-bold text-xl poppins-bold'>Login to your account</h4>
                        </div>
                        <h2 className='font-bold fs-5 text-gray-400 poppins-semibold'>Doesn't have an account yet?
                            <Link to={'/signup'} className="text-blue-500 px-2 poppins-bold">
                                Sign Up
                            </Link>
                        </h2>
                        <div className='flex flex-col'>
                            <label className='poppins-regular'>Email Address:</label>
                            <input
                                className='border rounded px-2 py-1 poppins-regular'
                                type="email"
                                placeholder='you@example.com'
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                            />
                        </div>
                        <div className='flex flex-col relative'>
                            <label className='poppins-regular'>Password:</label>
                            <input
                                className='border rounded px-2 py-1 poppins-regular'
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
                        <Link to="/resetpassword" className="text-blue-500 poppins-semibold">
                            Forget password
                        </Link>

                        <button type="submit" className='loginbackgroundcolor text-white h-8 font-bold rounded hover:opacity-80 active:opacity-60 poppins-semibold'>
                            Login
                        </button>

                    </form>
                </div>
                <div className='flex flex-col loginImage justify-center items-center rounded-r-xl'>

                    <h1 className='font-bold text-4xl poppins-extrabold text-white'>Kanban Flow</h1>
                    <img src="/Login_Logo.png" className="w-180 image" alt="login logo" />
                    <h4 className='font-bold text-xl poppins-bold text-white'>Organize your work. Stay productive.</h4>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

