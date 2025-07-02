import {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {formatDate} from "@/utils/dateUtils";
import GoToWritePageButton from "@/components/common/GoToWritePageButton";
import MuiPagination from "@/components/common/Pagination";
import {useSearchParams} from "next/navigation";
import useAuthStore from "@/store/authStore";
import QnaTable from "@/components/qna/QnaTable";
import QnaSearchForm from "@/components/qna/QnaSearchForm";
import {fetchQnaListBySearch} from "@/api/qnaApi";
import {Box, Container, Typography} from "@mui/material";

const QnaListPage = () => {
    const searchParams = useSearchParams();
    const {query} = useRouter();

    const [qnaList, setQnaList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {isLoggedIn} = useAuthStore();

    useEffect(() => {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);

        const params = {
            page: parseInt(query.page) || 1,
            size: parseInt(query.size) || 10,
            keyword: query.keyword || '',
            sortBy: query.sortBy || 'CREATE_DATE',
            sortDirection: query.sortDirection || 'DESC',
            startDate: query.startDate || formatDate(yearAgo),
            endDate: query.endDate || formatDate(new Date()),
            myQna: query.myQna === 'true',
        };

        fetchQnaListBySearch(params).then(data => {
            setQnaList(data.qnaList);
            setPage(data.page);
            setTotalPages(data.totalPages);
        });
    }, [query]);

    return (
        <Container maxWidth="lg" sx={{mt: 5}}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    문의게시판
                </Typography>
            </Box>

            <QnaSearchForm/>

            {isLoggedIn && (
                <Box mt={2} mb={2}>
                    <GoToWritePageButton path="/qna/write"/>
                </Box>
            )}

            <QnaTable qnaList={qnaList} searchParams={searchParams}/>

            <Box mt={4} mb={6}>
                <MuiPagination currentPage={page} totalPages={totalPages} basePath="qna"/>
            </Box>
        </Container>
    );
};

export default QnaListPage;
