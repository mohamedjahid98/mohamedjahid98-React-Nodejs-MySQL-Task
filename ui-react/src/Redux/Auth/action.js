
import { loginSuccess, registerSuccess, apiError, reset_login_flag } from './reducer';
import { doLogin, doRegister } from '../../Services/auth';
import { setAuthorization } from "../../helpers/api_helper";
import { toast } from 'react-toastify';

export const loginUser = (user, history) => async (dispatch) => {
    try {
        const loginData = await doLogin({
            username: user.username,
            password: user.password,
        });

        if (loginData && loginData.status === 200) {
            toast.success(loginData.data.message);
            sessionStorage.setItem("token", loginData.data.token);
            sessionStorage.setItem("authUser", JSON.stringify(loginData.data.user));
            setAuthorization(loginData.data.token);
            dispatch(loginSuccess(loginData));
            history('/customer');
        } else {
            throw loginData;
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Invalid credentials";
        dispatch(apiError(errorMessage));
        throw error;
    }
};

export const registerUser = (users, history) => async (dispatch) => {
    try {
        const registerData = await doRegister({
            username: users.username,
            email: users.email,
            password: users.password,
            address: users.address,
        });

        if (registerData && registerData.status === 200) {
            toast.success(registerData.data.message)
            dispatch(registerSuccess(registerData));
            history('/');
        } else {
            throw registerData;
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.error || "Not Register";
        dispatch(apiError(errorMessage));
        throw error;
    }
};

export const resetLoginFlag = () => async (dispatch) => {
    try {
        const response = dispatch(reset_login_flag());
        return response;
    } catch (error) {
        dispatch(apiError(error));
    }
};