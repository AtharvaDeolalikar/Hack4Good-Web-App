import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from './Contexts/AuthContext';
import NavBar from './Navbar';
import Footer from './Footer';


function Submission(){
    const context = useContext(AuthContext)
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if(!context.team){
            context.showAlert("info", "You should create or join a team first in order to make submissions!")
            context.navigate("/team")
        }
    }, [context])

    return (
        <>  
        <NavBar />
            <Box sx={{ borderBottom: 1, mt:{xs:7, sm:8}, borderColor: 'divider', bgcolor : "#0a1929"}}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab component={Link} to="/Submissions/" label="Rounds" />
                    <Tab component={Link} to="/Submissions/Round-1" label="Round - 1" />
                    <Tab component={Link} to="/Submissions/Round-2" label="Round - 2" />
                </Tabs>
            </Box>
            <Outlet />
            <Footer />
        </>
    )
}

export default Submission