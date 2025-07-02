import {useRouter} from "next/router";
import useAuthStore from "@/store/authStore";
import {deleteQna} from "@/api/qnaApi";
import {useSearchParams} from "next/navigation";
import {Box, Button} from "@mui/material";

const QnaViewButtons = ({qna}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {isLoggedIn, username} = useAuthStore();

    const handleDelete = (e) => {
        e.preventDefault();
        if (!confirm("삭제하시겠습니까?")) return;

        if (qna.answer) {
            alert("답변이 완료된 게시글은 삭제할 수 없습니다.");
            return;
        }

        deleteQna(qna.id)
            .then(() => {
                alert("문의글을 삭제하였습니다.");
                router.push(`/qna/list?${searchParams}`);
            })
            .catch(() => {
                alert("문의글 삭제 중 오류가 발생했습니다.");
            });
    };

    return (
        <Box display="flex" justifyContent="flex-end" gap={1.5} mt={4} pb={5}>
            <Button
                type="button"
                variant="contained"
                sx={{minWidth: 90}}
                style={{backgroundColor: '#808080', color: '#fff'}}
                onClick={() => router.push(`/qna/list?${searchParams}`)}
            >
                목록
            </Button>

            {!qna.answer && isLoggedIn && username === qna.writerUsername && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{minWidth: 90}}
                        onClick={() => router.push(`/qna/modify/${qna.id}?${searchParams}`)}
                    >
                        수정
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{minWidth: 90}}
                        onClick={handleDelete}
                    >
                        삭제
                    </Button>
                </>
            )}
        </Box>
    );
};

export default QnaViewButtons;
