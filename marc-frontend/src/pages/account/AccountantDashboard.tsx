// AccountantDashboard.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Fugu capability to copy order
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // For charts
import { getProjects, getOrders } from "../../redux/actions/accountActions";
import "./accountantdashboard.scss";
import { RootState, AppDispatch } from "../../redux/store/store"; // adjust the path as needed
import LogoutIcon from "@mui/icons-material/Logout";
import Snackbar from "@mui/material/Snackbar";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import NavBar from "../../components/Navbar";

const AccountantDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize useNavigate
  const { orders, projects, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const { t } = useTranslation();

  // Add state for Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // Copy order details to clipboard
  const copyOrderDetails = async (order: any) => {
    try {
      const text = `Order ID: ${order.ManagerOrderid}
  Bricks: ${order.bricks}
  Steel: ${order.steel}
  Cement: ${order.cement}
  Coarse Aggregate: ${order.coarseAggregate}
  Fine Aggregate: ${order.fineAggregate}`;

      await navigator.clipboard.writeText(text);
      setOpenSnackbar(true); // Show success message
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    dispatch(getOrders());
    dispatch(getProjects());
  }, [dispatch]);

  // Prepare chart data with null check
  const chartData = Array.isArray(orders)
    ? orders.map((order) => ({
        orderId: order.ManagerOrderid,
        bricks: order.bricks,
        steel: order.steel,
        cement: order.cement,
        coarseAggregate: order.coarseAggregate,
        fineAggregate: order.fineAggregate,
      }))
    : [];

  // Navigate to the PurchaseComponent on button click
  const handlePlaceOrderClick = () => {
    navigate("/place-order");
  };

  const handleLogout = () => {
    // Clear any stored user data/tokens
    localStorage.removeItem("userRole");
    // Navigate to login page
    navigate("/");
  };

  return (
    <>
    <NavBar title="accountant"/>
    <Box className="accountant-dashboard" sx={{ padding: 3 }}>
      
      {/* Loading Indicator */}
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
      ) : error ? (
        <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
          Error: {error}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Displaying Projects */}
          <Grid size={{ xs: 12 }} spacing={3}>
            <Typography className="header" variant="h1" gutterBottom>
              <h1>{t("accountant.dashboard.projects")}</h1>
            </Typography>
            <Grid className="projects-section" container spacing={3}>
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project._id}>
                    <Card>
                      <CardHeader title={project.projectName} />
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t("accountant.dashboard.projectDetails.manager")}:
                          </strong>{" "}
                          {project.manager}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t("accountant.dashboard.projectDetails.engineer")}:
                          </strong>{" "}
                          {project.engineer}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t(
                              "accountant.dashboard.projectDetails.projectValue"
                            )}
                            :
                          </strong>{" "}
                          {project.projectValue}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textAlign: "center", width: "100%" }}
                >
                  {t("accountant.dashboard.noProjects")}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Displaying Orders */}
          <Grid size={{ xs: 12 }}>
            <Typography className="header" variant="h6" gutterBottom>
              <h1>{t("accountant.dashboard.orders")}</h1>
            </Typography>
            <Grid className="orders-section" container spacing={3}>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order._id}>
                    <Card
                      sx={{
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        boxShadow: 3,
                      }}
                    >
                      <CardHeader
                        title={`${t(
                          "accountant.dashboard.orderDetails.orderId"
                        )}: ${order.ManagerOrderid}`}
                      />
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t("accountant.dashboard.orderDetails.bricks")}:
                          </strong>{" "}
                          {order.bricks}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t("accountant.dashboard.orderDetails.steel")}:
                          </strong>{" "}
                          {order.steel}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t("accountant.dashboard.orderDetails.cement")}:
                          </strong>{" "}
                          {order.cement}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t(
                              "accountant.dashboard.orderDetails.coarseAggregate"
                            )}
                            :
                          </strong>{" "}
                          {order.coarseAggregate}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>
                            {t(
                              "accountant.dashboard.orderDetails.fineAggregate"
                            )}
                            :
                          </strong>{" "}
                          {order.fineAggregate}
                        </Typography>
                        <IconButton
                          onClick={() => copyOrderDetails(order)}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textAlign: "center", width: "100%" }}
                >
                  {t("accountant.dashboard.noOrders")}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Button to navigate to Purchase Component */}
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrderClick}
            >
              {t("accountant.dashboard.placeOrder")}
            </Button>
          </Grid>

          {/* Chart: Example of Orders by Material */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              {t("accountant.dashboard.orderMaterialsChart")}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="orderId" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bricks" stroke="#8884d8" />
                <Line type="monotone" dataKey="steel" stroke="#82ca9d" />
                <Line type="monotone" dataKey="cement" stroke="#ff7300" />
                <Line
                  type="monotone"
                  dataKey="coarseAggregate"
                  stroke="#ff00ff"
                />
                <Line
                  type="monotone"
                  dataKey="fineAggregate"
                  stroke="#ff0000"
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      )}
      {/* <Button
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "8px 16px",
          fontSize: "0.875rem",
          minWidth: "120px",
          zIndex: 1100,
        }}
      >
        {t("accountant.dashboard.logout")}
      </Button> */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message={t("accountant.dashboard.orderCopied")}
      />
    </Box>
    </>
    
  );
};

export default AccountantDashboard;
