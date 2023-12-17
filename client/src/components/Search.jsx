import { /*useParams,*/ useLocation } from "react-router-dom";

const Search = () => {
    // const { searchvalue } = useParams();
    const location = useLocation();
    const SearchParamas = new URLSearchParams(location.search);
    const searchvalue = SearchParamas.get('q');

    //here we fetch item from db  

    return (
        <div className="search">
            {searchvalue && <p>{searchvalue} is what you searched for!</p>}
        </div>
    );
}

export default Search;