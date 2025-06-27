import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const MuiPagination = ({ board, currentPage, totalPages, basePath }) => {
    const router = useRouter();

    const handleChange = (event, page) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page);

        router.push({
            pathname: board ? `/${basePath}/${board.boardId}/list` : `/${basePath}/list`,
            query: Object.fromEntries(params.entries()),
        });
    };

    return (
        <div className="d-flex justify-content-center mt-4 mb-5">
            {totalPages > 1 ? (
                <Stack spacing={3}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handleChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            ) : (
                <div style={{ height: "56px" }} />
            )}
        </div>
    );
};

export default MuiPagination;
