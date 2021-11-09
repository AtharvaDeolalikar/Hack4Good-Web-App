import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';


function Submission(props){
    const currentUser = props.authFunctions.currentUser
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab component={Link} to="/Submission/Round-1" label="Round - 1" />
                    <Tab component={Link} to="/Submission/Round-2" label="Round - 2" />
                </Tabs>
            </Box>
            <Outlet />
        </>
    )
}

export default Submission