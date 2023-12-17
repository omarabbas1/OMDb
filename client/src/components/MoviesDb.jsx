
import { useEffect, useState /*useRef*/ } from 'react';
import { db } from '../database/firebase';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../styles/moviesdb.css'


const MoviesDb = () => {
    const [movies, setMovies] = useState([]);
    const initialFormData = {
        name: '',
        genre: '',
        director: '',
        writer: '',
        star: '',
        image: '',
        status: '',
        year: '',
    }

    const [addFormData, setAddFormData] = useState({
        name: '',
        genre: '',
        director: '',
        writer: '',
        star: '',
        image: '',
        status: '',
        year: '',
    })

    const [id, SetId] = useState('');

    // const AddFormRef = useRef(null);
    // const DeleteFormRef = useRef(null);

    const fetchMoviesDb = () => {
        const colref = collection(db, 'movies');
        getDocs(colref)
            .then((snapshot) => {
                const movieslist = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setMovies(movieslist);
            })
    }

    useEffect(() => {
        fetchMoviesDb();
    }, [])

    useEffect(() => {
        console.log(movies);
    }, [movies])

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddFormData(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const colref = collection(db, 'movies');
        addDoc(colref, addFormData)
            .then(() => {
                setAddFormData(initialFormData)
            })
        fetchMoviesDb();
    }

    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        if (id.length > 1) {
            const docref = doc(db, 'movies', id);
            deleteDoc(docref)
                .then(() => {
                    SetId('');
                })
        }
        fetchMoviesDb();
    }


    return (
        <div>
            <Link to='/'>Back to IMDb</Link>
            <div className="movies-dbManipulation">
                <form className='Add Movie' onSubmit={handleAddSubmit} /*ref={AddFormRef}*/>
                    <h1>Add movies to DB</h1>
                    <label>Name
                        <input
                            type="text"
                            name="name"
                            value={addFormData.name}
                            onChange={handleAddChange}
                            required />
                    </label><br />
                    <label>Genre
                        <input
                            type="text"
                            name="genre"
                            value={addFormData.genre}
                            onChange={handleAddChange}
                            required />
                    </label><br />
                    <label>Director
                        <input
                            type="text"
                            name="director"
                            value={addFormData.director}
                            onChange={handleAddChange}
                            required />
                    </label><br />
                    <label>Writer
                        <input
                            type="text"
                            name="writer"
                            value={addFormData.writer}
                            onChange={handleAddChange}
                        />
                    </label><br />
                    <label>Star
                        <input
                            type="text"
                            name="star"
                            value={addFormData.star}
                            onChange={handleAddChange}
                        />
                    </label><br />
                    <label>Image
                        <input
                            type="text"
                            name="image"
                            value={addFormData.image}
                            onChange={handleAddChange}
                            required />
                    </label><br />
                    <label>Status
                        <input
                            type="text"
                            name="status"
                            value={addFormData.status}
                            onChange={handleAddChange}
                        />
                    </label>
                    <label>Year
                        <input
                            type="text"
                            name="year"
                            value={addFormData.year}
                            onChange={handleAddChange}
                        />
                    </label>

                    <button>Add</button>
                </form>

                <form className='Delete Movie' onSubmit={handleDeleteSubmit} /*ref={DeleteFormRef}*/>
                    <h1>Delete Movies From DB</h1>
                    <label>id
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => SetId(e.target.value)}
                        />
                    </label>
                    <button>Delete</button>
                </form>
            </div>
        </div>


    );
}

export default MoviesDb;