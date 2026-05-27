import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProjects } from "../../redux/actions/projectActions";
import { fetchUsers } from "../../redux/actions/userActions";
import { fetchOrders } from "../../redux/actions/orderActions";
import { formatMoney } from "../../lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface KpiProps { label: string; value: string | number; }

const KpiCard = ({ label, value }: KpiProps) => (
  <Card
    sx={{
      border: "1px solid #8a2be2", borderRadius: "12px",
      background: "linear-gradient(135deg, #fdfdfd, #e6e6fa)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" },
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      <Typography variant="body2" sx={{ color: "#555", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: "#4b0082" }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const OwnerOverview = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: projects } = useSelector((state: RootState) => state.projects);
  const { list: users } = useSelector((state: RootState) => state.users);
  const { materialOrders } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers());
    dispatch(fetchOrders());
  }, [dispatch]);

  const activeProjects = projects.filter((p) => !p.isArchived);
  const totalBudget = useMemo(
    () => activeProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
    [activeProjects]
  );
  const totalSpent = useMemo(
    () => activeProjects.reduce((sum, p) => sum + (p.spent || 0), 0),
    [activeProjects]
  );
  const activeOrders = useMemo(
    () => materialOrders.filter((o) => ["requested", "approved", "ordered"].includes(o.status)).length,
    [materialOrders]
  );

  const chartData = useMemo(() => {
    const statusCounts = activeProjects.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: "Projects by Status",
        data: Object.values(statusCounts),
        backgroundColor: ["#8a2be2", "#6a1b9a", "#e0c3fc", "#9c27b0", "#4b0082"],
        borderRadius: 8,
      }],
    };
  }, [activeProjects]);

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><KpiCard label="Active Projects" value={activeProjects.length} /></Grid>
        <Grid item xs={12} sm={6} md={3}><KpiCard label="Team Members" value={users.filter((u) => u.isActive).length} /></Grid>
        <Grid item xs={12} sm={6} md={3}><KpiCard label="Open Orders" value={activeOrders} /></Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard label="Spend / Budget" value={`${formatMoney(totalSpent)} / ${formatMoney(totalBudget)}`} />
        </Grid>
      </Grid>
      <Box className="panel">
        <Typography className="section-title" variant="h5">Project Status Distribution</Typography>
        {activeProjects.length > 0 ? (
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        ) : (
          <Typography color="text.secondary">No projects yet</Typography>
        )}
      </Box>
    </Box>
  );
};

export default OwnerOverview;
