import axios from "axios"

export const API = axios.create({
  baseURL: "https://the-bean-berry-production.up.railway.app/api"
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers.authorization = token
  return config
})