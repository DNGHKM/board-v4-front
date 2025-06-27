// src/api/boardApi.js
import axiosInstance from "./axiosInstance";

// 게시글 목록 조회
export const fetchPostListBySearch = (params) => {
    return axiosInstance.get(`/api/v1/posts`, {params})
        .then((res) => res.data.data);
};

export const fetchLatestPostList = (boardId, limit) => {
    return axiosInstance.get(`/api/v1/posts/${boardId}/new?limit=${limit}`)
        .then((res) => res.data.data);
};

export const fetchPinnedPostList = (boardId) => {
    return axiosInstance.get(`/api/v1/posts/${boardId}/pinned`,)
        .then((res) => res.data.data);
};

export const fetchPostDetail = (id) => {
    return axiosInstance.get(`/api/v1/posts/${id}`)
        .then((res) => res.data.data);
};

export const submitPost = (formData) => {
    return axiosInstance.post('/api/v1/posts', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((res) => res.data.data);
};

export const modifyPost = (postId, formData) => {
    return axiosInstance.put(`/api/v1/posts/${postId}`, formData)
        .then((res) => res.data.data);
};

export const deletePost = (postId) => {
    return axiosInstance.delete(`/api/v1/posts/${postId}`);
};

export const postIncreaseViewCount = (postId) => {
    return axiosInstance.post(`/api/v1/posts/${postId}/viewCount`);
};
