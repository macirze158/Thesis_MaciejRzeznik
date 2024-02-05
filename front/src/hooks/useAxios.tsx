import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken"
import axios from "../api/axios"
import { useEffect } from "react";
import { error } from "console";

const useAxios = () => {
    const refresh = useRefreshToken()
    const { auth }: any = useAuth()

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = "Bearer " + auth?.token
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const resposneIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                if(error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newToken = await refresh()
                    prevRequest.headers['Authorization'] = 'Bearer ' + newToken
                    return axios(prevRequest)
                }
                return Promise.reject(error)
            } 
        )

        return () => {
            axios.interceptors.request.eject(requestIntercept)
            axios.interceptors.response.eject(resposneIntercept)
        }
    },[auth, refresh])

    return axios
}

export default useAxios