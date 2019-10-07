import axios from "axios"

const http = axios.create({
    timeout: 5000,
    withCredentials: true
})

http.interceptors.request.use((config) => {
    if (config.method == "get") {

    } else if (config.method == "post") {
        // config.headers["content-type"] = "application/x-www-form-urlencoded"
        config.headers["content-type"] = "application/json"
    }

    return config
}, (err) => {
    return Promise.reject(err)
})


http.interceptors.response.use((res) => {
    if (res.status == 200) {
        return res.data
    }
}, (err) => {
    return Promise.reject(err)
})


export default (method, url, data = {}) => {
    if (method == "get") {
        return http.get(url, {
            params: data
        })
    } else if (method == "post") {
        return http.post(url, data)
    }
}
