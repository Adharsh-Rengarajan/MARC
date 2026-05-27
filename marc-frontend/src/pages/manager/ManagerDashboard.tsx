import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Card, CardContent, CardActions, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Alert,
} from "@mui/material";
import { LocationOn, Construction, Engineering, AccountBalance } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProject, fetchProjects } from "../../redux/actions/projectActions";
import { fetchTaskPlan, saveTaskPlan } from "../../redux/actions/taskActions";
import { createOrder, fetchProjectOrders } from "../../redux/actions/orderActions";
import { Project, MATERIAL_KEYS, emptyMaterials, formatMoney, User } from "../../lib/types";
import ProgressBar from "../../components/ProgressBar";

const sanitizeDays = (days: any[]) =>
  days.map((d) => ({
    dayNumber: d.dayNumber, label: d.label,
    tasks: d.tasks.map(({ title, description, dueDate, status, isImportant }: any) => ({
      title, description, dueDate, status, isImportant,
    })),
  }));

const userName = (u: User | string) => (typeof u === "string" ? "—" : u?.name || "—");

const ManagerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: projects, current } = useSelector((state: RootState) => state.projects);
  const { plan } = useSelector((state: RootState) => state.tasks);
  const { materialOrders, error: orderError } = useSelector((state: RootState) => state.orders);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [dayInput, setDayInput] = useState("");
  const [taskInputs, setTaskInputs] = useState<Record<number, string>>({});
  const [materials, setMaterials] = useState(emptyMaterials());
  const [localError, setLocalError] = useState("");

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const openProject = (p: Project) => {
    setSelectedId(p._id);
    setTab(0);
    setLocalError("");
    setMaterials(emptyMaterials());
    dispatch(fetchProject(p._id));
    dispatch(fetchTaskPlan(p._id));
    dispatch(fetchProjectOrders(p._id));
  };

  const selected = current && current._id === selectedId ? current : null;

  const handleAddDay = async () => {
    if (!selected || !dayInput) return;
    const cur = plan?.days || [];
    const next = [...sanitizeDays(cur), { dayNumber: cur.length + 1, label: dayInput, tasks: [] }];
    await dispatch(saveTaskPlan(selected._id, next));
    setDayInput("");
  };

  const handleAddTask = async (dayNumber: number) => {
    if (!selected) return;
    const title = taskInputs[dayNumber];
    if (!title) return;
    const next = (plan?.days || []).map((d) => {
      const base = { dayNumber: d.dayNumber, label: d.label };
      const tasks = d.tasks.map(({ title: t, description, dueDate, status, isImportant }) => ({
        title: t, description, dueDate, status, isImportant,
      }));
      if (d.dayNumber !== dayNumber) return { ...base, tasks };
      return {
        ...base,
        tasks: [...tasks, { title, description: "", dueDate: null, status: "pending", isImportant: false }],
      };
    });
    await dispatch(saveTaskPlan(selected._id, next));
    setTaskInputs({ ...taskInputs, [dayNumber]: "" });
  };

  const handleRequestOrder = async () => {
    if (!selected) return;
    const total = MATERIAL_KEYS.reduce((s, k) => s + materials[k], 0);
    if (total === 0) {
      setLocalError("Request at least one material");
      return;
    }
    setLocalError("");
    try {
      await dispatch(createOrder(selected._id, materials));
      setMaterials(emptyMaterials());
      dispatch(fetchProject(selected._id));
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const estimatedCost = selected
    ? MATERIAL_KEYS.reduce((s, k) => s + materials[k] * (selected.unitCost?.[k] || 0), 0)
    : 0;

  return (
    <Box>
      <Navbar title="Manager" />
      <Box className="role-page">
        <Typography className="role-header" component="h1">My Projects</Typography>

        <Box className="cards-grid">
          {projects.length === 0 && (
            <Typography sx={{ color: "#4b0082" }}>No projects assigned yet.</Typography>
          )}
          {projects.map((p) => (
            <Card key={p._id} className="purple-card">
              <CardContent>
                <Typography className="purple-card-title">{p.projectName}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}>
                  <LocationOn fontSize="small" sx={{ color: "#6a1b9a" }} />
                  <Typography variant="body2" sx={{ color: "#555" }}>{p.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Chip label={p.status} size="small" sx={{ background: "#8a2be2", color: "#fff", fontWeight: 600 }} />
                </Box>
                <ProgressBar
                  label="Budget Used"
                  used={p.spent || 0}
                  total={p.budget || 0}
                  formatter={formatMoney}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  onClick={() => openProject(p)}
                  sx={{
                    background: "#8a2be2", color: "#fff", fontWeight: 700, px: 3,
                    "&:hover": { background: "#6a1b9a" },
                  }}
                >
                  Open
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        <Dialog open={!!selected} onClose={() => setSelectedId(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ background: "#4b0082", color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
            <Construction /> {selected?.projectName}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Tabs
              value={tab} onChange={(_, v) => setTab(v)}
              TabIndicatorProps={{ style: { background: "#8a2be2", height: 3 } }}
              sx={{ "& .Mui-selected": { color: "#8a2be2 !important" } }}
            >
              <Tab icon={<Engineering />} iconPosition="start" label="Task Plan" />
              <Tab icon={<AccountBalance />} iconPosition="start" label="Material Orders" />
            </Tabs>

            {tab === 0 && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    size="small" fullWidth label="Day label (e.g. Day 1 — Excavation)"
                    value={dayInput} onChange={(e) => setDayInput(e.target.value)}
                  />
                  <Button
                    variant="contained" onClick={handleAddDay}
                    sx={{ background: "#8a2be2", "&:hover": { background: "#6a1b9a" } }}
                  >
                    Add Day
                  </Button>
                </Box>
                {(plan?.days || []).map((d) => (
                  <Card key={d.dayNumber} sx={{ mb: 1.5, border: "1px solid #e0c3fc" }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#4b0082" }}>
                        Day {d.dayNumber} {d.label && `· ${d.label}`}
                      </Typography>
                      {d.tasks.map((t) => (
                        <Box key={t._id} sx={{ ml: 1, mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip label={t.status} size="small" />
                          <Typography>{t.title}</Typography>
                        </Box>
                      ))}
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <TextField
                          size="small" placeholder="New task" fullWidth
                          value={taskInputs[d.dayNumber] || ""}
                          onChange={(e) => setTaskInputs({ ...taskInputs, [d.dayNumber]: e.target.value })}
                        />
                        <Button
                          size="small" variant="outlined" onClick={() => handleAddTask(d.dayNumber)}
                          sx={{ color: "#6a1b9a", borderColor: "#6a1b9a" }}
                        >
                          Add
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {tab === 1 && selected && (
              <Box sx={{ mt: 2 }}>
                <Card sx={{ mb: 2, border: "1px solid #e0c3fc", background: "rgba(106,27,154,0.03)" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "#4b0082", fontWeight: 700, mb: 1 }}>
                      Project Status
                    </Typography>
                    <ProgressBar
                      label="Budget"
                      used={selected.spent || 0}
                      total={selected.budget || 0}
                      formatter={formatMoney}
                    />
                    {MATERIAL_KEYS.map((m) => {
                      const inFlight = (selected.requested?.[m] || 0) + (selected.delivered?.[m] || 0);
                      return (
                        <ProgressBar
                          key={m}
                          label={m}
                          used={inFlight}
                          total={selected.allocation?.[m] || 0}
                        />
                      );
                    })}
                  </CardContent>
                </Card>

                <Typography variant="subtitle1" sx={{ mb: 1, color: "#4b0082", fontWeight: 700 }}>
                  Request Materials
                </Typography>
                {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
                {orderError && !localError && <Alert severity="error" sx={{ mb: 2 }}>{orderError}</Alert>}

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
                  {MATERIAL_KEYS.map((m) => {
                    const allocated = selected.allocation?.[m] || 0;
                    const inFlight = (selected.requested?.[m] || 0) + (selected.delivered?.[m] || 0);
                    const available = Math.max(0, allocated - inFlight);
                    return (
                      <TextField
                        key={m} size="small" label={m} type="number"
                        value={materials[m]}
                        onChange={(e) => setMaterials({ ...materials, [m]: Number(e.target.value) })}
                        helperText={`Available: ${available}`}
                        error={materials[m] > available}
                        inputProps={{ max: available, min: 0 }}
                      />
                    );
                  })}
                </Box>
                <Typography sx={{ mt: 2, color: "#4b0082", fontWeight: 600 }}>
                  Estimated Cost: {formatMoney(estimatedCost)} (Budget remaining: {formatMoney((selected.budget || 0) - (selected.spent || 0))})
                </Typography>
                <Button
                  variant="contained" sx={{ mt: 2, background: "#8a2be2", "&:hover": { background: "#6a1b9a" } }}
                  onClick={handleRequestOrder}
                >
                  Submit Request
                </Button>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: "#4b0082", fontWeight: 700 }}>
                  My Requests
                </Typography>
                {materialOrders.length === 0 && <Typography color="text.secondary">No requests yet</Typography>}
                {materialOrders.map((o) => (
                  <Card key={o._id} sx={{ mb: 1, border: "1px solid #e0c3fc" }}>
                    <CardContent sx={{ py: "12px !important" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography sx={{ fontFamily: "monospace" }}>{(o.orderId || "").slice(0, 8)}</Typography>
                          <Typography variant="caption" sx={{ color: "#555" }}>
                            Est. cost: {formatMoney(o.estimatedCost)}
                          </Typography>
                        </Box>
                        <Chip label={o.status} size="small" />
                      </Box>
                      {o.status === "rejected" && o.rejectionReason && (
                        <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                          Reason: {o.rejectionReason}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedId(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
