import axiosInstance from "@/api/axiosInstance";

export const fetchComment = (postId) => {
    return axiosInstance.get(`/api/v1/comments/${postId}`)
        .then((res) => res.data.data);
};

export const postComment = (postId, content) => {
    return axiosInstance.post(`/api/v1/comments/${postId}`,
        {content}).then((res) => res.data.data);
};

export const deleteComment = (commentId) => {
    return axiosInstance.delete(`/api/v1/comments/${commentId}`);
};