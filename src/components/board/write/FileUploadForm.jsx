'use client';

import {useRef, useState} from "react";
import {Box, Button, IconButton, Paper, Stack, Typography} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const FileUploadForm = ({fileType, fileMaxSize, fileMaxCount, setFormData}) => {
    const [fileInputs, setFileInputs] = useState([{id: Date.now(), file: null}]);

    const fileRefs = useRef({});

    const handleFileClick = (id) => {
        if (fileRefs.current[id]) {
            fileRefs.current[id].click();
        }
    };

    const handleFileChange = (e, id) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > fileMaxSize) {
            alert(`"${file.name}" 파일은 ${(fileMaxSize / 1024 / 1024).toFixed(1)}MB를 초과할 수 없습니다.`);
            e.target.value = "";
            return;
        }

        const updated = fileInputs.map(input =>
            input.id === id ? {...input, file} : input
        );
        setFileInputs(updated);
        updateFormData(updated);
    };

    const addFileInput = () => {
        if (fileInputs.length >= fileMaxCount) {
            alert(`최대 ${fileMaxCount}개까지 첨부할 수 있습니다.`);
            return;
        }
        setFileInputs(prev => [...prev, {id: Date.now(), file: null}]);
    };

    const removeFileInput = (id) => {
        const updated = fileInputs.filter(input => input.id !== id);
        setFileInputs(updated);
        updateFormData(updated);
    };

    const updateFormData = (inputs) => {
        const files = inputs.map(input => input.file).filter(Boolean);
        setFormData(prev => ({...prev, files}));
    };

    const accept = fileType === 'ALL' ? '.jpg,.png,.gif,.zip' : '.jpg,.png,.gif';

    return (
        <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
                {fileType === 'ALL'
                    ? 'jpg, png, gif, zip 파일만 업로드 가능 (최대 ' + (fileMaxSize / 1024 / 1024).toFixed(1) + 'MB)'
                    : 'jpg, png, gif 파일만 업로드 가능 (최대 ' + (fileMaxSize / 1024 / 1024).toFixed(1) + 'MB)'}
            </Typography>

            <Stack spacing={1}>
                {fileInputs.map((input, idx) => (
                    <Paper key={input.id} sx={{p: 1.5, display: 'flex', alignItems: 'center'}} variant="outlined">
                        <input
                            type="file"
                            accept={accept}
                            ref={(el) => (fileRefs.current[input.id] = el)}
                            onChange={(e) => handleFileChange(e, input.id)}
                            style={{display: 'none'}}
                        />
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<UploadFileIcon/>}
                            onClick={() => handleFileClick(input.id)}
                        >
                            파일 선택
                        </Button>
                        <Typography variant="body2" sx={{
                            ml: 2,
                            flexGrow: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {input.file ? input.file.name : '선택된 파일 없음'}
                        </Typography>
                        <IconButton onClick={() => removeFileInput(input.id)} color="error">
                            <DeleteIcon/>
                        </IconButton>
                    </Paper>
                ))}
            </Stack>

            <Box mt={2}>
                <Button
                    variant="outlined"
                    onClick={addFileInput}
                    disabled={fileInputs.length >= fileMaxCount}
                >
                    + 파일 추가
                </Button>
            </Box>
        </Box>
    );
};

export default FileUploadForm;
