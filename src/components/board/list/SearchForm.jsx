import {Box, Button, Grid, MenuItem, TextField, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";
import {fetchCategories} from "@/api/categoryApi";
import {formatDate} from "@/utils/dateUtils";

const SearchForm = ({board}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const [startDate, setStartDate] = useState(() => searchParams.get("startDate") || formatDate(oneYearAgo));
    const [endDate, setEndDate] = useState(() => searchParams.get("endDate") || formatDate(today));
    const [categoryId, setCategoryId] = useState(() => searchParams.get("categoryId") || "");
    const [keyword, setKeyword] = useState(() => searchParams.get("keyword") || "");
    const [sortBy, setSortBy] = useState(() => searchParams.get("sortBy") || "CREATE_DATE");
    const [sortDirection, setSortDirection] = useState(() => searchParams.get("sortDirection") || "DESC");
    const [size, setSize] = useState(() => parseInt(searchParams.get("size")) || 10);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories(board.boardId)
            .then(setCategories)
            .catch(() => alert("카테고리 정보를 불러오지 못했습니다."));
    }, [board]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert("시작일과 종료일을 모두 입력해 주세요.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert("시작일은 종료일보다 이전이어야 합니다.");
            return;
        }

        const params = new URLSearchParams();
        params.set("boardId", board.boardId);
        params.set("page", "1");
        params.set("size", size.toString());
        params.set("startDate", startDate);
        params.set("endDate", endDate);
        if (categoryId) params.set("categoryId", categoryId);
        if (keyword) params.set("keyword", keyword);
        params.set("sortBy", sortBy);
        params.set("sortDirection", sortDirection);

        router.push({
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()),
        });
    };

    const handleSortChange = (newSortBy, newSortDirection) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("boardId", board.boardId);
        if (newSortBy) params.set("sortBy", newSortBy);
        if (newSortDirection) params.set("sortDirection", newSortDirection);
        params.set("page", "1");

        router.push({
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()),
        });
    };

    const handleSizeChange = (newSize) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("boardId", board.boardId);

        if (newSize) {
            params.set("size", newSize);
        }

        params.set("page", '1');

        router.push({
            pathname: router.pathname,
            query: Object.fromEntries(params.entries()),
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}
             sx={{mb: 4, p: 3, border: 1, borderColor: 'divider', borderRadius: 2}}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <TextField type="date" label="시작일" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                               size="small"/>
                </Grid>
                <Grid item>
                    <Typography>~</Typography>
                </Grid>
                <Grid item>
                    <TextField type="date" label="종료일" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                               size="small"/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        label="카테고리"
                        fullWidth
                        size="small"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        sx={{minWidth: 160}} // 최소 폭 지정
                        displayEmpty
                    >
                        <MenuItem value="">
                            <em>전체 카테고리</em> {/* 선택 전에도 뭔가 보이게 */}
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={6} sx={{flexGrow: 1}}>
                    <TextField
                        label="제목 또는 내용"
                        fullWidth
                        size="small"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained">검색</Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={() => router.push(`/boards/${board.boardId}/list`)}>초기화</Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                    <TextField
                        select
                        label="개수"
                        size="small"
                        value={size}
                        onChange={(e) => {
                            setSize(e.target.value);
                            handleSizeChange(e.target.value);
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(num => (
                            <MenuItem key={num} value={num}>{num}개씩 보기</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <TextField
                                select
                                label="정렬 기준"
                                size="small"
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    handleSortChange(e.target.value, sortDirection);
                                }}
                            >
                                <MenuItem value="CREATE_DATE">등록일시</MenuItem>
                                <MenuItem value="CATEGORY">카테고리</MenuItem>
                                <MenuItem value="SUBJECT">제목</MenuItem>
                                <MenuItem value="VIEW_COUNT">조회수</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item>
                            <TextField
                                select
                                label="정렬 방향"
                                size="small"
                                value={sortDirection}
                                onChange={(e) => {
                                    setSortDirection(e.target.value);
                                    handleSortChange(sortBy, e.target.value);
                                }}
                            >
                                <MenuItem value="DESC">내림차순</MenuItem>
                                <MenuItem value="ASC">오름차순</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchForm;
