import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700 }}>404</Typography>
      <Typography>Page not found</Typography>
      <Button variant="contained" onClick={() => navigate("/login")}>Go to login</Button>
    </Box>
  );
};

export default NotFound;
