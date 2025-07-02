import {useEffect, useState} from "react";
import {fetchCategories} from "@/api/categoryApi";
import {FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";

const CommonWriteForm = ({board, formData, setFormData}) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories(board.boardId)
            .then(setCategories)
            .catch(() => alert("카테고리 정보를 불러오지 못했습니다."));
    }, [board]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    return (
        <Stack spacing={3}>
            {/* 카테고리 선택 */}
            <FormControl fullWidth required>
                <InputLabel id="category-label">카테고리</InputLabel>
                <Select
                    labelId="category-label"
                    name="categoryId"
                    value={formData.categoryId}
                    label="카테고리"
                    onChange={handleChange}
                >
                    <MenuItem value="">카테고리 선택</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* 제목 입력 */}
            <TextField
                fullWidth
                required
                label="제목"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
            />

            {/* 내용 입력 */}
            <TextField
                fullWidth
                required
                label="내용"
                name="content"
                value={formData.content}
                multiline
                rows={8}
                onChange={handleChange}
            />
        </Stack>
    );
};

export default CommonWriteForm;
