import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUserDetails, clearUserDetails } from '../../src/slices/userslices';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { UserCircle } from 'lucide-react';

// Server URL
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UserDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userInfo = useSelector((state) => state.userDetails?.user);
    const [formData, setFormData] = useState(userInfo?userInfo:{});
    const [editing, setEditing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [fetched, setFetched] = useState(false);

    if (!userInfo) {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${serverUrl}/user`, {
                    withCredentials: true,
                });

                if (response.data?.status && response.data?.user) {
                    dispatch(addUserDetails(response.data.user));
                    setFormData(response.data.user);
                    setIsAuthenticated(true);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error("Error in fetchUserDetails:", error);
                toast.error("Session expired, please log in again");
                dispatch(clearUserDetails());
                localStorage.setItem('isAuthenticated', 'false');
                navigate('/login');
            }
        };

        if (!fetched) {
            fetchUserDetails();
        } else if (userInfo) {
            setFormData(userInfo);
        }
    }

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${serverUrl}/logout`, {
                withCredentials: true,
            });
    
            if (response.data.message) {
                toast.success(response.data.message, {
                    onClose: () => {
                        localStorage.removeItem('isAuthenticated');
                        setIsAuthenticated(false); // Update the isAuthenticated state
                        dispatch(clearUserDetails());
                        navigate('/login', { replace: true });
                        location.reload();
                    },
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.error('Logout failed');
            console.error(error);
        }
    };

    const handleSave = async () => {
    try {
        const response = await axios.patch(`${serverUrl}/user`, formData, {
            withCredentials: true,
        });

        if (response.data?.status) {
            dispatch(addUserDetails(response.data.user));
            setEditing(false);
            toast.success(response.data.message);
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error("Error in handleSave:", error);
        toast.error("Failed to update user details");
    }
};

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setFormData(userInfo);
        setEditing(false);
    };

    const renderInput = (label, name, value, editable, onChange) => (
        <div className="mb-3 col-md-6">
            <label className="form-label">{label}</label>
            <input
                type="text"
                name={name}
                className="form-control"
                value={value || ''}
                onChange={onChange}
                disabled={!editable}
            />
        </div>
    );

    if (!userInfo) {
        return (
            <div className="text-center mt-5 text-secondary fw-semibold">
                Loading user data...
            </div>
        );
    }

    return (
        <div className="container-fluid userDetails">
            {/* NavBar Row */}
            <div className="bg-light p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="m-0">Welcome, {userInfo.fullname}</h4>
                    <div className="d-flex gap-2">
                        {!editing ? (
                            <button
                                className="btn btn-primary disabled"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    className="btn btn-success"
                                onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* User Details Card */}
            <div>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="text-center mb-4">
                            <UserCircle size={60} className="text-primary mb-2" />
                            <h5 className="card-title">{userInfo.fullname}</h5>
                            <p className="text-muted">{userInfo.email}</p>
                        </div>
                        <div className="row">
                            {renderInput('Full Name', 'fullname', formData.fullname, editing, handleChange)}
                            {renderInput('Phone Number', 'phonenumber', formData.phonenumber, editing, handleChange)}
                            {renderInput('Date of Birth', 'dateofbirth', formData.dateofbirth, editing, handleChange)}
                            {renderInput('Gender', 'gender', formData.gender, editing, handleChange)}
                            {renderInput('Street Address', 'streetaddress', formData.streetaddress, editing, handleChange)}
                            {renderInput('City', 'city', formData.city, editing, handleChange)}
                            {renderInput('State', 'State', formData.State, editing, handleChange)}
                            {renderInput('Postal Code', 'Postal', formData.Postal, editing, handleChange)}
                            {renderInput('Country', 'Country', formData.Country, editing, handleChange)}
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
