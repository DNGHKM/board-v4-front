import Link from "next/link";
import {differenceInDays, parseISO} from "date-fns";
import {formatDateTime} from "@/utils/dateUtils";
import {useEffect, useState} from "react";
import {fetchPinnedPostList} from "@/api/postApi";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {getImagePreview} from "@/api/fileApi";
import NewBadge from "@/components/common/NewBadge";

const PinnedPostList = ({board, searchParams}) => {
    const [pinnedPosts, setPinnedPosts] = useState([]);

    useEffect(() => {
        if (!board.allowPinned) return;
        fetchPinnedPostList(board.boardId)
            .then(setPinnedPosts)
            .catch(() => console.error("고정글 조회 실패"));
    }, [board]);

    if (!board.allowPinned || pinnedPosts.length === 0) {
        return null;
    }

    return (
        <>
            {pinnedPosts.map((p) => {
                const isNew = differenceInDays(new Date(), parseISO(p.createAt)) <= board.newDay;
                return (
                    <TableRow key={`pinned-${p.id}`} hover selected sx={{'& td': {fontSize: '1rem'}}}>
                        <TableCell align="center">{p.id}</TableCell>
                        <TableCell align="center">{p.categoryName || ''}</TableCell>
                        <TableCell align="left">
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                {isNew && <NewBadge/>}
                                {board.boardType === 'GALLERY' && p.fileCount > 0 && (
                                    <>
                                        <img
                                            src={getImagePreview(p.thumbnailFilename)}
                                            alt="썸네일"
                                            width="40"
                                        />
                                        {p.fileCount > 1 && <span>+{p.fileCount - 1}</span>}
                                    </>
                                )}

                                <Link
                                    href={{
                                        pathname: `/boards/${board.boardId}/view/${p.id}`,
                                        query: Object.fromEntries(searchParams.entries())
                                    }}
                                    style={{textDecoration: 'none', color: 'inherit', maxWidth: '100%'}}
                                    className="text-truncate"
                                >
                                    {p.subject.length > 60 ? p.subject.slice(0, 60) + '...' : p.subject}
                                    {board.allowComment && p.commentCount > 0 && (
                                        <span className="ms-1 text-muted">({p.commentCount})</span>
                                    )}
                                </Link>

                                {board.fileType !== 'NONE' && p.fileCount > 0 && (
                                    <img src="/clip.png" width="18" alt="첨부" className="align-middle"/>
                                )}

                            </div>
                        </TableCell>
                        <TableCell align="center">{p.viewCount.toLocaleString()}</TableCell>
                        <TableCell align="center">{formatDateTime(p.createAt)}</TableCell>
                        <TableCell align="center">{p.writerName}</TableCell>
                    </TableRow>
                );
            })}
        </>
    );
};

export default PinnedPostList;