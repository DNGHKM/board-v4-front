'use client';

import {useRouter} from "next/router";
import {differenceInDays, parseISO} from "date-fns";
import useAuthStore from "@/store/authStore";
import {useEffect, useState} from "react";
import Link from "next/link";
import {fetchLatestQnaList} from "@/api/qnaApi";
import NewBadge from "@/components/common/NewBadge";
import LockIcon from '@mui/icons-material/Lock';

import {
    Box,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import MoreButton from "@/components/common/MoreButton";

const LatestQnaTable = () => {
    const QNA_NEW_DAY = 7;
    const router = useRouter();
    const {username} = useAuthStore();
    const [qnaList, setQnaList] = useState([]);

    useEffect(() => {
        fetchLatestQnaList(5)
            .then(data => setQnaList(data))
            .catch(() => alert("최신 QnA를 불러오지 못했습니다."));
    }, []);

    const handleClick = (qna) => (e) => {
        e.preventDefault();
        if (qna.secret && qna.writerUsername !== username) {
            alert("비밀글은 작성자 본인만 열람할 수 있습니다.");
            return;
        }
        router.push(`/qna/view/${qna.id}`);
    };

    return (
        <Card
            sx={{
                p: 2,
                mb: 4,
                mt:6,
                border: '1px solid #ddd',
                height: 300,
                flexShrink: 0,
                flexGrow: 0,
            }}
        >
            {/* 상단 제목 & 버튼 */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box width={160}>
                    <Link
                        href={username
                            ? "/qna/list?myQna=true"
                            : "/auth/login?redirect=/qna/list?myQna=true"}
                        passHref
                    >
                        <Button variant="outlined"
                                size="small"
                                sx={{
                                    color: 'black',
                                    borderColor: 'black',
                                    '&:hover': {
                                        borderColor: 'black',
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    }
                                }}
                        >
                            나의 문의내역
                        </Button>
                    </Link>
                </Box>

                <Box flexGrow={1} textAlign="center">
                    <Typography variant="h6" component="div">문의 게시판</Typography>
                </Box>

                <Box width={160} textAlign="right">
                    <Link href="/qna/list" passHref>
                        <MoreButton/>
                    </Link>
                </Box>
            </Box>

            {/* 테이블 */}
            <TableContainer>
                <Table size="small" sx={{
                    '& .MuiTableCell-root': {borderBottom: '1px solid #eee'},
                    border: '1px solid #ddd',
                }}>
                    <TableHead sx={{backgroundColor: '#f5f5f5'}}>
                        <TableRow>
                            <TableCell align="center" sx={{width: 60}}>번호</TableCell>
                            <TableCell align="center">제목</TableCell>
                            <TableCell align="center" sx={{width: 80}}>작성자</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {qnaList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{py: 4, color: 'text.secondary'}}>
                                    게시글이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            qnaList.map((qna, index) => {
                                const isNew = differenceInDays(new Date(), parseISO(qna.questionAt)) <= QNA_NEW_DAY;
                                return (
                                    <TableRow key={qna.id} hover>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{overflow: 'hidden'}}
                                            >
                                                <Box
                                                    component="a"
                                                    href="#"
                                                    onClick={handleClick(qna)}
                                                    sx={{
                                                        color: 'text.primary',
                                                        textDecoration: 'none',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '100%',
                                                        flex: 1,
                                                        cursor: 'pointer'
                                                    }}
                                                    title={qna.subject}
                                                >
                                                    {qna.subject.length > 30
                                                        ? qna.subject.slice(0, 30) + '...'
                                                        : qna.subject}
                                                </Box>

                                                <Box display="flex" gap={1} alignItems="center" flexShrink={0} ml={2}>
                                                    {qna.secret && <LockIcon/>}
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {qna.hasAnswer ? '(답변 완료)' : '(미 답변)'}
                                                    </Typography>
                                                    {isNew && <NewBadge/>}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">{qna.writerName}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default LatestQnaTable;
