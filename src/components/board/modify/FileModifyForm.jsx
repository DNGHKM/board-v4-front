'use client';

import { useEffect, useRef, useState } from "react";
import { getImagePreview } from "@/api/fileApi";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const FileModifyForm = ({
                            fileType,
                            fileMaxSize,
                            fileMaxCount,
                            formData,
                            setFormData
                        }) => {
    if (fileType === "NONE") return null;

    const [fileInputs, setFileInputs] = useState([]);
    const [preserveFiles, setPreserveFiles] = useState(formData.files || []);
    const [deleteFilenames, setDeleteFilenames] = useState([]);
    const fileRefs = useRef({});

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            preserveFilenames: preserveFiles.map(file => file.savedFilename),
            newFiles: fileInputs.map(i => i.file).filter(Boolean),
            deleteFilenames: deleteFilenames
        }));
    }, [fileInputs, preserveFiles, deleteFilenames]);

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
            input.id === id ? { ...input, file } : input
        );
        setFileInputs(updated);
    };

    const addFileInput = () => {
        const selectedFileCount = fileInputs.filter(i => i.file !== null).length;
        const unselectedInputCount = fileInputs.filter(i => i.file === null).length;
        const totalCount = preserveFiles.length + selectedFileCount + unselectedInputCount;

        if (totalCount >= fileMaxCount) {
            alert(`최대 ${fileMaxCount}개까지 첨부할 수 있습니다.`);
            return;
        }

        setFileInputs(prev => [...prev, { id: Date.now(), file: null }]);
    };

    const removeFileInput = (id) => {
        const updated = fileInputs.filter(input => input.id !== id);
        setFileInputs(updated);
    };

    const removePreserveFile = (savedFilename) => {
        setPreserveFiles(prev => prev.filter(file => file.savedFilename !== savedFilename));
        setDeleteFilenames(prev => [...prev, savedFilename]);
    };

    const acceptTypes = fileType === 'ALL' ? '.jpg,.png,.gif,.zip' : '.jpg,.png,.gif';

    return (
        <Box>
            <Typography variant="body2" color="text.secondary" mb={2}>
                {fileType === 'ALL'
                    ? 'jpg, png, gif, zip 파일만 업로드 가능 (최대 ' + (fileMaxSize / 1024 / 1024).toFixed(1) + 'MB)'
                    : 'jpg, png, gif 파일만 업로드 가능 (최대 ' + (fileMaxSize / 1024 / 1024).toFixed(1) + 'MB)'}
            </Typography>

            {/* 기존 파일 */}
            {preserveFiles.length > 0 && (
                <Stack spacing={1} mb={2}>
                    {preserveFiles.map((file) => (
                        <Paper key={file.savedFilename} sx={{ p: 1.5, display: 'flex', alignItems: 'center' }} variant="outlined">
                            {fileType === 'IMAGE' && (
                                <Avatar
                                    src={getImagePreview(file.savedFilename)}
                                    variant="rounded"
                                    sx={{ width: 50, height: 50, mr: 2 }}
                                />
                            )}
                            <Typography component="a" href={`/api/v1/files/${file.savedFilename}`} target="_blank" rel="noopener noreferrer" sx={{ flexGrow: 1 }}>
                                {file.originalFilename}
                            </Typography>
                            <IconButton color="error" onClick={() => removePreserveFile(file.savedFilename)}>
                                <DeleteIcon />
                            </IconButton>
                        </Paper>
                    ))}
                </Stack>
            )}

            {/* 새 파일 */}
            <Stack spacing={1}>
                {fileInputs.map((input) => (
                    <Paper key={input.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center' }} variant="outlined">
                        <input
                            type="file"
                            accept={acceptTypes}
                            ref={(el) => (fileRefs.current[input.id] = el)}
                            onChange={(e) => handleFileChange(e, input.id)}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<UploadFileIcon />}
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
                            <DeleteIcon />
                        </IconButton>
                    </Paper>
                ))}
            </Stack>

            <Box mt={2}>
                <Button
                    variant="outlined"
                    onClick={addFileInput}
                    disabled={fileInputs.length + preserveFiles.length >= fileMaxCount}
                >
                    + 파일 추가
                </Button>
            </Box>
        </Box>
    );
};

export default FileModifyForm;
