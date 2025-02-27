import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCustomer, getCustomer, getCustomerList,
  saveCustomerCreate, saveCustomer, updateCustomer, deleteCustomer
} from "./action";

export const initialState = {
  customers: [],
  customer: "",
  error: "",
  loading: false,
  errorMsg: false,
  isCustomerCreated: false,
  isCustomerSuccess: false,
  isCustomerDeleted: false,
  isCustomerFail: false,
  isLoading: false,
  isGetLoading: false,
  isCustomerSaveLoading: false,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.data;
      state.loading = true;
      state.errorMsg = true;
    },
    resetCustomer(state, action) {
      state.error = action.payload;
      state.customer = "";
      state.isCustomerCreated = false;
      state.isCustomerSuccess = false;
      state.isCustomerDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCustomer.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCustomer.fulfilled, (state, action) => {
      state.customers = action.payload;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = true;
      state.isLoading = false;
    });
    builder.addCase(getAllCustomer.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCustomerCreated = false;
      state.isLoading = false;
    });
    builder.addCase(getCustomerList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCustomerList.fulfilled, (state, action) => {
      state.customers = action.payload.data;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = true;
      state.isCustomerFail = false;
      state.isLoading = false;
    });
    builder.addCase(getCustomerList.rejected, (state, action) => {
      state.error = action.payload.error;
      state.isCustomerCreated = false;
      state.isLoading = false;
    });
    builder.addCase(getCustomer.pending, (state, action) => {
      state.isGetLoading = true;
    });
    builder.addCase(getCustomer.fulfilled, (state, action) => {
      state.customer = action.payload;
      state.isGetLoading = false;
    });
    builder.addCase(getCustomer.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isGetLoading = false;
    });
    builder.addCase(saveCustomer.pending, (state, action) => {
      state.isCustomerSaveLoading = true;
    });
    builder.addCase(saveCustomer.fulfilled, (state, action) => {
      if ((action.payload && action.payload.status === 400 || action.payload.status === 404) || action.payload.status === 500) {
        state.isCustomerCreated = false;
        state.isCustomerSuccess = false;
        state.isCustomerFail = true;
        state.error = action.payload.errorMessage;
      } else {
        state.isCustomerCreated = true;
        state.isCustomerSuccess = true;
        state.isCustomerFail = false;
        state.error = "";
      }
    });
    builder.addCase(saveCustomer.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = false;
      state.isCustomerFail = false;
      state.isCustomerSaveLoading = false;
    });

    //Custom Create start
    builder.addCase(saveCustomerCreate.pending, (state, action) => {
      state.isCustomerSaveLoading = true;
    });
    builder.addCase(saveCustomerCreate.fulfilled, (state, action) => {
      if ((action.payload && action.payload.status === 400) || action.payload.status === 500) {
        state.isCustomerCreated = false;
        state.isCustomerSuccess = false;
        state.isCustomerFail = true;
        state.error = action.payload.errorMessage;
      } else {
        state.isCustomerCreated = true;
        state.isCustomerSuccess = true;
        state.isCustomerFail = false;
        state.error = "";
      }
    });
    builder.addCase(saveCustomerCreate.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = false;
      state.isCustomerFail = false;
      state.isCustomerSaveLoading = false;
    });
    //Custom Create End
    builder.addCase(updateCustomer.pending, (state, action) => {
      state.isCustomerSaveLoading = true;
    });
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      if ((action.payload && action.payload.status === 400) || action.payload.status === 500) {
        state.isCustomerCreated = false;
        state.isCustomerSuccess = false;
        state.isCustomerFail = true;
        state.error = action.payload.errorMessage;
      } else {
        state.isCustomerCreated = true;
        state.isCustomerSuccess = true;
        state.isCustomerFail = false;
        state.error = "";
      }
    });
    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCustomerCreated = false;
      state.isCustomerSuccess = false;
      state.isCustomerFail = false;
      state.isCustomerSaveLoading = false;
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.isCustomerDeleted = true;
      state.isCustomerFail = false;
    });
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.error = action.payload.error;
      state.isCustomerDeleted = false;
      state.isCustomerFail = false;
    });
  },
});
export const { apiError, resetCustomer } = customerSlice.actions;

export default customerSlice.reducer;
