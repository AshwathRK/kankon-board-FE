import { useEffect, useState } from 'react';
import axios from 'axios';
export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverUrl] = useState('http://localhost:3000/api');



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                serverUrl,
                { email, password },
                { withCredentials: true }
            );
            console.log("Login Success:", response.data);
        } catch (error) {
            if (error.response) {
                console.error("Login failed:", error.response.data);
            } else {
                console.error("Request error:", error.message);
            }
        }

        setEmail('');
        setPassword('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    )
}
