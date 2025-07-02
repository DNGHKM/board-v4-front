import axiosInstance from "./axiosInstance";

export const fetchCategories = (boardId) => {
    return axiosInstance.get(`/api/v1/categories/${boardId}`)
        .then((res) => res.data.data);
};
