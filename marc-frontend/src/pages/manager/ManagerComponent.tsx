import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher"; // Adjust the import path
import "../../pages/manager/manager.scss";
import NavBar from "../../components/Navbar";

const Manager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { projectName,email } = location.state || {};
  
  const handleNavigation = (path: string) => {
    navigate(path, { state: { projectName,email } });
  };

  return (
    <div className="manager-container">
      <Button
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 20px",
          background: "#6a0dad",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          textTransform: "uppercase",
          zIndex: 10,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            background: "#5e0090",
          },
        }}
        onClick={() => navigate("/managerProjects",{ state: { email: email } })}
      >
        {t("managerComponent.common.back")}
      </Button>

      <Typography className="manager-header">
        {t("managerComponent.dashboard.selectedProject", {
          name:
            projectName || t("managerComponent.dashboard.noProjectSelected"),
        })}
      </Typography>

      <div className="manager-cards">
        <Card className="manager-card" elevation={3}>
          <CardContent>
            <Typography variant="h5" className="manager-card-title">
              {t("managerComponent.dashboard.cards.createTasks.title")}
            </Typography>
            <Typography variant="body2" className="manager-card-description">
              {t("managerComponent.dashboard.cards.createTasks.description")}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              className="manager-card-button"
              onClick={() => handleNavigation("/managertasks")}
            >
              {t("managerComponent.dashboard.cards.createTasks.button")}
            </Button>
          </CardActions>
        </Card>

        <Card className="manager-card" elevation={3}>
          <CardContent>
            <Typography variant="h5" className="manager-card-title">
              {t("managerComponent.dashboard.cards.viewTasks.title")}
            </Typography>
            <Typography variant="body2" className="manager-card-description">
              {t("managerComponent.dashboard.cards.viewTasks.description")}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              className="manager-card-button"
              onClick={() => handleNavigation("/view-tasks")}
            >
              {t("managerComponent.dashboard.cards.viewTasks.button")}
            </Button>
          </CardActions>
        </Card>

        <Card className="manager-card" elevation={3}>
          <CardContent>
            <Typography variant="h5" className="manager-card-title">
              {t("managerComponent.dashboard.cards.reports.title")}
            </Typography>
            <Typography variant="body2" className="manager-card-description">
              {t("managerComponent.dashboard.cards.reports.description")}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              className="manager-card-button"
              onClick={() => handleNavigation("/reports")}
            >
              {t("managerComponent.dashboard.cards.reports.button")}
            </Button>
          </CardActions>
        </Card>
      </div>

      {/* Replace with LanguageSwitcher */}
      <div
        className="language-switcher-container"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
        }}
      >
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Manager;
