import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
console.log("API baseURL:", baseURL);

export default axios.create({
  baseURL,
  timeout: 10000,
});