import { useEffect } from 'react';
import '../styles/registration.css';
import { redirect, useNavigate } from 'react-router-dom';
const Registration = ({ setUser }) => {
    const navigate = useNavigate();
    const handleSignInGoogle = () => {
        window.location.href = 'http://localhost:5000/auth/google'
    }
    const handleSignInFaceook = () => {
        window.location.href = 'http://localhost:5000/auth/facebook'
    }

    useEffect(() => {
        const UrlParams = new URLSearchParams(window.location.search);
        const error = UrlParams.get('error');
        if (error) {
            redirect('/registration');
        }
    }, [])
    return (
        <div className="registration">
            <div className="registration-container">
                <div className="left-div">
                    <h1>Sign in</h1>

                    <button onClick={() => navigate('/signin')}>
                        <div className="button-div">
                            <img src="https://cdn.icon-icons.com/icons2/70/PNG/512/imdb_14058.png" alt="" />
                            <span>Sign in with IMDb</span>
                        </div>
                    </button>
                    <button onClick={handleSignInGoogle}>
                        <div className="button-div">
                            <img src="https://th.bing.com/th/id/R.442ece698101a331b587a72c6e20f08c?rik=3v8OwUZGpzomlA&pid=ImgRaw&r=0" alt="" />
                            <span>Sign in with Google</span>
                        </div>
                    </button>
                    <button onClick={handleSignInFaceook}>
                        <div className="button-div">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png" alt="" />
                            <span>Sign in with Facebook</span>
                        </div>
                    </button>
                    <p class="divider-text"><span>or</span></p>
                    <button className="create-account" onClick={() => navigate('/signup')}>Create a New Account</button>
                    <p>By signing in, you agree to IMDb's Conditions of Use and Privacy Policy.</p>
                </div>
                <div className="right-div">
                    <h1>Benefits of your free IMDb account</h1>
                    <p>
                        <strong>Personalized Recommendations</strong><br />
                        Discover shows you'll love.
                    </p>
                    <p>
                        <strong>Your Watchlist </strong><br />
                        Track everything you want to watch and receive e-mail when movies open in theaters.
                    </p>
                    <p>
                        <strong>Your Ratings</strong><br />
                        Rate and remember everything you've seen.
                    </p>
                    <p>
                        <strong>Contribute to IMBb</strong><br />
                        Add data that will be seen by millions of people and get cool badges.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Registration;


