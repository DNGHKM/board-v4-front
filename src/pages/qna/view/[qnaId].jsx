import {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {fetchQnaDetail, qnaIncreaseViewCount} from "@/api/qnaApi";
import QnaInfo from "@/components/qna/QnaInfo";
import QnaViewButtons from "@/components/qna/QnaViewButtons";
import {Box, Container, Paper, Typography} from "@mui/material";

const QnaViewPage = () => {
    const router = useRouter();
    const {qnaId} = router.query;

    const [qna, setQna] = useState(null);

    useEffect(() => {
        if (!qnaId) return;

        fetchQnaDetail(qnaId).then(setQna);
        qnaIncreaseViewCount(qnaId).catch(() => {
            alert("조회수 증가 오류");
        });
    }, [qnaId]);

    if (!qna) return <Container sx={{mt: 6}}>QnA 정보를 불러올 수 없습니다.</Container>;

    return (
        <Container maxWidth="lg" sx={{mt: 6}}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                문의 게시판
            </Typography>

            <Paper elevation={2} sx={{p: 3, mb: 4}}>
                <QnaInfo qna={qna}/>
            </Paper>

            <Box>
                <QnaViewButtons qna={qna}/>
            </Box>
        </Container>
    );
};

export default QnaViewPage;
