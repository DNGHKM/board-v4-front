import axiosInstance from "@/api/axiosInstance";

export const downloadFile = async (savedFilename) => {
    try {
        const response = await axiosInstance.get(`/api/v1/files/${savedFilename}`, {
            responseType: 'blob'
        });

        // 1. Content-Disposition 헤더에서 원래 파일명 추출
        const disposition = response.headers['content-disposition'];

        let filename = savedFilename;

        if (disposition) {
            const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
            const asciiMatch = disposition.match(/filename="(.+?)"/);

            if (utf8Match) {
                filename = decodeURIComponent(utf8Match[1]);
            } else if (asciiMatch) {
                filename = asciiMatch[1];
            }
        }

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', filename); // 원래 파일 이름
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
        alert('파일 다운로드 중 오류가 발생했습니다.');
    }
};

export const getImagePreview = (filename) => {
    return `${axiosInstance.defaults.baseURL}/api/v1/files/preview/${filename}`;
};