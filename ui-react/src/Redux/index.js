import { combineReducers } from "redux";

// Authentication
import LoginReducer from "./Auth/reducer";

//Customer
import CustomerReducer from "./Customer/reducer";

const rootReducer = combineReducers({
    //Auth
    Login: LoginReducer,

    //Customer
    Customer: CustomerReducer,
});

export default rootReducer;