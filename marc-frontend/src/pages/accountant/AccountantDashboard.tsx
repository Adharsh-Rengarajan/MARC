import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip,
  Button, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Paper, Alert,
} from "@mui/material";
import { CheckCircle, Cancel, ShoppingCart, LocalShipping } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  fetchOrders, approveOrder, rejectOrder, placePurchaseOrder,
  fetchPurchaseOrders, markDelivered,
} from "../../redux/actions/orderActions";
import { MaterialOrder, Project, User, formatMoney, MATERIAL_KEYS } from "../../lib/types";

const statusColor = (s: string) => {
  if (s === "requested") return "#ed6c02";
  if (s === "approved") return "#1976d2";
  if (s === "rejected" || s === "cancelled") return "#dc3545";
  if (s === "ordered" || s === "delivered") return "#2e7d32";
  return "#9e9e9e";
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

const AccountantDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { materialOrders, purchaseOrders, error } = useSelector((state: RootState) => state.orders);
  const [tab, setTab] = useState(0);
  const [purchaseTarget, setPurchaseTarget] = useState<MaterialOrder | null>(null);
  const [vendorForm, setVendorForm] = useState({
    name: "", contact: "", address: "", totalCost: 0, trackingNumber: "",
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const handleApprove = async (orderId: string) => {
    try { await dispatch(approveOrder(orderId)); } catch (e) { alert((e as Error).message); }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("Reason for rejection?") || "";
    try { await dispatch(rejectOrder(orderId, reason)); } catch (e) { alert((e as Error).message); }
  };

  const handleMarkDelivered = async (purchaseOrderId: string) => {
    if (!confirm("Mark this PO as delivered? Inventory will be updated on the project.")) return;
    try {
      await dispatch(markDelivered(purchaseOrderId));
      dispatch(fetchOrders());
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handlePurchase = async () => {
    if (!purchaseTarget) return;
    setLocalError("");
    try {
      await dispatch(placePurchaseOrder(purchaseTarget.orderId, {
        vendor: { name: vendorForm.name, contact: vendorForm.contact, address: vendorForm.address },
        tracking: { trackingNumber: vendorForm.trackingNumber, estimatedDelivery: null },
        totalCost: vendorForm.totalCost,
      }));
      setPurchaseTarget(null);
      setVendorForm({ name: "", contact: "", address: "", totalCost: 0, trackingNumber: "" });
      dispatch(fetchOrders());
      dispatch(fetchPurchaseOrders());
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const pending = (materialOrders || []).filter((o) => o.status === "requested");
  const approved = (materialOrders || []).filter((o) => o.status === "approved");

  const headerCell = { color: "#fff", fontWeight: 700 };
  const headerRow = { background: "linear-gradient(90deg, #4b0082, #6a1b9a)" };

  return (
    <Box>
      <Navbar title="Accountant" />
      <Box className="role-page">
        <Typography className="role-header" component="h1">Accountant Dashboard</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box
          sx={{
            background: "#fff", borderRadius: "10px", mb: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)", px: 2,
          }}
        >
          <Tabs
            value={tab} onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { background: "#8a2be2", height: 3 } }}
            sx={{
              "& .MuiTab-root": { fontWeight: 700, color: "#4b0082", textTransform: "uppercase" },
              "& .Mui-selected": { color: "#8a2be2 !important" },
            }}
          >
            <Tab label={`Pending (${pending.length})`} />
            <Tab label={`Approved (${approved.length})`} />
            <Tab label={`Purchase Orders (${(purchaseOrders || []).length})`} />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={headerRow}>
                  <TableCell sx={headerCell}>Order ID</TableCell>
                  <TableCell sx={headerCell}>Project</TableCell>
                  <TableCell sx={headerCell}>Requested By</TableCell>
                  <TableCell sx={headerCell}>Materials</TableCell>
                  <TableCell sx={headerCell}>Est. Cost</TableCell>
                  <TableCell sx={headerCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pending.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center">No pending orders</TableCell></TableRow>
                )}
                {pending.map((o) => (
                  <TableRow key={o._id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>{(o.orderId || "").slice(0, 8)}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{projectName(o.project)}</TableCell>
                    <TableCell>{userName(o.requestedBy)}</TableCell>
                    <TableCell>
                      {MATERIAL_KEYS.filter((k) => (o.materials?.[k] || 0) > 0)
                        .map((k) => `${k}:${o.materials[k]}`).join(", ")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{formatMoney(o.estimatedCost)}</TableCell>
                    <TableCell>
                      <IconButton sx={{ color: "#2e7d32" }} onClick={() => handleApprove(o.orderId)}>
                        <CheckCircle />
                      </IconButton>
                      <IconButton sx={{ color: "#dc3545" }} onClick={() => handleReject(o.orderId)}>
                        <Cancel />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {tab === 1 && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={headerRow}>
                  <TableCell sx={headerCell}>Order ID</TableCell>
                  <TableCell sx={headerCell}>Project</TableCell>
                  <TableCell sx={headerCell}>Materials</TableCell>
                  <TableCell sx={headerCell}>Est. Cost</TableCell>
                  <TableCell sx={headerCell}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approved.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center">No approved orders</TableCell></TableRow>
                )}
                {approved.map((o) => (
                  <TableRow key={o._id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>{(o.orderId || "").slice(0, 8)}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{projectName(o.project)}</TableCell>
                    <TableCell>
                      {MATERIAL_KEYS.filter((k) => (o.materials?.[k] || 0) > 0)
                        .map((k) => `${k}:${o.materials[k]}`).join(", ")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{formatMoney(o.estimatedCost)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained" startIcon={<ShoppingCart />}
                        onClick={() => {
                          setPurchaseTarget(o);
                          setVendorForm({ ...vendorForm, totalCost: o.estimatedCost });
                        }}
                        sx={{ background: "#8a2be2", "&:hover": { background: "#6a1b9a" } }}
                      >
                        Place Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {tab === 2 && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={headerRow}>
                  <TableCell sx={headerCell}>PO ID</TableCell>
                  <TableCell sx={headerCell}>Project</TableCell>
                  <TableCell sx={headerCell}>Vendor</TableCell>
                  <TableCell sx={headerCell}>Total</TableCell>
                  <TableCell sx={headerCell}>Status</TableCell>
                  <TableCell sx={headerCell}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(!purchaseOrders || purchaseOrders.length === 0) && (
                  <TableRow><TableCell colSpan={6} align="center">No purchase orders</TableCell></TableRow>
                )}
                {(purchaseOrders || []).map((po) => (
                  <TableRow key={po._id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>{(po.purchaseOrderId || "").slice(0, 8)}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{projectName(po.project)}</TableCell>
                    <TableCell>{po.vendor?.name}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{formatMoney(po.totalCost)}</TableCell>
                    <TableCell>
                      <Chip
                        label={po.status} size="small"
                        sx={{ background: statusColor(po.status), color: "#fff", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {po.status !== "delivered" && po.status !== "cancelled" && (
                        <Button
                          size="small" startIcon={<LocalShipping />}
                          onClick={() => handleMarkDelivered(po.purchaseOrderId)}
                          sx={{ color: "#2e7d32", fontWeight: 600 }}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Dialog open={!!purchaseTarget} onClose={() => setPurchaseTarget(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ background: "#4b0082", color: "#fff" }}>Place Purchase Order</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
            <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
              Estimated cost: <strong>{formatMoney(purchaseTarget?.estimatedCost)}</strong>
            </Typography>
            <TextField fullWidth margin="normal" label="Vendor Name" value={vendorForm.name}
              onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })} />
            <TextField fullWidth margin="normal" label="Vendor Contact" value={vendorForm.contact}
              onChange={(e) => setVendorForm({ ...vendorForm, contact: e.target.value })} />
            <TextField fullWidth margin="normal" label="Vendor Address" value={vendorForm.address}
              onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })} />
            <TextField fullWidth margin="normal" label="Total Cost ($)" type="number" value={vendorForm.totalCost}
              onChange={(e) => setVendorForm({ ...vendorForm, totalCost: Number(e.target.value) })} />
            <TextField fullWidth margin="normal" label="Tracking Number" value={vendorForm.trackingNumber}
              onChange={(e) => setVendorForm({ ...vendorForm, trackingNumber: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPurchaseTarget(null)}>Cancel</Button>
            <Button
              variant="contained" onClick={handlePurchase}
              sx={{ background: "#8a2be2", "&:hover": { background: "#6a1b9a" } }}
            >
              Place
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AccountantDashboard;
