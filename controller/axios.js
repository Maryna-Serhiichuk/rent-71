const axios = require('axios')

const BASE_URL = `https://api.telegram.org/bot${process.env.TOKEN}`

function getAxiosInstance() {
    return {
        get(method, params) {
            return axios.get(`/${method}`, {
                baseURL: BASE_URL,
                params
            })
        },
        post(method, data) {
            return axios.post(`/${method}`, {
                data
            })
        }
    }
}

module.exports = {
    axiosInstance: getAxiosInstance()
}