import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from "next/link";
import {differenceInDays, parseISO} from "date-fns";
import {formatDateTime} from "@/utils/dateUtils";
import {getImagePreview} from "@/api/fileApi";
import PinnedPostList from "@/components/board/list/PinnedPostList";
import NewBadge from "@/components/common/NewBadge";
import AttachFileIcon from '@mui/icons-material/AttachFile';

const PostTable = ({board, posts, searchParams}) => {
    return (
        <TableContainer component={Paper} sx={{backgroundColor: '#f9f9f9'}}>
            <Table sx={{
                minWidth: 650,
                border: '1px solid #ddd',
                '& .MuiTableCell-root': {
                    borderBottom: '1px solid #eee',
                },
            }} aria-label="post table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{width: 60, fontSize: '1rem'}}>번호</TableCell>
                        <TableCell align="center" sx={{width: 100, fontSize: '1rem'}}>카테고리</TableCell>
                        <TableCell align="center" sx={{width: 400, fontSize: '1rem'}}>제목</TableCell>
                        <TableCell align="center" sx={{width: 80, fontSize: '1rem'}}>조회수</TableCell>
                        <TableCell align="center" sx={{width: 160, fontSize: '1rem'}}>등록 일시</TableCell>
                        <TableCell align="center" sx={{width: 100, fontSize: '1rem'}}>작성자</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <PinnedPostList board={board} searchParams={searchParams}/>
                    {posts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{py: 4, color: 'text.secondary'}}>
                                게시글이 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        posts.map((post) => {
                            const isNew = differenceInDays(new Date(), parseISO(post.createAt)) <= board.newDay;
                            return (
                                <TableRow key={post.id} hover sx={{'& td': {fontSize: '1rem'}}}>
                                    <TableCell align="center">{post.id}</TableCell>
                                    <TableCell align="center">{post.categoryName || ''}</TableCell>
                                    <TableCell>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            {board.boardType === 'GALLERY' && post.fileCount > 0 && (
                                                <span style={{display: 'flex', alignItems: 'center'}}>
                                                    <img
                                                        src={getImagePreview(post.thumbnailFilename)}
                                                        alt="썸네일"
                                                        width="40"
                                                        style={{marginRight: '4px'}}
                                                    />
                                                    {post.fileCount > 1 && (
                                                        <span style={{fontSize: '0.75rem', color: '#888'}}>
                                                            +{post.fileCount - 1}
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            {isNew && <NewBadge/>}
                                            <Link
                                                href={{
                                                    pathname: `/boards/${board.boardId}/view/${post.id}`,
                                                    query: Object.fromEntries(searchParams.entries())
                                                }}
                                                style={{
                                                    color: 'inherit',
                                                    textDecoration: 'none',
                                                    flex: 1,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                                title={post.subject}
                                            >
                                                {post.subject.length > 30 ? post.subject.slice(0, 30) + '...' : post.subject}
                                                {board.allowComment && post.commentCount > 0 && (
                                                    <span
                                                        style={{marginLeft: '4px', fontSize: '0.8rem', color: '#666'}}>
                                                        ({post.commentCount})
                                                    </span>
                                                )}
                                            </Link>
                                            {board.fileType !== 'NONE' && post.fileCount > 0 && (
                                                <AttachFileIcon/>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{post.viewCount.toLocaleString()}</TableCell>
                                    <TableCell align="center">{formatDateTime(post.createAt)}</TableCell>
                                    <TableCell align="center">{post.writerName}</TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PostTable;