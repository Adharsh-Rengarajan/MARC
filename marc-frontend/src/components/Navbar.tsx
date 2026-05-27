import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../redux/store/store";
import { logout } from "../redux/actions/authActions";

interface Props {
  title: string;
}

const Navbar = ({ title }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #4b0082 0%, #6a1b9a 50%, #8a2be2 100%)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}
        >
          MARC · {title}
        </Typography>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={user.role.toUpperCase()}
              size="small"
              sx={{ background: "#e0c3fc", color: "#4b0082", fontWeight: 700 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.name}</Typography>
            <Button
              onClick={handleLogout}
              sx={{
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.4)",
                "&:hover": { background: "rgba(255,255,255,0.15)" },
              }}
            >
              {t("common.logout")}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
