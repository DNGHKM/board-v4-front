import {Button} from "@mui/material";

const SubmitButton = ({onSubmit, onCancel}) => {
    return (
        <div className="d-flex justify-content-end mt-3 gap-2">
            <Button
                type="button"
                variant="contained"
                sx={{ minWidth: 90 }}
                style={{backgroundColor: '#808080', color: '#fff'}}
                onClick={onCancel}
            >
                취소
            </Button>
            <Button
                type="button"
                variant="contained"
                color="success"
                sx={{ minWidth: 90 }}
                onClick={onSubmit}
            >
                등록
            </Button>
        </div>
    );
};

export default SubmitButton;
