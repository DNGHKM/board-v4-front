'use client';

import { Box, Paper } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { getImagePreview } from '@/api/fileApi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GalleryCarousel = ({ files }) => {
    return (
        <Box>
            <Swiper
                cssMode={true}
                navigation={true}
                pagination={{ clickable: true }}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                style={{ borderRadius: 8 }}
            >
                {files.map((file) => (
                    <SwiperSlide key={file.id}>
                        <Paper
                            elevation={3}
                            sx={{
                                height: 500,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                                backgroundColor: '#fafafa',
                            }}
                        >
                            <img
                                src={getImagePreview(file.savedFilename)}
                                alt={file.originalFilename}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </Paper>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default GalleryCarousel;
