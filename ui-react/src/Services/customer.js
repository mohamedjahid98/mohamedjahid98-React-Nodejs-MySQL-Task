import { APIClient } from "../helpers/api_helper";

const api = new APIClient();

export const getAllCustomer = async () => {
  try {
    const response = await api.get(`/${process.env.REACT_APP_API_PATH}/customer/GetAll`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getCustomerList = async ({ page = 1, search = '', displayLength = 10 }) => {
  try {
    const response = await api.get(`/${process.env.REACT_APP_API_PATH}/customer?page=${page}&search=${search}&limit=${displayLength}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getCustomer = async ({ id }) => {
  try {
    const response = await api.get(`/${process.env.REACT_APP_API_PATH}/customer/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const saveCustomer = async (body) => {
  try {
    const response = await api.post(`/${process.env.REACT_APP_API_PATH}/customer/`, body);
    return response;
  } catch (error) {
    return error;
  }
};

export const saveCustomerCreate = async (body) => {
  try {
    const response = await api.post(`/${process.env.REACT_APP_API_PATH}/customer/`, body);
    return response;
  } catch (error) {
    return error;
  }
};

export const updateCustomer = async (body) => {
  try {
    const response = await api.put(`/${process.env.REACT_APP_API_PATH}/customer/${body.id}`, body);
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteCustomer = async ({ id }) => {
  try {
    const response = await api.delete(`/${process.env.REACT_APP_API_PATH}/customer/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};
