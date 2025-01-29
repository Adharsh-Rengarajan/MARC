import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store/store"; // adjust the path as needed
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  getProjects,
  getOrders,
  placeOrder,
} from "../../redux/actions/accountActions";
import "./PurchaseComponent.scss";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
type RootState = {
  order: {
    orders: Order[];
    projects: Project[];
    loading: boolean;
    error: string | null;
  };
};

type Project = {
  _id: string;
  projectName: string;
  projectValue: number;
};

type Order = {
  ManagerOrderid: string;
  projectName: string;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
};

const PurchaseComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, projects, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedManagerOrder, setSelectedManagerOrder] = useState<string>("");
  const [orderData, setOrderData] = useState<Order>({
    ManagerOrderid: "",
    projectName: "",
    bricks: 0,
    steel: 0,
    cement: 0,
    coarseAggregate: 0,
    fineAggregate: 0,
  });

  // Fetch projects and orders on component mount
  useEffect(() => {
    dispatch(getProjects());
    dispatch(getOrders());
  }, [dispatch]);

  // Handle Project Selection
  const handleProjectChange = (e: SelectChangeEvent<string>) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);

    const selectedProject = projects.find(
      (project) => project._id === projectId
    );
    if (selectedProject) {
      setOrderData((prev) => ({
        ...prev,
        projectName: selectedProject.projectName,
      }));
    }
  };

  // Handle Manager Order ID Selection
  const handleManagerOrderChange = (e: SelectChangeEvent<string>) => {
    const orderId = e.target.value;
    setSelectedManagerOrder(orderId);

    const selectedOrder = orders.find(
      (order) => order.ManagerOrderid === orderId
    );
    if (selectedOrder) {
      setOrderData(selectedOrder);

      const associatedProject = projects.find(
        (project) => project.projectName === selectedOrder.projectName
      );

      if (associatedProject) {
        setSelectedProject(associatedProject._id);
      }
    }
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  // Get selected project value from projectName
  const selectedProjectValue =
    projects.find((project) => project.projectName === orderData.projectName)
      ?.projectValue || 0;

  // Handle placing the order
  const placeOrderHandler = () => {
    // Ensure projectName is selected and included in the payload
    if (orderData.projectName && selectedManagerOrder) {
      dispatch(placeOrder(orderData)); // Dispatch the placeOrder action with the order data
      alert("Order placed successfully!");
    } else {
      alert("Please select a project and manager order ID.");
    }
  };

  return (
    <Box className="purchase-container">
      <Box className="purchase-background">
        <Box className="purchase-form">
          <IconButton
            className="close-button"
            onClick={() => navigate("/accountant-dashboard")}
            aria-label={t("accountant.purchase.close")}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" gutterBottom>
            {t("accountant.purchase.title")}
          </Typography>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Project Name Dropdown */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>{t("accountant.purchase.projectName")}</InputLabel>
            <Select
              name="projectName"
              value={selectedProject}
              onChange={handleProjectChange}
            >
              <MenuItem value="">
                <em>{t("accountant.purchase.selectProject")}</em>
              </MenuItem>
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.projectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Manager Order ID Dropdown */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>{t("accountant.purchase.managerOrderId")}</InputLabel>
            <Select
              name="ManagerOrderid"
              value={selectedManagerOrder}
              onChange={handleManagerOrderChange}
            >
              <MenuItem value="">
                <em>{t("accountant.purchase.selectManagerOrder")}</em>
              </MenuItem>
              {orders.map((order) => (
                <MenuItem
                  key={order.ManagerOrderid}
                  value={order.ManagerOrderid}
                >
                  {order.ManagerOrderid}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Project Value */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1">
              {t("accountant.purchase.projectValue")}
            </Typography>
            <Typography variant="h6">
              {formatCurrency(selectedProjectValue)}
            </Typography>
          </Box>

          {/* Other Order Inputs */}
          {[
            "bricks",
            "steel",
            "cement",
            "coarseAggregate",
            "fineAggregate",
          ].map((field) => (
            <TextField
              key={field}
              fullWidth
              margin="normal"
              label={t(`accountant.purchase.materials.${field}`)}
              type="number"
              name={field}
              value={orderData[field as keyof Order]}
              InputProps={{ readOnly: true }}
            />
          ))}

          {/* Place Order Button */}
          <Box sx={{ textAlign: "center", marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={placeOrderHandler}
              disabled={!selectedManagerOrder || !orderData.projectName}
            >
              {t("accountant.purchase.placeOrder")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseComponent;
