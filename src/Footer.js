import { AppBar, Link, Toolbar, Typography } from "@mui/material";

function Footer(){
    return (
        <AppBar
            sx={{position:"fixed",top: "auto", bottom: 0, borderUp: (theme) => `1px solid ${theme.palette.divider}`}}
            elevation={0}
        >
            <Toolbar sx={{ flexWrap: 'wrap' }}>
                <Typography sx={{width: "100%"}} fontSize={14} textAlign="center"> Designed and Developed by <Link underline="none" target="_blank" href="https://ieee-cis-sbc.org">IEEE CIS SBC</Link></Typography>
            </Toolbar> 
        </AppBar>
    )
}

export default Footer