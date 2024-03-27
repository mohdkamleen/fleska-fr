import axios from 'axios';

// creating an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://fleska-bk.onrender.com/api"
});

// Setting the default headers
axiosInstance.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem("token")}`; 

export default  axiosInstance