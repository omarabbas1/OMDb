import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Registration from './components/Registration';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Search from './components/Search';
import HomePage from './components/HomePage';
import WatchList from './components/WatchList';
import Footer from './components/Footer';
import MoviesDb from './components/MoviesDb';
import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import SucessAuth from './components/SucessAuth';
import MovieDetailsPage from './components/MovieDetailsPage';
import MovieDetailsPage2 from './components/MovieDetailsPage2';
import MovieReview from './components/MovieReview';
import Actor from './components/Actor';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleStorageChange = async () => {
      const response = await fetch('http://localhost:5000/token', {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data !== 'token expired') {
        setUser(data);
      }
      else {
        setUser(null);

      }
    };
    // window.addEventListener('storage', handleStorageChange);

    // return () => {
    //   window.removeEventListener('storage', handleStorageChange);
    // }
    handleStorageChange();
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <div className="content">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/registration' element={<Registration setUser={setUser} />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn user={user} setUser={setUser} />} />
          <Route path='/search' element={<Search />} />
          <Route path='/watchlist' element={<WatchList /*user={user}*/ />} />
          <Route path='/movies-db' element={<MoviesDb />} />
          <Route path='/success' element={<SucessAuth setUser={setUser} />} />
          <Route path='/profile' element={<Profile user={user} setUser={setUser} />} />
          <Route path="/movie/commingsoon/:id" element={<MovieDetailsPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage2 user={user} setUser={setUser} />} />
          <Route path="/movie/reviews/:id" element={<MovieReview user={user} setUser={setUser} />} />
          <Route path="/actors/:id" element={<Actor/>} />

        </Routes>
      </div>
      <Footer user={user} />
    </Router >
  );
}

export default App;