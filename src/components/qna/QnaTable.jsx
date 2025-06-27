import {useRouter} from "next/router";
import {differenceInDays, parseISO} from "date-fns";
import {formatDateTime} from "@/utils/dateUtils";
import useAuthStore from "@/store/authStore";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip,} from "@mui/material";
import NewBadge from "@/components/common/NewBadge";
import LockIcon from '@mui/icons-material/Lock';

const QnaTable = ({qnaList, searchParams}) => {
    const QNA_NEW_DAY = 7;
    const router = useRouter();
    const {username} = useAuthStore();

    const handleClick = (qna) => (e) => {
        e.preventDefault();
        if (qna.secret && qna.writerUsername !== username) {
            alert("비밀글은 작성자 본인만 열람할 수 있습니다.");
            return;
        }

        router.push({
            pathname: `/qna/view/${qna.id}`,
            query: Object.fromEntries(searchParams.entries()),
        });
    };

    return (
        <TableContainer component={Paper} sx={{backgroundColor: '#f9f9f9'}}>
            <Table
                sx={{
                    minWidth: 650,
                    border: '1px solid #ddd',
                    '& .MuiTableCell-root': {borderBottom: '1px solid #eee'},
                }}
                aria-label="qna table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{width: 60, fontSize : '1rem'}}>번호</TableCell>
                        <TableCell align="center" sx={{width: 400, fontSize : '1rem'}}>제목</TableCell>
                        <TableCell align="center" sx={{width: 80, fontSize : '1rem'}}>조회수</TableCell>
                        <TableCell align="center" sx={{width: 160, fontSize : '1rem'}}>등록 일시</TableCell>
                        <TableCell align="center" sx={{width: 100, fontSize : '1rem'}}>작성자</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {qnaList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{py: 4, color: 'text.secondary'}}>
                                게시글이 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        qnaList.map((qna) => {
                            const isNew = differenceInDays(new Date(), parseISO(qna.questionAt)) <= QNA_NEW_DAY;

                            return (
                                <TableRow key={qna.id} hover>
                                    <TableCell align="center">{qna.id}</TableCell>
                                    <TableCell>
                                        <Tooltip title={qna.subject}>
                                            <span
                                                onClick={handleClick(qna)}
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    color: 'inherit',
                                                    textDecoration: 'none',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '100%'
                                                }}
                                            >
                                                {qna.subject}
                                                <span style={{fontSize: '0.75rem', color: '#666'}}>
                                                    {qna.hasAnswer ? '(답변 완료)' : '(미 답변)'}
                                                </span>
                                                {isNew && <NewBadge/>}
                                                {qna.secret && <LockIcon/>}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">{qna.viewCount.toLocaleString()}</TableCell>
                                    <TableCell align="center">{formatDateTime(qna.questionAt)}</TableCell>
                                    <TableCell align="center">{qna.writerName}</TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default QnaTable;
