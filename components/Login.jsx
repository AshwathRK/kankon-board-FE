import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../src/App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';



export default function Login() {

    const { setUserData, setIsAuthenticated } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverUrl] = useState('http://localhost:3000/api');
    const navigate = useNavigate();
    const [notification, setNotify] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                serverUrl,
                { email, password },
                { withCredentials: true }
            );

            setIsAuthenticated(true);
            setUserData(response.data);
            toast.success("Login successful!"); // ✅ Show toast here
            navigate('/user');

        } catch (error) {
            if (error.response) {
                console.error("Login failed:", error.response.data);
                toast.error(error.response.data.message || "Login failed"); // ✅ Error toast
            } else {
                console.error("Request error:", error.message);
                toast.error("Network error"); // ✅ Error toast
            }
        }

        setEmail('');
        setPassword('');
    };



    return (
        <div className='loginPage w-full h-206 flex justify-center items-center loginbackgroundcolor'>
            <div className='loginPageForm w-340 h-180 bg-blue-100 flex rounded'>
                <div className='w-2/5 flex justify-center items-center border-r-1 border-gray-300'>
                    <form className='loginForm flex flex-col justify-between h-80' onSubmit={handleSubmit}>
                        <h1 className='font-bold text-4xl'>Login</h1>
                        <h2 className='font-bold text-lg text-gray-500'>Doesn't have an account yet?
                            <Link to={'./signup'}>
                                <a className='text-blue-500 px-2' href="">Sign Up</a>
                            </Link>
                        </h2>
                        <div className='flex flex-col'>
                            <label>Email Address:</label>
                            <input
                                className='border rounded px-2 py-1'
                                type="email"
                                placeholder='you@example.com'
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
                        <Link to={'./resetpassword'}>
                        <a className='text-blue-500' href="">Forget password</a>
                        </Link>
                        <button type="submit" className='loginbackgroundcolor text-white h-8 font-bold rounded hover:opacity-80 active:opacity-60 '>
                            Login
                        </button>

                    </form>
                </div>
                <div className='w-3/5 flex justify-center items-center'>
                    <img src="public\Login_Logo.png" className="w-180" alt="login logo" />
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
