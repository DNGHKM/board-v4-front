import {useState} from 'react';
import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";
import SubmitButton from "@/components/common/SubmitButton";
import QnaWriteForm from "@/components/qna/QnaWriteForm";
import {submitQna} from "@/api/qnaApi";

const QnaWritePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        subject: "",
        content: "",
        secret: false
    });

    const validateForm = () => {
        const {subject, content} = formData;
        const trimmedSubject = subject?.trim() ?? "";
        const trimmedContent = content?.trim() ?? "";

        if (!trimmedSubject) return alert("제목을 입력하세요.");
        if (trimmedSubject.length < 4 || trimmedSubject.length >= 100) return alert("제목은 4자 이상 100자 미만이어야 합니다.");
        if (!trimmedContent) return alert("내용을 입력하세요.");
        if (trimmedContent.length < 4 || trimmedContent.length >= 2000) return alert("내용은 4자 이상 2000자 미만이어야 합니다.");

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data = new FormData();
        data.append("subject", formData.subject);
        data.append("content", formData.content);
        data.append("secret", formData.secret);

        try {
            const res = await submitQna(data);
            alert("문의가 등록되었습니다.");

            const query = Object.fromEntries(searchParams.entries());
            router.push({
                pathname: `/qna/view/${res.qnaId}`,
                query: query
            });
        } catch (err) {
            const msg = err?.response?.data?.message || "등록 중 오류가 발생했습니다.";
            alert("오류: " + msg);
        }
    };

    const handleCancel = () => {
        if (window.confirm("작성 중인 내용을 취소하시겠습니까?")) {
            window.history.back();
        }
    };


    return (
        <div className="container mt-5">
            <h2 className="mb-4">문의게시판 - 등록</h2>
            <form id="writeForm" onSubmit={(e) => e.preventDefault()}>
                <table className="table table-bordered table-sm align-middle">
                    <tbody>
                    <QnaWriteForm formData={formData} setFormData={setFormData}/>
                    </tbody>
                </table>
                <SubmitButton onSubmit={handleSubmit} onCancel={handleCancel}/>
            </form>
        </div>
    );
};

export default QnaWritePage;
