import {useEffect, useState} from 'react';
import {fetchBoardDetail} from '@/api/boardApi';
import {submitPost} from "@/api/postApi";
import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";
import CommonWriteForm from "@/components/board/write/CommonWriteForm";
import FileUploadForm from "@/components/board/write/FileUploadForm";
import SubmitButton from "@/components/common/SubmitButton";

const BoardWritePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {boardId} = router.query;
    const [board, setBoard] = useState(null);
    const [formData, setFormData] = useState({
        boardId: "",
        categoryId: "",
        subject: "",
        content: "",
        files: []
    });

    useEffect(() => {
        if (!boardId) return;

        fetchBoardDetail(boardId).then(fetchedBoard => {
            setBoard(fetchedBoard);
            setFormData(prev => ({...prev, boardId: boardId}));
        });
    }, [boardId]);

    const validateForm = () => {
        const {categoryId, subject, content} = formData;
        const trimmedSubject = subject?.trim() ?? "";
        const trimmedContent = content?.trim() ?? "";

        if (!categoryId) return alert("카테고리를 선택하세요.");
        if (!trimmedSubject) return alert("제목을 입력하세요.");
        if (trimmedSubject.length < 4 || trimmedSubject.length >= 100) return alert("제목은 4자 이상 100자 미만이어야 합니다.");
        if (!trimmedContent) return alert("내용을 입력하세요.");
        if (trimmedContent.length < 4 || trimmedContent.length >= 2000) return alert("내용은 4자 이상 2000자 미만이어야 합니다.");

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data = new FormData();
        data.append("boardId", formData.boardId);
        data.append("categoryId", formData.categoryId);
        data.append("subject", formData.subject);
        data.append("content", formData.content);
        formData.files.forEach(file => data.append("files", file));

        try {
            const res = await submitPost(data);
            alert("게시글이 등록되었습니다.");

            const query = Object.fromEntries(searchParams.entries());
            router.push({
                pathname: `/boards/${res.boardId}/view/${res.postId}`,
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

    if (!board) return <div>게시판 정보를 불러올 수 없습니다.</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">{board.boardName} - 등록</h2>
            <form id="writeForm" onSubmit={(e) => e.preventDefault()}>
                <table className="table table-bordered table-sm align-middle">
                    <tbody>
                    <CommonWriteForm board={board} formData={formData} setFormData={setFormData}/>
                    {board.fileType !== "NONE" && (
                        <FileUploadForm
                            fileType={board.fileType}
                            fileMaxSize={board.fileMaxSize}
                            fileMaxCount={board.fileMaxCount}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}
                    </tbody>
                </table>
                <SubmitButton onSubmit={handleSubmit} onCancel={handleCancel}/>
            </form>
        </div>
    );
};

export default BoardWritePage;
