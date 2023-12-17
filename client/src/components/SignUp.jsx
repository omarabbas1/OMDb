import '../styles/signup.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [signupData, SetSignupData] = useState({
        name: '',
        email: '',
        password: '',
        retypepassword: ''
    });
    const [ErrorData, SetErrorData] = useState({
        name: false, email: false, password: false, password_match: false
    });
    const [emailExists, SetEmailExists] = useState(false);
    const IsValidName = () => {
        const regexName = new RegExp("^[a-zA-Z]+([-\\s][a-zA-Z]+)*$");
        return regexName.test(signupData.name);

    }
    const IsValidEmail = () => {
        const regexEmail = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        return regexEmail.test(signupData.email);
    }

    const IsValidPassword = () => {
        const regexPassword = new RegExp("^.{8,}$");
        return regexPassword.test(signupData.password);
    }

    const PasswordsMatch = () => {
        return signupData.password === signupData.retypepassword;
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        SetSignupData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleCreation = async (e) => {
        e.preventDefault();
        if (!IsValidName()) {
            SetErrorData({
                name: true, email: false, password: false, password_match: false
            })
            return;
        }
        else if (!IsValidEmail()) {
            SetEmailExists(false);
            SetErrorData({
                name: false, email: true, password: false, password_match: false
            })
            return;
        }
        else if (!IsValidPassword()) {
            SetEmailExists(false);
            SetErrorData({
                name: false, email: false, password: true, password_match: false
            })
            return;
        }
        else if (!PasswordsMatch()) {
            SetEmailExists(false);
            SetErrorData({
                name: false, email: false, password: false, password_match: true
            })
            return;
        }
        else {
            SetEmailExists(false);
            SetErrorData({
                name: false, email: false, password: false, password_match: false
            })
        }
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData)
            })
            const data = await response.json();

            if (data === 'email already exists') {
                SetEmailExists(true);
            }
            else if (data === 'user created') {
                SetEmailExists(false);
                console.log('success');
                navigate('/registration');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="signup">
            <Link to='/'><button>IMDb</button></Link>
            {ErrorData.name && <p className='error'>Please enter a valid name</p>}
            {ErrorData.email && <p className='error'>Please enter a valid email </p>}
            {ErrorData.password && <p className='error'>Please enter a more secure password</p>}
            {ErrorData.password_match && <p className='error'>Please make sure passwords match</p>}
            {emailExists && <p className='error'>User with this email already exists</p>}
            <div className='signup-container'>
                <form onSubmit={handleCreation}>
                    <h1>Create an account</h1>
                    <div className='signup-div'>
                        <label>Your name <br />
                            <input type="text"
                                name='name'
                                value={signupData.name}
                                onChange={handleOnChange}
                                placeholder="First and last name" /></label>
                    </div>
                    <div className='signup-div'>
                        <label>Email <br />
                            <input type="text"
                                name='email'
                                value={signupData.email}
                                onChange={handleOnChange}
                            /></label>

                    </div>
                    <div className='signup-div'>
                        <label>Password <br />
                            <input type="password"
                                name='password'
                                value={signupData.password}
                                onChange={handleOnChange}
                            /></label>

                    </div>
                    <div className='signup-div'>
                        <label>Re-enter Password<br />
                            <input type="password"
                                name='retypepassword'
                                value={signupData.retypepassword}
                                onChange={handleOnChange}
                            /></label>
                    </div>

                    <div className='createacc-div'>
                        <button>Create your IMDb account</button>
                    </div>
                    <div className='signup-div'>
                        <p>Already have an account? <Link to='/signin'>Sign In</Link></p>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default SignUp;