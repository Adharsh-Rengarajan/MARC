import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/Navbar";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const OwnerDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <NavBar title="owner"/>
      <Box sx={{ padding: 3 }}>
        {/* <Typography variant="h4" sx={{ marginBottom: 3 }}>
          {t("owner.dashboard.title")}
        </Typography> */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default OwnerDashboard;
