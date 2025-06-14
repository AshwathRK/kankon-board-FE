import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [serverUrl] = useState('https://password-reset-qx8n.onrender.com/api');
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [password, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // start loader
        try {
            await axios.post(`${serverUrl}/sendresetotp`, { email });
            toast.success('OTP sent to your email');
            setIsEmailSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false); // stop loader
        }
    };


    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${serverUrl}/verifyotp`, { email, otp });
            if (response.status === 200) {
                toast.success('OTP verified');
                setStep(2);
            } else {
                toast.error('Invalid OTP');
            }
        } catch (error) {
            toast.error('Failed to verify OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${serverUrl}/resetpassword`, {
                email,
                password,
                confirmPassword
            });

            // Show backend message in success toast
            toast.success(response.data.msg);
            setTimeout(function () {
                navigate('/');
            }, 3500);
        } catch (error) {
            // Show backend message in error toast, if available
            const errMsg = error.response?.data?.msg || 'Failed to reset password';
            toast.error(errMsg);
        }
    };


    return (
        <div className='w-full h-screen flex justify-center items-center loginbackgroundcolor loginPage'>
            <div className='w-340 h-180 loginPageForm flex rounded'>
                <div className='w-2/5 flex justify-center items-center border-r-1 border-gray-400'>
                    <form className='flex flex-col justify-around h-70 w-100' onSubmit={(step === 1 && !isEmailSent) ? handleEmailSubmit : (step === 1 ? handleOtpSubmit : handleResetPassword)}>
                        <h1 className='font-bold text-4xl'>Reset Password</h1>
                        <h2 className='font-bold text-lg text-gray-500'>
                            Go back to
                            <Link to={'/'}><span className='text-blue-500 px-2'>Login</span></Link>
                        </h2>

                        {step === 1 && (
                            <>
                                <label className='font-bold'>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isEmailSent}
                                    className='border rounded px-2 py-1'
                                    required
                                />

                                {isEmailSent && (
                                    <>
                                        <label>Enter OTP</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d{0,6}$/.test(val)) setOtp(val);
                                            }}
                                            maxLength={6}
                                            className='border rounded px-2 py-1'
                                            required
                                        />
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className={`mt-4 loginbackgroundcolor text-white h-8 font-bold rounded hover:opacity-80 active:opacity-60 flex justify-center items-center ${isEmailSent && otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    disabled={(isEmailSent && otp.length !== 6) || isLoading}
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                                        </svg>
                                    ) : (
                                        isEmailSent ? 'Verify OTP' : 'Send OTP'
                                    )}
                                </button>

                            </>
                        )}

                        {step === 2 && (
                            <>
                                <label>New Password</label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className='border rounded px-2 py-1 w-full pr-10'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-sm'
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>

                                <label>Confirm Password</label>
                                <div className='relative'>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className='border rounded px-2 py-1 w-full pr-10'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-sm'
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>

                                <button
                                    type='submit'
                                    className='mt-4 loginbackgroundcolor text-white h-8 font-bold rounded hover:opacity-80 active:opacity-60'
                                >
                                    Reset Password
                                </button>
                            </>
                        )}
                    </form>
                </div>

                <div className='w-3/5 flex justify-center items-center'>
                    <img src="/Password_reset.png" className="w-180" alt="logo" />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
