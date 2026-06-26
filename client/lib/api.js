import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default axios.create({
  baseURL,
});