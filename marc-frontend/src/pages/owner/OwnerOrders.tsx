import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Paper, Alert,
} from "@mui/material";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchOrders } from "../../redux/actions/orderActions";
import { Project, User, formatMoney } from "../../lib/types";

const statusColor = (status: string) => {
  if (status === "approved" || status === "ordered" || status === "delivered") return "#2e7d32";
  if (status === "rejected" || status === "cancelled") return "#dc3545";
  return "#ed6c02";
};

const projectName = (p: Project | string | null | undefined) => {
  if (!p) return "(deleted project)";
  if (typeof p === "string") return "(unresolved)";
  return p.projectName;
};

const userName = (u: User | string | null | undefined) => {
  if (!u) return "—";
  if (typeof u === "string") return "(unresolved)";
  return u.name;
};

const OwnerOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { materialOrders, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  return (
    <Box>
      <Typography className="section-title" variant="h5">Material Orders</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4b0082, #6a1b9a)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Order ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Project</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Requested By</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Est. Cost</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Approved By</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!materialOrders || materialOrders.length === 0) && (
              <TableRow><TableCell colSpan={7} align="center">No orders</TableCell></TableRow>
            )}
            {(materialOrders || []).map((o) => (
              <TableRow key={o._id} hover>
                <TableCell sx={{ fontFamily: "monospace" }}>
                  {(o.orderId || "").slice(0, 8) || "—"}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{projectName(o.project)}</TableCell>
                <TableCell>{userName(o.requestedBy)}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatMoney(o.estimatedCost)}</TableCell>
                <TableCell>
                  <Chip
                    label={o.status} size="small"
                    sx={{ background: statusColor(o.status), color: "#fff", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>{userName(o.approvedBy)}</TableCell>
                <TableCell>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default OwnerOrders;
