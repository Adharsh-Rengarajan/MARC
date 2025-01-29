import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEngineerUpdate, placeOrder } from '../../redux/actions/managerTasksActions';
import {
  Box,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Modal,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import "../../pages/manager/report.scss";
import { AppDispatch } from "../../redux/store/store";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher"; // Import the LanguageSwitcher component
import NavBar from '../../components/Navbar';

// Define types for the state
interface OrderDetails {
  ManagerOrderid: string;
  project: string;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
}

interface EngineerUpdate {
  engineerName: string;
  projectName: string;
  engineerId: string;
  projectId: string;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
  reports: Array<{
    date: string;
    description: string;
    progress: number;
    issues: string;
    resolutions: string;
  }>;
}

interface Order {
  orderId: string;
  project: string;
  ManagerOrderid: string;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
  details: string;
}

// Function to generate Manager Order ID
const generateManagerOrderId = (): string => {
  return `MO-${new Date().getTime()}`;
};

const ReportComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projectName,email } = location.state || {};  // projectName passed from the previous screen
  const { engineerUpdates } = useSelector((state: any) => state.managerTasks);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    ManagerOrderid: generateManagerOrderId(),
    project: projectName || '', // Set projectName from location state
    bricks: 0,
    steel: 0,
    cement: 0,
    coarseAggregate: 0,
    fineAggregate: 0,
  });
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchEngineerUpdate());
  }, [dispatch]);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => setActiveTab(newValue);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!orderDetails.project) errors.project = 'Project name is required!';
    if (orderDetails.bricks <= 0) errors.bricks = 'Bricks quantity must be greater than zero!';
    if (orderDetails.steel <= 0) errors.steel = 'Steel quantity must be greater than zero!';
    if (orderDetails.cement <= 0) errors.cement = 'Cement quantity must be greater than zero!';
    if (orderDetails.coarseAggregate <= 0) errors.coarseAggregate = 'Coarse Aggregate quantity must be greater than zero!';
    if (orderDetails.fineAggregate <= 0) errors.fineAggregate = 'Fine Aggregate quantity must be greater than zero!';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateOrderId = (): string => {
    return `ORD-${new Date().getTime()}`;
  };

  const handleSubmitOrder = () => {
    if (!validateForm()) return;

    const orderData: Order = {
      orderId: generateOrderId(),
      ManagerOrderid: orderDetails.ManagerOrderid,
      project: orderDetails.project, // Use project name instead of projectId
      bricks: orderDetails.bricks,
      steel: orderDetails.steel,
      cement: orderDetails.cement,
      coarseAggregate: orderDetails.coarseAggregate,
      fineAggregate: orderDetails.fineAggregate,
      details: "Order details", // Set this value based on your requirements
    };

    dispatch(placeOrder(orderData));

    setOrderSuccess(true);
    handleModalClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path, { state: { projectName,email } }); // Pass projectName in state
  };

  const renderTable = (columns: string[], data: Record<string, any>[]) => (
    <Box className="table-container">
      <Paper className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={`${index}-${col}`}>{row[col]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Paper>
    </Box>
  );

  const tabContent = [
    {
      label: t("reportsComponent.overview"),
      columns: ['Engineer Name', 'Project Name', 'Bricks', 'Steel', 'Cement', 'Coarse Aggregate', 'Fine Aggregate'],
      data: engineerUpdates.map((update: EngineerUpdate) => ({
        'Engineer Name': update.engineerName || 'N/A',
        'Project Name': update.projectName || 'N/A',
        Bricks: update.bricks || 0,
        Steel: update.steel || 0,
        Cement: update.cement || 0,
        'Coarse Aggregate': update.coarseAggregate || 0,
        'Fine Aggregate': update.fineAggregate || 0,
      })),
    },
    {
      label: t("reportsComponent.materials"),
      columns: ['Material', 'Quantity'],
      data: ['bricks', 'steel', 'cement', 'coarseAggregate', 'fineAggregate'].map((material: string) => ({
        Material: material.toUpperCase(),
        Quantity: engineerUpdates.reduce((total: number, update: EngineerUpdate) => total + (update[material] || 0), 0),
      })),
    },
    {
      label: t("reportsComponent.reports"),
      columns: ['Date', 'Description', 'Progress', 'Issues', 'Resolutions'],
      data: engineerUpdates.flatMap((update: EngineerUpdate) =>
        update.reports.map((report: any) => ({
          Date: new Date(report.date).toLocaleDateString(),
          Description: report.description || 'N/A',
          Progress: `${report.progress || 0}%`,
          Issues: report.issues || 'N/A',
          Resolutions: report.resolutions || 'N/A',
        }))
      ),
    },
  ];

  return (
    <>
    <NavBar  title='manager'/>
    <Box className="report-container">
      
      <Box className="header">
        <IconButton
          onClick={() => handleNavigation("/manager")}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">{t("reportsComponent.title")}</Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        <Tab label={t("reportsComponent.overview")} />
        <Tab label={t("reportsComponent.materials")} />
        <Tab label={t("reportsComponent.title")} />
      </Tabs>

        {renderTable(tabContent[activeTab].columns, tabContent[activeTab].data)}

        <Button
          variant="contained"
          color="primary"
          onClick={handleModalOpen}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {t("reportsComponent.placeOrder.button")}
        </Button>

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box className="modal-content">
    <Typography variant="h6" className="modal-title">
      {t("reportsComponent.placeOrder.modalTitle")}
    </Typography>
    <form>
      <Grid container spacing={2} direction="column" alignItems="stretch">
        <Grid item xs={12}>
          <TextField
            name="project"
            label="Project Name"
            value={orderDetails.project}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="ManagerOrderid"
            label="Manager Order ID"
            value={orderDetails.ManagerOrderid}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="bricks"
            label={t("reportsComponent.placeOrder.fields.bricks")}
            type="number"
            fullWidth
            value={orderDetails.bricks}
            onChange={handleInputChange}
            error={!!formErrors.bricks}
            helperText={formErrors.bricks}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="steel"
            label={t("reportsComponent.placeOrder.fields.steel")}
            type="number"
            fullWidth
            value={orderDetails.steel}
            onChange={handleInputChange}
            error={!!formErrors.steel}
            helperText={formErrors.stel}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="cement"
            label={t("reportsComponent.placeOrder.fields.cement")}
            type="number"
            fullWidth
            value={orderDetails.cement}
            onChange={handleInputChange}
            error={!!formErrors.cement}
            helperText={formErrors.cement}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="coarseAggregate"
            label={t("reportsComponent.placeOrder.fields.coarseAggregate")}
            type="number"
            fullWidth
            value={orderDetails.coarseAggregate}
            onChange={handleInputChange}
            error={!!formErrors.coarseAggregate}
            helperText={formErrors.coarseAggregate}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="fineAggregate"
            label={t("reportsComponent.placeOrder.fields.fineAggregate")}
            type="number"
            fullWidth
            value={orderDetails.fineAggregate}
            onChange={handleInputChange}
            error={!!formErrors.fineAggregate}
            helperText={formErrors.fineAggregate}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitOrder}
            fullWidth
          >
            {t("reportsComponent.placeOrder.submitOrder")}
          </Button>
        </Grid>
      </Grid>
    </form>
  </Box>
</Modal>


        <Snackbar
          open={orderSuccess}
          autoHideDuration={3000}
          onClose={() => setOrderSuccess(false)}
        >
          <Alert
            onClose={() => setOrderSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {t("reportsComponent.placeOrder.submitOrder")}
          </Alert>
        </Snackbar>
    </Box>
    </>
    
  );
};

export default ReportComponent;
