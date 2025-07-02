import {Box, Chip, Divider, Paper, Stack, Typography} from "@mui/material";
import GalleryCarousel from "@/components/board/view/GalleryCarousel";
import {formatDateTime} from "@/utils/dateUtils";

const PostInfo = ({post}) => {
    const isGallery = post.categoryName === "갤러리" || post.boardId === 3;

    return (
        <Box className="post-info">
            {/* 상단 정보 영역 */}
            <Box mb={4} pb={2}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    spacing={2}
                    sx={{color: 'text.primary'}}
                >
                    <Typography variant="body1" fontWeight="bold">
                        작성자: <Typography component="span" fontWeight="normal">{post.name}</Typography>
                    </Typography>
                    <Stack direction="row" spacing={4}>
                        <Typography variant="body1">
                            등록일시: <Typography component="span"
                                              fontWeight="normal">{formatDateTime(post.createAt)}</Typography>
                        </Typography>
                        <Typography variant="body1">
                            조회수: <Typography component="span" fontWeight="normal">{post.viewCount + 1}</Typography>
                        </Typography>
                    </Stack>
                </Stack>
                <Divider sx={{mt: 2}}/>
            </Box>

            {/* 제목 + 카테고리 */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Chip
                    label={post.categoryName}
                    // color="info"
                    variant="outlined"
                    // size="small"
                    id="categoryName"
                />
                <Typography variant="h5" fontWeight="bold" id="subject" sx={{wordBreak: 'break-word'}}>
                    {post.subject}
                </Typography>
            </Stack>

            {/* 갤러리 슬라이드 */}
            {isGallery && post.files?.length > 0 && (
                <Box mb={4}>
                    <GalleryCarousel files={post.files}/>
                </Box>
            )}

            {/* 본문 */}
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    bgcolor: 'background.default',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.75,
                    minHeight: 200,
                }}
                id="content"
                className="post-content"
            >
                {post.content}
            </Paper>
        </Box>
    );
};

export default PostInfo;
