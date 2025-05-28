import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'https://make-marriege-server.vercel.app', 
  });

const useAxios = () => {

   return axiosInstance;
}

export default useAxios