import {useSearchParams} from "next/navigation";
import {useRouter} from "next/router";
import useAuthStore from "@/store/authStore";
import {deletePost} from "@/api/postApi";
import {Box, Button} from "@mui/material";

const BoardViewButtons = ({post}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {boardId} = router.query;
    const {isLoggedIn, username} = useAuthStore();

    const handleDelete = (e) => {
        e.preventDefault();
        if (!confirm("삭제하시겠습니까?")) return;

        deletePost(post.id)
            .then(() => {
                alert("게시글을 삭제하였습니다.");
                router.push(`/boards/${boardId}/list?${searchParams}`);
            })
            .catch(() => {
                alert("게시글 삭제 중 오류가 발생했습니다.");
            });
    };

    return (
        <Box display="flex" justifyContent="flex-end" gap={1.5} mt={4} pb={5}>
            <Button
                type="button"
                variant="contained"
                sx={{minWidth: 90}}
                style={{backgroundColor: '#808080', color: '#fff'}}
                onClick={() => {
                    router.push(`/boards/${boardId}/list?${searchParams}`);
                }}
            >
                목록
            </Button>

            {isLoggedIn && username === post.username && !post.deleted && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{minWidth: 90}}
                        onClick={() => {
                            router.push(`/boards/${boardId}/modify/${post.id}?${searchParams}`);
                        }}
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

export default BoardViewButtons;
