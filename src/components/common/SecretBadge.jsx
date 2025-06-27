import {Chip} from '@mui/material';

const NewBadge = () => {
    return (
        <Chip
            label="비밀글"
            sx={{
                backgroundColor: '#A52A2A',
                color: '#fff',
                fontSize: '0.65rem',
                height: 20,
                width: 55,
                padding: '0px',
                fontWeight: 'bold'
            }}
        />
    );
};

export default NewBadge;
