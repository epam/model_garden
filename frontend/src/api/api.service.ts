import axios, { AxiosResponse } from 'axios';

// global axios configuration
axios.defaults.headers = {
  'Content-Type': 'application/json'
};

const makeRequest = (fn: any, rawRequest = false): any => {
  try {
    return fn().then((r: any) => (rawRequest ? r : r.data));
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

export const BE_HOST_PORT = `//${window.location.hostname}:${process.env.REACT_APP_BACKEND_PORT}`;

export const getRequest = <IRes>(url: any, config?: any): IRes => {
  return makeRequest(() => axios.get(url, config));
};

export const postRequest = <IRes>(url: any, data?: any, config?: any): IRes => {
  return makeRequest(() => axios.post<IRes>(url, data, config));
};

export const rawPostRequest = <IRes>(url: any, data?: any, config?: any): AxiosResponse<IRes> => {
  return makeRequest(() => axios.post<IRes>(url, data, config), true);
};

export const patchRequest = <IRes>(url: any, data?: any, config?: any): IRes => {
  return makeRequest(() => axios.patch(url, data, config));
};
