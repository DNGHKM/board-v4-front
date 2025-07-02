'use client';

import Link from "next/link";
import {useEffect, useState} from "react";
import {fetchLatestPostList} from "@/api/postApi";
import {differenceInDays, parseISO} from "date-fns";
import {getImagePreview} from "@/api/fileApi";
import NewBadge from "@/components/common/NewBadge";
import AttachFileIcon from '@mui/icons-material/AttachFile';

import {Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import MoreButton from "@/components/common/MoreButton";

const LatestPostTable = ({board}) => {
    const [posts, setPosts] = useState([]);
    const limit = board.boardType === 'GALLERY' ? 4 : 5;

    useEffect(() => {
        fetchLatestPostList(board.boardId, limit)
            .then(data => setPosts(data))
            .catch(() => alert("최신 게시글을 불러오지 못했습니다."));
    }, []);

    return (
        <Card
            sx={{
                p: 2,
                mb: 4,
                mt: 6,
                border: '1px solid #ddd',
                height: 300,
                flexShrink: 0,
                flexGrow: 0,
            }}
        >
            {/* 상단 영역 */}
            <Box display="flex" alignItems="center" mb={2}>
                <Box width={100}></Box>
                <Box flexGrow={1} textAlign="center">
                    <Typography variant="h6" component="div">{board.boardName}</Typography>
                </Box>
                <Box width={100} textAlign="right">
                    <Link href={`/boards/${board.boardId}/list`} passHref>
                        <MoreButton/>
                    </Link>
                </Box>
            </Box>

            {/* 테이블 영역 */}
            <TableContainer>
                <Table size="small" sx={{
                    '& .MuiTableCell-root': {borderBottom: '1px solid #eee'},
                    border: '1px solid #ddd', tableLayout: 'fixed', width: '100%'
                }}>
                    <TableHead sx={{backgroundColor: '#f5f5f5'}}>
                        <TableRow>
                            <TableCell align="center" sx={{width: 60, whiteSpace: 'nowrap'}}>번호</TableCell>
                            <TableCell align="center" sx={{width: 100}}>분류</TableCell>
                            <TableCell align="center">제목</TableCell> {/* 남는 공간 자동 할당 */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{py: 4, color: 'text.secondary'}}>
                                    등록된 게시글이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => {
                                const isNew = differenceInDays(new Date(), parseISO(post.createAt)) <= board.newDay;
                                return (
                                    <TableRow key={post.id} hover>
                                        <TableCell align="center">{post.id}</TableCell>
                                        <TableCell align="center">{post.categoryName || ''}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1} flexWrap="nowrap">
                                                {/* 갤러리 썸네일 */}
                                                {board.boardType === 'GALLERY' && post.fileCount > 0 && (
                                                    <Box display="flex" alignItems="center">
                                                        <img
                                                            src={getImagePreview(post.thumbnailFilename)}
                                                            alt="썸네일"
                                                            height={30}
                                                            style={{marginRight: '4px'}}
                                                        />
                                                        {post.fileCount > 1 && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                +{post.fileCount - 1}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}

                                                {/* 제목 링크 */}
                                                <Link
                                                    href={`/boards/${board.boardId}/view/${post.id}`}
                                                    style={{
                                                        flex: 1,
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                    title={post.subject}
                                                >
                                                    {post.subject.length > 30 ? post.subject.slice(0, 30) + '...' : post.subject}
                                                    {board.allowComment && post.commentCount > 0 && (
                                                        <Typography variant="caption" color="text.secondary"
                                                                    sx={{ml: 0.5}}>
                                                            ({post.commentCount})
                                                        </Typography>
                                                    )}
                                                </Link>

                                                {/* 클립 아이콘 */}
                                                {board.fileType !== 'NONE' && post.fileCount > 0 && (
                                                    <AttachFileIcon/>
                                                )}

                                                {/* NEW 뱃지 */}
                                                {isNew && <NewBadge/>}
                                            </Box>
                                        </TableCell>
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

export default LatestPostTable;
