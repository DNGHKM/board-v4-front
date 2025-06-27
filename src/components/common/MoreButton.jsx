import {Button} from "@mui/material";

const MoreButton = () => {
    return (
        <Button
            variant="outlined"
            size="small"
            sx={{
                color: 'black',
                borderColor: 'black',
                '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
            }}
        >
            더보기 +
        </Button>
    )
}
export default MoreButton