import React, { useState, useContext } from 'react';
import { UserCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../src/App'; // Adjust path as needed

export default function UserDetails(props) {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserData } = useContext(AppContext);

    const originalUser = props.UserDetails?.user;
    const [user, setUser] = useState(originalUser);
    const [editing, setEditing] = useState(false);
    const serverUrl = 'http://localhost:3000/api';

    if (!user) {
        return (
            <div className="text-center mt-10 text-red-600 font-semibold">
                User data not available.
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // TODO: Call your update user API here
        toast.success('Changes saved!');
        setEditing(false);
    };

    const handleCancel = () => {
        setUser(originalUser);
        setEditing(false);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${serverUrl}/logout`, {
                withCredentials: true,
            });

            if (response.data.message) {
                toast.success(response.data.message, {
                    onClose: () => {
                        setIsAuthenticated(false);
                        setUserData(null);
                        navigate('/');
                    },
                    autoClose: 2000, // Optional: set how long the toast shows
                });
            }
        } catch (error) {
            toast.error('Logout failed');
            console.error(error);
        }
    };


    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
            <div className="flex flex-col items-center mb-8">
                <UserCircle className="w-20 h-20 text-blue-500 mb-2" />
                <h1 className="text-2xl font-semibold text-gray-800">{user.fullname}</h1>
                <p className="text-gray-500">{user.email}</p>

                <button
                    onClick={handleLogout}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
                {renderInput('Full Name', 'fullname', user.fullname, editing, handleChange)}
                {renderInput('Phone Number', 'phonenumber', user.phonenumber, editing, handleChange)}
                {renderInput('Date of Birth', 'dateofbirth', user.dateofbirth, editing, handleChange)}
                {renderInput('Gender', 'gender', user.gender, editing, handleChange)}
                {renderInput('Street Address', 'streetaddress', user.streetaddress, editing, handleChange)}
                {renderInput('City', 'city', user.city, editing, handleChange)}
                {renderInput('State', 'State', user.State, editing, handleChange)}
                {renderInput('Postal Code', 'Postal', user.Postal, editing, handleChange)}
                {renderInput('Country', 'Country', user.Country, editing, handleChange)}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>

            <ToastContainer />
        </div>
    );
}

function renderInput(label, name, value, editing, handleChange) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            {editing ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:border-blue-400"
                />
            ) : (
                <p className="mt-1 text-base font-medium text-gray-800">{value || '—'}</p>
            )}
        </div>
    );
}
