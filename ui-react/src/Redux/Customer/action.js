import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllCustomer as getAllCustomerApi,
    getCustomer as getCustomerApi,
    getCustomerList as getCustomerListApi,
    saveCustomer as saveCustomerApi,
    saveCustomerCreate as saveCustomerCreateApi,
    updateCustomer as updateCustomerApi,
    deleteCustomer as deleteCustomerApi
} from '../../Services/customer';

import { resetCustomer, apiError } from './reducer'

export const getAllCustomer = createAsyncThunk("customer/getAllCustomer", async (body) => {
    try {
        const response = getAllCustomerApi(body);
        return response;
    } catch (error) {
        return error;
    }
});

export const getCustomerList = createAsyncThunk("customer/getCustomerList", async (body) => {
    try {
        const response = getCustomerListApi(body);
        return response;
    } catch (error) {
        return error;
    }
});

export const getCustomer = createAsyncThunk("customer/getCustomer", async ({ id }) => {
    try {
        const response = getCustomerApi({ id });
        return response;
    } catch (error) {
        return error;
    }
});

export const saveCustomer = createAsyncThunk("customer/saveCustomer", async (body, { dispatch }) => {
    try {
        const response = saveCustomerApi(body.formData);
        setTimeout(() => {
            dispatch(getCustomerList(body.pagination));
        }, 1000);
        return response;
    } catch (error) {
        return error;
    }
});

//Custom Customer Create start

export const saveCustomerCreate = createAsyncThunk("customer/saveCustomerCreate", async (body, { dispatch }) => {
    try {
        const response = saveCustomerCreateApi(body.formData);
        setTimeout(() => {
            dispatch(getAllCustomer());
        }, 1000);
        return response;
    } catch (error) {
        return error;
    }
});

//Custom Customer Create End

export const updateCustomer = createAsyncThunk("customer/updateCustomer", async (body, { dispatch }) => {
    try {
        const response = updateCustomerApi(body.formData);
        setTimeout(() => {
            dispatch(getCustomerList(body.pagination));
        }, 1000);
        return response;
    } catch (error) {
        return error;
    }
});

export const deleteCustomer = createAsyncThunk("customer/deleteCustomer", async (body, { dispatch }) => {
    try {
        const response = deleteCustomerApi({ id: body.id });
        setTimeout(() => {
            dispatch(getCustomerList(body.pagination));
        }, 1000);
        return response;
    } catch (error) {
        return error;
    }
});

export const resetCustomerFlag = () => async (dispatch) => {
    try {
        const response = dispatch(resetCustomer());
        return response;
    } catch (error) {
        dispatch(apiError(error));
    }
};