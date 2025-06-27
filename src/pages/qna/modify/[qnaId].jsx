import {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";
import SubmitButton from "@/components/common/SubmitButton";
import {fetchQnaDetail, modifyQna} from "@/api/qnaApi";
import QnaWriteForm from "@/components/qna/QnaWriteForm";

const QnaModifyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {qnaId} = router.query;
    const [formData, setFormData] = useState({
        subject: "",
        content: "",
        secret: false
    });

    useEffect(() => {
        if (!qnaId) {
            return;
        }

        fetchQnaDetail(qnaId)
            .then(fetchedQna => {
                setFormData({
                    subject: fetchedQna.subject || "",
                    content: fetchedQna.content || "",
                    secret: fetchedQna.secret || false
                });
            })
            .catch(() => alert("문의글 정보를 불러오지 못했습니다."));
    }, [qnaId]);

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
            const res = await modifyQna(qnaId, data);
            alert("문의가 수정되었습니다.");

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
            <h2 className="mb-4">문의게시판 - 수정</h2>
            <form id="modifyForm" onSubmit={(e) => e.preventDefault()}>
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

export default QnaModifyPage;
