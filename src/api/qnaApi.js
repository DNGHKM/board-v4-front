import axiosInstance from "@/api/axiosInstance";

export const fetchQnaListBySearch = (params) => {
    return axiosInstance.get(`/api/v1/qna`, {params})
        .then((res) => res.data.data);
};

export const fetchLatestQnaList = (limit) => {
    return axiosInstance.get(`/api/v1/qna/new?limit=${limit}`)
        .then((res) => res.data.data);
};

export const submitQna = (formData) => {
    return axiosInstance.post('/api/v1/qna', formData)
        .then((res) => res.data.data);
};

export const qnaIncreaseViewCount = (qnaId) => {
    return axiosInstance.post(`/api/v1/qna/${qnaId}/viewCount`);
};

export const fetchQnaDetail = (qnaId) => {
    return axiosInstance.get(`/api/v1/qna/${qnaId}`)
        .then((res) => res.data.data);
};

export const modifyQna = (qnaId, formData) => {
    return axiosInstance.put(`/api/v1/qna/${qnaId}`, formData)
        .then((res) => res.data.data);
};

export const deleteQna = (qnaId) => {
    return axiosInstance.delete(`/api/v1/qna/${qnaId}`);
};
