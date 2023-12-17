import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Navbar = ({ user, setUser }) => {
    const [searchValue, SetSearchValue] = useState('');
    const navigate = useNavigate();
    const status = {
        found: false,
        src: ''
    }
    const [profilePic, setProfilePic] = useState(status);
    // const [selectedOption, SetSelectedOption] = useState('Profile');
    let name;
    // const user = JSON.parse(window.localStorage.getItem('token'));
    if (user) {
        name = user.name;
    }
    // const handleSearch = (e) => {
    //     if (e.key === 'Enter') {
    //         navigate(`/search?q=${searchValue}`);
    //     }
    // }
    const handleSelect = (e) => {
        const value = e.target.value;
        e.target.value = name;
        switch (value) {
            case 'view-profile':
                navigate('/profile');
                break;
            case 'sign-out':
                window.localStorage.clear();
                setUser(null);
                navigate('/');
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:5000/profile', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email })
            })
            const data = await response.json();
            const profile_pic = data.profile_pic;
            if (profile_pic !== '') {
                setProfilePic({
                    found: true,
                    src: profile_pic
                });
            }
            else {
                setProfilePic({
                    found: false,
                    src: ''
                });
            }
        }
        if (user) {
            fetchProfile();
        }
    }, [user])
    return (
        <div className="navbars">
            {!user && <nav className='navbar'>
                <div className="navbar-div1">

                    <Link to="/"><button className="imdb-button">OMDb</button></Link>
                </div>
                <div className="navbar-div2">
                    <input type="text" placeholder="Search OMDb" value={searchValue}
                    /*onChange={(e) => SetSearchValue(e.target.value)}*/
                    // onKeyDown={(e) => handleSearch(e)}
                    />
                </div>
                <div className="navbar-div3">
                    <Link to='/registration'><button>Watchlist</button></Link>
                    <Link to="/registration"><button>Sign In</button></Link>
                </div>
            </nav>}
            {user && <nav className='navbar'>
                <div className="navbar-div1">
                    <Link to="/"><button className="imdb-button">OMDb</button></Link>
                </div>
                <div className="navbar-div2">
                    <input type="text" placeholder="Search OMDb" value={searchValue}
                    // onChange={(e) => SetSearchValue(e.target.value)}
                    // onKeyDown={(e) => handleSearch(e)}
                    />
                </div>
                <div className="navbar-div3">
                    <div>
                        <Link to='/watchlist'><button>Watchlist</button></Link>
                    </div>
                    <div>
                        {profilePic.found ? (
                            <div>
                                <img src={profilePic.src} alt="Profile" />
                            </div>
                        ) : (
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <select onChange={handleSelect} defaultValue={name}>
                            <option value={name} hidden>{name}</option>
                            <option value="view-profile">Profile</option>
                            <option value="sign-out">Sign Out</option>
                        </select>
                    </div>
                </div>
            </nav>}
        </div >
    );
}
export default Navbar;