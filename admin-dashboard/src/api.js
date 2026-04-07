import axios from "axios"

export const API = axios.create({
  baseURL: "https://the-bean-berry-production.up.railway.app/api"
})