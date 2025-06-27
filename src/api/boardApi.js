// src/api/boardApi.js
import axiosInstance from "./axiosInstance";

// 게시판 목록 조회
export const fetchBoardList = () => {
    return axiosInstance.get("/api/v1/boards")
        .then((res) => res.data.data);
};

export const fetchBoardDetail = (id) => {
    return axiosInstance.get(`/api/v1/boards/${id}`)
        .then((res) => res.data.data);
};