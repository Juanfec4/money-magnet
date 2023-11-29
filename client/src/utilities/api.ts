import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "http://192.168.31.22:8080";

const AUTH_HEADER = {
  authorization:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imp1YW5mZSIsImlhdCI6MTcwMTEwODIwMCwiZXhwIjoxNzAxNzEzMDAwfQ.h3t0x9sCxmG6brUT9cAhlERM5EDIJC1poofFQ5MAYhw",
  // authorization:
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJ1c2VybmFtZSI6IkFsaXNzb24iLCJpYXQiOjE3MDEyNjU2MTYsImV4cCI6MTcwMTg3MDQxNn0.14oTlhiI_rD5yIsSH2YVuJf2Zf5oRceDKsDEv3EYJoc",
};

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

const postData = (endpoint: string, data?: AxiosRequestConfig["data"]) => {
  const requestUrl = BASE_URL + endpoint;
  return axios
    .post(requestUrl, data, { headers: AUTH_HEADER })
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const patchData = (endpoint: string, data?: AxiosRequestConfig["data"]) => {
  const requestUrl = BASE_URL + endpoint;
  return axios
    .patch(requestUrl, data, { headers: AUTH_HEADER })
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => {
      throw new Error(error.message);
    });
};

const deleteData = (
  endpoint: string,
  queryParams?: AxiosRequestConfig["params"]
) => {
  const requestUrl = BASE_URL + endpoint;
  return axios
    .delete(requestUrl, {
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
  postData,
  patchData,
  deleteData,
};
