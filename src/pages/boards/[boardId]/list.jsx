import {useEffect, useState} from 'react';
import {fetchBoardDetail} from '@/api/boardApi';
import {useRouter} from "next/router";
import {formatDate} from "@/utils/dateUtils";
import {fetchPostListBySearch} from "@/api/postApi";
import SearchForm from "@/components/board/list/SearchForm";
import GoToWritePageButton from "@/components/common/GoToWritePageButton";
import MuiPagination from "@/components/common/Pagination";
import {useSearchParams} from "next/navigation";
import PostTable from "@/components/board/list/PostTable";
import useAuthStore from "@/store/authStore";
import {Box, Container, Typography} from "@mui/material";

const BoardListPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {boardId} = router.query;

    const [board, setBoard] = useState(null);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {isLoggedIn} = useAuthStore();

    useEffect(() => {
        if (!boardId) return;

        fetchBoardDetail(boardId).then(setBoard);
        const params = {
            boardId: boardId || board.boardId,
            page: parseInt(searchParams.get("page")) || 1,
            size: parseInt(searchParams.get("size")) || 10,
            categoryId: searchParams.get("categoryId") || '',
            keyword: searchParams.get("keyword") || '',
            sortBy: searchParams.get("sortBy") || 'CREATE_DATE',
            sortDirection: searchParams.get("sortDirection") || 'DESC',
            startDate: searchParams.get("startDate") || formatDate(yearAgo()),
            endDate: searchParams.get("endDate") || formatDate(new Date()),
        };

        fetchPostListBySearch(params).then(data => {
            setPosts(data.posts);
            setPage(data.page);
            setTotalPages(data.totalPages);
        });

    }, [boardId, searchParams]);

    function yearAgo() {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        return d;
    }


    if (!board) return <div>게시판 정보를 불러올 수 없습니다.</div>;

    return (
        <Container maxWidth="lg" sx={{mt: 5}}>
            {/* 게시판 제목 */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {board.boardName}
                </Typography>
            </Box>


            {/* 검색 폼 */}
            <SearchForm board={board}/>

            {/* 글쓰기 버튼 */}
            {isLoggedIn && !board.writeAdminOnly && (
                <Box mb={2}>
                    <GoToWritePageButton path={`/boards/${board.boardId}/write`}/>
                </Box>
            )}

            {/* 게시글 목록 */}
            <PostTable board={board} posts={posts} searchParams={searchParams}/>

            {/* 페이지네이션 */}
            <Box mt={4} mb={6}>
                <MuiPagination board={board} currentPage={page} totalPages={totalPages} basePath="boards"/>
            </Box>
        </Container>
    );
};

export default BoardListPage;