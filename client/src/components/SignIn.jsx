import '../styles/signin.css'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signin = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [signInInfo, setSignInInfo] = useState({
        email: '',
        password: '',
        rememberMe: false,
    })
    const [ErrorData, SetErrorData] = useState({ email: false, password: false });
    const [emailNotFound, SetEmailNotFound] = useState(false);
    const [incorrectpassword, SetIncorrectPassword] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setSignInInfo(prevState => ({
            ...prevState,
            [name]: value
        }
        ))
    }
    const handleCheckOnChange = (e) => {
        const { name, checked } = e.target;
        setSignInInfo(prevState => ({
            ...prevState,
            [name]: checked
        }
        ))
    }

    const IsValidEmail = () => {
        const regexEmail = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        return regexEmail.test(signInInfo.email);
    }
    const IsValidPassword = () => {
        const regexPassword = new RegExp("^.{8,}$");
        return regexPassword.test(signInInfo.password);
    }
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!IsValidEmail()) {
            SetEmailNotFound(false);
            SetIncorrectPassword(false);
            SetErrorData({
                email: true, password: false
            })
            return;
        }
        else if (!IsValidPassword()) {
            SetEmailNotFound(false);
            SetIncorrectPassword(false);
            SetErrorData({
                email: false, password: true
            })
            return;
        }
        else {
            SetEmailNotFound(false);
            SetIncorrectPassword(false);
            SetErrorData({
                email: false, password: false
            })
        }
        try {
            const response = await fetch('http://localhost:5000/signin', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signInInfo)
            })
            const data = await response.json();
            // console.log(data);
            switch (data) {
                case 'email not found':
                    SetEmailNotFound(true);
                    SetIncorrectPassword(false);
                    break;
                case 'password incorrect':
                    SetEmailNotFound(false);
                    SetIncorrectPassword(true);
                    break;
                default:
                    SetEmailNotFound(false);
                    SetIncorrectPassword(false);
                    console.log('access granted');
                    window.localStorage.setItem('token', data.accessToken);
                    // const response1 = await fetch('http://localhost:5000/token', {
                    //     headers: {
                    //         Authorization: `Bearer ${window.localStorage.getItem('token')}`
                    //     }
                    // });
                    // const data1 = await response1.json();
                    setUser(data.userPayload);
                    navigate('/');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="signin">
            <Link to='/'><button>IMDb</button></Link>
            {ErrorData.email && <p className='error'>Please enter a valid email format</p>}
            {ErrorData.password && <p className='error'>Please enter a valid password</p>}
            {emailNotFound && <p className='error'>No user with such email please create an account</p>}
            {incorrectpassword && <p className='error'>Incorrect password, please try again</p>}
            <div className='signin-container'>
                <form onSubmit={handleSignIn}>
                    <h1>Sign In</h1>
                    <div className='signin-div'>
                        <label>Email <br />
                            <input type="text"
                                name='email'
                                value={signInInfo.email}
                                onChange={handleOnChange}
                            /></label>

                    </div>
                    <div className='signin-div'>
                        <label>Password <br />
                            <input type="password"
                                name='password'
                                value={signInInfo.password}
                                onChange={handleOnChange}
                            /></label>
                    </div>
                    <div className='signin-div'>
                        <button>Sign In</button>
                    </div>
                    <input type="checkbox" name="rememberMe" checked={signInInfo.rememberMe} onChange={handleCheckOnChange} />&nbsp;
                    <span htmlFor="rememberMe">Remember me</span>
                    <div className='signin-div'>
                        <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signin;