import {useEffect, useState} from "react";
import {deleteComment, fetchComment, postComment} from "@/api/commentApi";
import {formatDateTime} from "@/utils/dateUtils";
import useAuthStore from "@/store/authStore";
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Divider
} from "@mui/material";

const CommentList = ({postId}) => {
    const [comments, setComments] = useState([]);
    const {isLoggedIn, username} = useAuthStore();
    const [content, setContent] = useState("");

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = () => {
        fetchComment(postId)
            .then(res => setComments(res))
            .catch(() => alert("댓글 목록 불러오기 실패"));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return alert("댓글 내용을 입력해 주세요.");

        postComment(postId, content)
            .then(() => {
                setContent("");
                loadComments();
            })
            .catch(err => {
                console.error(err);
                alert("댓글 등록 실패");
            });
    };

    const handleDelete = (commentId) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;
        deleteComment(commentId)
            .then(() => loadComments())
            .catch(() => alert("댓글 삭제 실패"));
    };

    return (
        <Box mt={5}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                댓글
            </Typography>

            {comments.length === 0 ? (
                <Typography color="text.secondary">댓글이 없습니다.</Typography>
            ) : (
                comments.map((c) => (
                    <Paper key={c.id} elevation={1} sx={{p: 2, mb: 2}}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                        >
                            <Typography variant="body2">
                                <strong>{c.name}</strong> · {formatDateTime(c.createAt)}
                            </Typography>
                            {isLoggedIn && username === c.username && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    삭제
                                </Button>
                            )}
                        </Box>
                        <Divider sx={{mb: 1}} />
                        <Typography variant="body1">{c.content}</Typography>
                    </Paper>
                ))
            )}

            {isLoggedIn && (
                <Box component="form" onSubmit={handleSubmit} mt={3}>
                    <Box display="flex" gap={2}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="댓글을 입력해 주세요."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{minWidth: 90}}
                        >
                            등록
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default CommentList;
