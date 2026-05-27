import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

interface Title {
  text: string;
}

const EngineerHeader: React.FC<Title> = ({ text }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex" } }}
          >
            {t("engineer.header.title", { text })}
          </Typography>
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default EngineerHeader;
