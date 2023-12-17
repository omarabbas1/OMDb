// const fetchToken = async () => {
//     const token = window.localStorage.getItem('token');
//     try {
//         const response = await fetch('/http://localhost:5000/token', {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return await response.json();
//     }
//     catch (error) {
//         console.error("Fetch error: ", error.message);
//         throw error;
//     }
// }
// export default fetchToken;
