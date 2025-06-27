import {useRouter} from "next/router";
import {Button} from "@mui/material";

const SearchButtons = ({url}) => {
    const router = useRouter();
    return (
        <div className="col-auto d-flex gap-2">
            <Button
                type="submit"
                variant="contained"
                color="primary"
            >
                검색
            </Button>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                    router.push(url);
                }}>초기화
            </Button>
        </div>
    )
}
export default SearchButtons