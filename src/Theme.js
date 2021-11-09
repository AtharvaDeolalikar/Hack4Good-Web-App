import { createTheme } from '@mui/material/styles'

const Theme = createTheme({
    palette: {
      mode: 'dark',
      background:{
        paper: "#0a1929"
      }
    },
    typography:{
      fontFamily: "Poppins"
    }
});

export default Theme