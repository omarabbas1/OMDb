import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const SucessAuth = ({ setUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                window.localStorage.setItem('token', token);
                const response = await fetch('http://localhost:5000/token', {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                // console.log(data);
                if (data !== 'token expired') {
                    const response_ = await fetch('http://localhost:5000/signup', {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: data.name, email: data.email })
                    })
                    const data_ = await response_.json();
                    console.log(data_);
                    setUser(data);
                    navigate('/');
                }
            }
            else {
                navigate('/registration');
            }
        }
        fetchUser();
    }, [])


    return (
        <div className="success-auht">

        </div>
    );
}

export default SucessAuth;