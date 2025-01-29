import React, { useState, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducer/loginSlice";
import LanguageSwitcher from "./LanguageSwitcher";
import "./NavBar.scss";
import { useTranslation } from "react-i18next";

interface NavBarProps {
  title: string;
}
const NavBar: React.FC<NavBarProps> = (navbarProps) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box className="navbar-container">
      <AppBar position="static" className="navbar">
        <Toolbar className="navbar-toolbar">
          <Typography
            variant="h6"
            component="div"
            className="navbar-title"
          >
            {t("navBar.titleMarc")}
          </Typography>

          <Box className="navbar-buttons">
            <LanguageSwitcher />
            {navbarProps.title === "owner" ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/owner-dashboard"
                  className="navbar-btn"
                >
                  {t("navBar.Dashboard")}
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/owner-dashboard/create-project"
                  className="navbar-btn"
                >
                {t("navBar.CreateProject")}       
              </Button>
              </>
            ) : null}


            <Button
              color="inherit"
              onClick={handleLogout}
              className="navbar-btn"
            >
               {t("navBar.Logout")}     
            </Button>
          </Box>

          <Box className="navbar-menu-icon">
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              className="navbar-menu"
            >
              {navbarProps.title === "owner" ? (<>
                <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/owner-dashboard/"
              >
                {t("navBar.Dashboard")}
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/owner-dashboard/create-project"
              >
                {t("navBar.CreateProject")}
              </MenuItem>
              </>) : null}
              
              <MenuItem onClick={handleLogout}>
              {t("navBar.Logout")}   
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
