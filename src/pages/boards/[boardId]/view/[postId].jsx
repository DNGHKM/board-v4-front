import {useEffect, useState} from 'react';
import {fetchBoardDetail} from '@/api/boardApi';
import {useRouter} from "next/router";
import {fetchPostDetail, postIncreaseViewCount} from "@/api/postApi";
import PostInfo from "@/components/board/view/PostInfo";
import PostFile from "@/components/board/view/PostFile";
import CommentList from "@/components/board/view/CommentList";
import BoardViewButtons from "@/components/board/view/BoardViewButtons";

import {
    Box,
    Container,
    Typography,
    Paper,
    Divider
} from "@mui/material";

const PostViewPage = () => {
    const router = useRouter();
    const {boardId, postId} = router.query;

    const [board, setBoard] = useState(null);
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (!boardId || !postId) return;

        fetchBoardDetail(boardId).then(setBoard);
        fetchPostDetail(postId).then(setPost);
        postIncreaseViewCount(postId).catch(() => {
            alert("조회수 증가 오류");
        });
    }, [boardId, postId]);

    if (!board) return <Typography align="center" mt={5}>게시판 정보를 불러올 수 없습니다.</Typography>;
    if (!post) return <Typography align="center" mt={5}>게시글 정보를 불러올 수 없습니다.</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                {board.boardName}
            </Typography>

            {/* 게시글 정보 영역 */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <PostInfo post={post} />
                {board.fileType !== 'NONE' && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <PostFile files={post.files} />
                    </>
                )}
            </Paper>

            {/* 댓글 */}
            {board.boardType === 'FREE' && <CommentList postId={post.id} />}

            {/* 버튼 */}
            <BoardViewButtons post={post} />
        </Container>
    );
};

export default PostViewPage;
