const axios = require('axios')

const NEWS_TOKEN = process.env.NEWS_API_TOKEN
const BASE_URI = `https://newsapi.org/v2/`

let headlineAPI = async(data)=>{
    if(data.lang == 'en') data.lang = 'us'
    let url = `${BASE_URI}top-headlines?country=${data.lang}&apiKey=${NEWS_TOKEN}&category=${data.topic}`
    let resp = axios.get(url)
    return resp
}

let searchAPI = async(data)=>{
    let url = `${BASE_URI}everything?q=${data.query}&apiKey=${NEWS_TOKEN}`
    let resp = axios.get(url)
    return resp
}
module.exports = {
    headlineAPI : headlineAPI,
    searchAPI : searchAPI
}