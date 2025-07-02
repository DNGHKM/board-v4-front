'use client';

import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";
import {Fab} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const GoToWritePageButton = ({path}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleClick = () => {
        const query = Object.fromEntries(searchParams.entries());
        router.push({
            pathname: path,
            query: query,
        });
    };

    return (
        <div className="text-end my-4">
            <Fab
                color="success"
                aria-label="edit"
                onClick={handleClick}
            >
                <EditIcon/>
            </Fab>
        </div>
    );
}

export default GoToWritePageButton;
