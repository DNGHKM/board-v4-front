import {useEffect, useState} from 'react';
import {fetchBoardDetail} from '@/api/boardApi';
import {useRouter} from "next/router";
import CommonModifyForm from "@/components/board/modify/CommonModifyForm";
import ModifyActionButton from "@/components/board/modify/ModifyActionButton";
import {fetchPostDetail, modifyPost} from "@/api/postApi";
import FileModifyForm from "@/components/board/modify/FileModifyForm";
import {useSearchParams} from "next/navigation";
import CommonWriteForm from "@/components/board/write/CommonWriteForm";

const PostModifyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {boardId, postId} = router.query;

    const [board, setBoard] = useState(null);
    const [formData, setFormData] = useState({
        postId: "",
        boardId: "",
        categoryId: "",
        subject: "",
        content: "",
        files: []
    });

    useEffect(() => {
        if (!boardId || !postId) return;

        fetchBoardDetail(boardId)
            .then(fetchedBoard => setBoard(fetchedBoard))
            .catch(() => alert("게시판 정보를 불러오지 못했습니다."));

        fetchPostDetail(postId)
            .then(fetchedPost => {
                setFormData({
                    boardId: String(fetchedPost.boardId),
                    categoryId: String(fetchedPost.categoryId),
                    subject: fetchedPost.subject || "",
                    content: fetchedPost.content || "",
                    files: fetchedPost.files || []
                });
            })
            .catch(() => alert("게시글 정보를 불러오지 못했습니다."));
    }, [boardId, postId]);

    const validateForm = () => {
        const subject = formData.subject?.trim() ?? "";
        const content = formData.content?.trim() ?? "";
        const category = formData.categoryId;

        if (!category) return alert("카테고리를 선택하세요.");
        if (!subject) return alert("제목을 입력하세요.");
        if (subject.length < 4 || subject.length >= 100) return alert("제목은 4자 이상 100자 미만이어야 합니다.");
        if (!content) return alert("내용을 입력하세요.");
        if (content.length < 4 || content.length >= 2000) return alert("내용은 4자 이상 2000자 미만이어야 합니다.");

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data = new FormData();
        data.append("boardId", formData.boardId);
        data.append("categoryId", formData.categoryId);
        data.append("subject", formData.subject);
        data.append("content", formData.content);

        // 기존 유지할 파일들 (UUID)
        formData.preserveFilenames?.forEach(filename =>
            data.append("preserveFilenames", filename)
        );

        // 새 파일 업로드
        formData.newFiles?.forEach(file =>
            data.append("files", file)
        );

        try {
            const res = await modifyPost(postId, data);
            alert("게시글이 수정되었습니다.");

            const query = Object.fromEntries(searchParams.entries());
            router.push({
                pathname: `/boards/${res.boardId}/view/${res.postId}`,
                query
            });
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || "수정 중 오류가 발생했습니다.";
            alert("오류: " + msg);
        }
    };

    if (!board) return <div>게시판 정보를 불러오는 중입니다...</div>;
    if (!formData.subject) return <div>게시글 정보를 불러오는 중입니다...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">{board.boardName} - 수정</h2>
            <form id="writeForm" onSubmit={(e) => e.preventDefault()}>
                <table className="table table-bordered table-sm align-middle">
                    <tbody>
                    <CommonWriteForm board={board} formData={formData} setFormData={setFormData}/>
                    <FileModifyForm
                        fileType={board.fileType}
                        fileMaxSize={board.fileMaxSize}
                        fileMaxCount={board.fileMaxCount}
                        formData={formData}
                        setFormData={setFormData}
                    />
                    </tbody>
                </table>
                <ModifyActionButton onSubmit={handleSubmit}/>
            </form>
        </div>
    );
};

export default PostModifyPage;
