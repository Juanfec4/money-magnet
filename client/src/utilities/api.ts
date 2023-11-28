import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "http://192.168.31.22:8080";

const AUTH_HEADER = {
  authorization:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imp1YW5mZSIsImlhdCI6MTcwMTEwODIwMCwiZXhwIjoxNzAxNzEzMDAwfQ.h3t0x9sCxmG6brUT9cAhlERM5EDIJC1poofFQ5MAYhw",
};

//Fetch data at an endpoint
const fetchData = (
  endpoint: string,
  queryParams?: AxiosRequestConfig["params"]
) => {
  const requestUrl = BASE_URL + endpoint;
  return axios
    .get(requestUrl, {
      headers: AUTH_HEADER,
      params: { ...queryParams },
    })
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

export default {
  fetchData,
};
