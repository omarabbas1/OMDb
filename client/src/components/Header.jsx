import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
const Header = ({ user, setUser }) => {
    const location = useLocation();
    const pathsWoutNav = ['/signin', '/signup', '/movies-db'];

    return (
        <div className="app">
            {!pathsWoutNav.includes(location.pathname) && <Navbar user={user} setUser={setUser} />}
        </div>

    );
}

export default Header;