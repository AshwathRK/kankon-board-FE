import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export default function Signup() {
    const [serverUrl] = useState('http://localhost:3000/api');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phonenumber: '',
        password: '',
        confirmpassword: '',
        securityQuestion: '',
        securityAnswer: '',
        dateofbirth: '',
        gender: '',
        streetaddress: '',
        city: '',
        State: '',
        Postal: '',
        Country: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const next = () => setStep((prev) => prev + 1);
    const prev = () => setStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['fullname', 'email', 'password', 'confirmpassword', 'securityQuestion', 'securityAnswer'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field} is required`);
                return;
            }
        }

        if (formData.password !== formData.confirmpassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${serverUrl}/signup`,
                formData,
                { withCredentials: true }
            );

            toast.success("Account created successfully. Please log in.");

            setTimeout(function () {
                navigate('/');
            }, 3000);
            setFormData({
                fullname: '',
                email: '',
                phonenumber: '',
                password: '',
                confirmpassword: '',
                securityQuestion: '',
                securityAnswer: '',
                dateofbirth: '',
                gender: '',
                streetaddress: '',
                city: '',
                State: '',
                Postal: '',
                Country: ''
            });
        } catch (error) {
            if (error.response) {
                const msg = error.response.data.message || "Sign-up failed";
                toast.error(msg);
            } else {
                toast.error("Network error or server unavailable");
            }
        }
    };

    return (
        <div className='loginPage w-full h-206 flex justify-center items-center loginbackgroundcolor'>
            <div className='loginPageForm w-340 h-180 bg-blue-100 flex rounded'>
                <div className='w-2/5 flex justify-center items-center border-r-1 border-gray-300'>
                    <form className='loginForm flex flex-col h-130 w-100' onSubmit={handleSubmit}>
                        <h1 className='font-bold text-4xl'>Sign Up</h1>
                        <h2 className='font-bold text-lg text-gray-500'>
                            Already have an account?
                            <Link to={'/'}><span className='text-blue-500 px-2'>Login</span></Link>
                        </h2>

                        {step === 1 && (
                            <div className='flex flex-col justify-between h-100'>
                                <h1 className='font-bold'>Step 1: Personal Info</h1>
                                <label>Full Name *</label>
                                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>Password *</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className='border rounded px-2 py-1 w-full pr-10' />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">{showPassword ? "🙈" : "👁️"}</button>
                                </div>

                                <label>Confirm Password *</label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmpassword" value={formData.confirmpassword} onChange={handleChange} className='border rounded px-2 py-1 w-full pr-10' />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">{showConfirmPassword ? "🙈" : "👁️"}</button>
                                </div>

                                <button type="button" onClick={next} className='mt-4 loginbackgroundcolor text-white h-8 font-bold rounded hover:opacity-80 active:opacity-60'>Next</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className='flex flex-col'>
                                <h1 className='font-bold'>Step 2: Security Info</h1>

                                <label>Security Question *</label>
                                <input type="text" name="securityQuestion" value={formData.securityQuestion} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>Security Answer *</label>
                                <input type="text" name="securityAnswer" value={formData.securityAnswer} onChange={handleChange} className='border rounded px-2 py-1' />

                                <div className='flex gap-2 mt-4'>
                                    <button type="button" onClick={prev} className='text-white bg-gray-500 h-8 px-4 w-20 rounded'>Back</button>
                                    <button type="button" onClick={next} className='loginbackgroundcolor text-white h-8 w-20 font-bold rounded hover:opacity-80 active:opacity-60'>Next</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className='flex flex-col'>
                                <h1 className='font-bold'>Step 3: Contact Info</h1>

                                <label>Phone Number:</label>
                                <input type="text" name="phonenumber" value={formData.phonenumber} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>Date of Birth:</label>
                                <input type="date" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>Gender:</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className='border rounded px-2 py-1'>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>

                                <label>Street Address:</label>
                                <input type="text" name="streetaddress" value={formData.streetaddress} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>City:</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>State:</label>
                                <input type="text" name="State" value={formData.State} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>Postal Code:</label>
                                <input type="text" name="Postal" value={formData.Postal} onChange={handleChange} className='border rounded px-2 py-1' />

                                <label>Country:</label>
                                <input type="text" name="Country" value={formData.Country} onChange={handleChange} className='border rounded px-2 py-1' />

                                <div className='flex gap-2 mt-4'>
                                    <button type="button" onClick={prev} className='text-white bg-gray-500 h-8 w-20 px-4 rounded'>Back</button>
                                    <button type="submit" className='loginbackgroundcolor text-white h-8 w-20 font-bold rounded hover:opacity-80 active:opacity-60'>Submit</button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className='w-3/5 flex justify-center items-center'>
                    <img src="public/signup.png" className="w-180" alt="login logo" />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
