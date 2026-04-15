import axios from "axios";

const ApiBase = axios.create({
  baseURL: "https://69dd5cd084f912a26405025b.mockapi.io/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default ApiBase;
