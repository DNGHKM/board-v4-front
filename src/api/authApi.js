import axiosInstance from "@/api/axiosInstance";

export const fetchLogin = ({username, password}) => {
    return axiosInstance.post(`/api/v1/auth/login`, {username, password})
        .then((res) => res.data.data);
};

export const validToken = ({token}) => {
    return axiosInstance.post(`/api/v1/auth/me`, {token})
        .then((res) => res.data.data);
};

export const fetchUsernameCheck = (username) => {
    return axiosInstance.get(`/api/v1/auth/check`, {
        params: {username}
    }).then(res => res.data.data);
};

export const fetchSignUp = (signUpRequest) => {
    return axiosInstance.post(`/api/v1/auth/signup`, signUpRequest)
        .then(res => res.data.data); // accessToken
};