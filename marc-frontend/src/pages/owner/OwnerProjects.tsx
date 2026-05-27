import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Button, Card, CardContent, CardActions, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Grid, Chip, IconButton,
  Alert, Divider, Tab, Tabs,
} from "@mui/material";
import { Archive, Edit, LocationOn, Construction } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProjects, createProject, updateProject, archiveProject } from "../../redux/actions/projectActions";
import { fetchUsers } from "../../redux/actions/userActions";
import { Project, User, MATERIAL_KEYS, emptyMaterials, formatMoney } from "../../lib/types";
import ProgressBar from "../../components/ProgressBar";

const emptyForm = {
  projectName: "", manager: "", engineer: "", accountant: "",
  budget: 0, location: "", status: "planning",
  allocation: emptyMaterials(),
  unitCost: emptyMaterials(),
};

const statusColor = (status: string) => {
  if (status === "active") return "#2e7d32";
  if (status === "planning") return "#1976d2";
  if (status === "completed") return "#9e9e9e";
  if (status === "archived") return "#616161";
  return "#ed6c02";
};

const userName = (u: User | string | undefined | null) =>
  !u ? "—" : typeof u === "string" ? u : u.name;

const OwnerProjects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: projects, error } = useSelector((state: RootState) => state.projects);
  const { list: users } = useSelector((state: RootState) => state.users);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState(0);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchProjects(true));
    dispatch(fetchUsers());
  }, [dispatch]);

  const activeUsers = users.filter((u) => u.isActive);
  const managers = activeUsers.filter((u) => u.role === "manager");
  const engineers = activeUsers.filter((u) => u.role === "engineer");
  const accountants = activeUsers.filter((u) => u.role === "accountant");

  const openCreate = () => {
    setForm(emptyForm);
    setLocalError("");
    setTab(0);
    setCreateOpen(true);
  };

  const openEdit = (p: Project) => {
    setForm({
      projectName: p.projectName,
      manager: typeof p.manager === "string" ? p.manager : p.manager?.id || "",
      engineer: typeof p.engineer === "string" ? p.engineer : p.engineer?.id || "",
      accountant: typeof p.accountant === "string" ? p.accountant : p.accountant?.id || "",
      budget: p.budget,
      location: p.location,
      status: p.status,
      allocation: { ...emptyMaterials(), ...p.allocation },
      unitCost: { ...emptyMaterials(), ...p.unitCost },
    });
    setEditing(p);
    setLocalError("");
    setTab(0);
  };

  const handleSubmit = async () => {
  const missing: string[] = [];
  if (!form.projectName.trim()) missing.push("Project Name");
  if (!form.location.trim()) missing.push("Location");
  if (!form.manager) missing.push("Manager");
  if (!form.engineer) missing.push("Engineer");
  if (!form.accountant) missing.push("Accountant");
  if (!form.budget || form.budget <= 0) missing.push("Budget");

  if (missing.length) {
    setLocalError(`Please fill in: ${missing.join(", ")}`);
    setTab(0);
    return;
  }

  setSubmitting(true);
  setLocalError("");
  try {
    if (editing) {
      await dispatch(updateProject(editing._id, form));
      setEditing(null);
    } else {
      await dispatch(createProject(form));
      setCreateOpen(false);
    }
    setForm(emptyForm);
  } catch (e) {
    setLocalError((e as Error).message);
  } finally {
    setSubmitting(false);
  }
};
  const handleArchive = async (id: string) => {
    if (!confirm("Archive this project? It will be hidden from active lists but its history is preserved.")) return;
    try {
      await dispatch(archiveProject(id));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const dialogOpen = createOpen || !!editing;
  const closeDialog = () => {
    setCreateOpen(false);
    setEditing(null);
    setLocalError("");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography className="section-title" variant="h5" sx={{ m: 0 }}>All Projects</Typography>
        <Button
          variant="contained" onClick={openCreate}
          sx={{
            background: "#8a2be2", fontWeight: 700, textTransform: "uppercase",
            "&:hover": { background: "#6a1b9a" },
          }}
        >
          New Project
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box className="cards-grid" sx={{ justifyContent: "flex-start !important" }}>
        {projects.length === 0 && (
          <Typography color="text.secondary">No projects yet — create the first one.</Typography>
        )}
        {projects.map((p) => (
          <Card
            key={p._id}
            className="purple-card"
            sx={{ opacity: p.isArchived ? 0.6 : 1 }}
          >
            <CardContent>
              <Typography className="purple-card-title">{p.projectName}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}>
                <LocationOn fontSize="small" sx={{ color: "#6a1b9a" }} />
                <Typography variant="body2" sx={{ color: "#555" }}>{p.location}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                <Chip
                  label={p.status} size="small"
                  sx={{ background: statusColor(p.status), color: "#fff", fontWeight: 600 }}
                />
              </Box>
              <Box sx={{ px: 1.5, py: 1, background: "rgba(106,27,154,0.05)", borderRadius: 1, mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
                  <Typography variant="caption" sx={{ color: "#555" }}>Manager</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{userName(p.manager)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
                  <Typography variant="caption" sx={{ color: "#555" }}>Engineer</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{userName(p.engineer)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
                  <Typography variant="caption" sx={{ color: "#555" }}>Accountant</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{userName(p.accountant)}</Typography>
                </Box>
              </Box>
              <ProgressBar
                label="Budget"
                used={p.spent || 0}
                total={p.budget || 0}
                formatter={formatMoney}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 2, gap: 1 }}>
              {!p.isArchived && (
                <>
                  <Button
                    size="small" startIcon={<Edit />} onClick={() => openEdit(p)}
                    sx={{ color: "#6a1b9a", fontWeight: 600 }}
                  >
                    Edit
                  </Button>
                  <IconButton onClick={() => handleArchive(p._id)} size="small" sx={{ color: "#dc3545" }}>
                    <Archive fontSize="small" />
                  </IconButton>
                </>
              )}
              {p.isArchived && (
                <Chip label="Archived" size="small" sx={{ background: "#616161", color: "#fff" }} />
              )}
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: "#4b0082", color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
          <Construction /> {editing ? `Edit · ${editing.projectName}` : "Create Project"}
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Tabs
            value={tab} onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { background: "#8a2be2" } }}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="Basic Info" />
            <Tab label="Material Allocation" />
            <Tab label="Unit Costs ($)" />
          </Tabs>

          {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}

          {tab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Project Name" value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Location" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select fullWidth label="Manager (active only)" value={form.manager}
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                  helperText={managers.length === 0 ? "No active managers" : ""}
                >
                  {managers.map((u) => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select fullWidth label="Engineer (active only)" value={form.engineer}
                  onChange={(e) => setForm({ ...form, engineer: e.target.value })}
                  helperText={engineers.length === 0 ? "No active engineers" : ""}
                >
                  {engineers.map((u) => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select fullWidth label="Accountant (active only)" value={form.accountant}
                  onChange={(e) => setForm({ ...form, accountant: e.target.value })}
                  helperText={accountants.length === 0 ? "No active accountants" : ""}
                >
                  {accountants.map((u) => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth label="Budget ($)" type="number" value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                  helperText={editing ? `Already spent: ${formatMoney(editing.spent)}` : ""}
                />
              </Grid>
              {editing && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    select fullWidth label="Status" value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <MenuItem value="planning">Planning</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="on-hold">On Hold</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                </Grid>
              )}
            </Grid>
          )}

          {tab === 1 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
                Max units of each material that can ever be ordered for this project.
                Cannot lower below already-committed quantities.
              </Typography>
              <Grid container spacing={2}>
                {MATERIAL_KEYS.map((m) => (
                  <Grid item xs={6} sm={4} key={m}>
                    <TextField
                      fullWidth label={m} type="number" value={form.allocation[m]}
                      onChange={(e) => setForm({
                        ...form,
                        allocation: { ...form.allocation, [m]: Number(e.target.value) },
                      })}
                      helperText={editing ? `In flight: ${(editing.requested?.[m] || 0) + (editing.delivered?.[m] || 0)}` : ""}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
                Cost per unit (dollars). Used to compute estimated cost of material orders.
              </Typography>
              <Grid container spacing={2}>
                {MATERIAL_KEYS.map((m) => (
                  <Grid item xs={6} sm={4} key={m}>
                    <TextField
                      fullWidth label={`${m} ($/unit)`} type="number" value={form.unitCost[m]}
                      onChange={(e) => setForm({
                        ...form,
                        unitCost: { ...form.unitCost, [m]: Number(e.target.value) },
                      })}
                    />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ color: "#4b0082", fontWeight: 600 }}>
                Total allocation cost at current unit prices: {formatMoney(
                  MATERIAL_KEYS.reduce((s, m) => s + form.allocation[m] * form.unitCost[m], 0)
                )}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || managers.length === 0 || engineers.length === 0 || accountants.length === 0}
            sx={{ background: "#8a2be2", "&:hover": { background: "#6a1b9a" } }}
          >
            {editing ? "Save Changes" : "Create"}
        </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerProjects;
