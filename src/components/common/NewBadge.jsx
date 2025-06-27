import {Chip} from '@mui/material';

const NewBadge = () => {
    return (
        <Chip
            label="NEW"
            sx={{
                backgroundColor: '#A52A2A',
                color: '#fff',
                fontSize: '0.65rem',
                height: 20,
                width: 50,
                padding: '0px',
                fontWeight: 'bold'
            }}
        />
    );
};

export default NewBadge;
