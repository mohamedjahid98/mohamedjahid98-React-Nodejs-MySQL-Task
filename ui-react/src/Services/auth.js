import { APIClient } from "../helpers/api_helper";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = sessionStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

export const doLogin = async (body) => {
  try {
    const response = await api.post(`/${process.env.REACT_APP_API_PATH}/auth/login`, body);
    return response;
  } catch (error) {
    return error;
  }
};

export const doRegister = async (body) => {
  try {
    const response = await api.post(`/${process.env.REACT_APP_API_PATH}/auth/register`, body);
    return response;
  } catch (error) {
    return error;
  }
};