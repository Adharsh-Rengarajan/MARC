import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Card, CardContent, CardActions, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Tabs, Tab, Alert,
} from "@mui/material";
import { LocationOn, Assignment, Description } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProject, fetchProjects } from "../../redux/actions/projectActions";
import {
  fetchTaskPlan, updateTask, submitReport, fetchReports,
} from "../../redux/actions/taskActions";
import { Project, MATERIAL_KEYS, emptyMaterials } from "../../lib/types";
import ProgressBar from "../../components/ProgressBar";

const EngineerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: projects, current } = useSelector((state: RootState) => state.projects);
  const { plan, reports, error: taskError } = useSelector((state: RootState) => state.tasks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [reportForm, setReportForm] = useState({
    description: "", progress: 0, issues: "", resolutions: "", materialsUsed: emptyMaterials(),
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const openProject = (p: Project) => {
    setSelectedId(p._id);
    setTab(0);
    setLocalError("");
    dispatch(fetchProject(p._id));
    dispatch(fetchTaskPlan(p._id));
    dispatch(fetchReports(p._id));
  };

  const selected = current && current._id === selectedId ? current : null;

  const handleStatusChange = (dayNumber: number, taskId: string, status: string) => {
    if (!plan) return;
    dispatch(updateTask(plan._id, dayNumber, taskId, { status }));
  };

  const handleSubmitReport = async () => {
    if (!selected) return;
    if (!reportForm.description) {
      setLocalError("Description is required");
      return;
    }
    setLocalError("");
    try {
      await dispatch(submitReport(selected._id, reportForm));
      setReportForm({
        description: "", progress: 0, issues: "", resolutions: "", materialsUsed: emptyMaterials(),
      });
      dispatch(fetchProject(selected._id));
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  return (
    <Box>
      <Navbar title="Engineer" />
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
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  <Chip label={p.status} size="small" sx={{ background: "#8a2be2", color: "#fff", fontWeight: 600 }} />
                </Box>
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
          <DialogTitle sx={{ background: "#4b0082", color: "#fff" }}>{selected?.projectName}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Tabs
              value={tab} onChange={(_, v) => setTab(v)}
              TabIndicatorProps={{ style: { background: "#8a2be2", height: 3 } }}
              sx={{ "& .Mui-selected": { color: "#8a2be2 !important" } }}
            >
              <Tab icon={<Assignment />} iconPosition="start" label="Tasks" />
              <Tab icon={<Description />} iconPosition="start" label="Submit Report" />
              <Tab label="My Reports" />
            </Tabs>

            {tab === 0 && (
              <Box sx={{ mt: 2 }}>
                {(plan?.days || []).map((d) => (
                  <Card key={d.dayNumber} sx={{ mb: 1.5, border: "1px solid #e0c3fc" }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#4b0082" }}>
                        Day {d.dayNumber} {d.label && `· ${d.label}`}
                      </Typography>
                      {d.tasks.map((t) => (
                        <Box key={t._id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, ml: 1 }}>
                          <Typography sx={{ flexGrow: 1 }}>{t.title}</Typography>
                          <TextField
                            select size="small" value={t.status}
                            onChange={(e) => handleStatusChange(d.dayNumber, t._id, e.target.value)}
                          >
                            <MenuItem value="pending">pending</MenuItem>
                            <MenuItem value="in-progress">in-progress</MenuItem>
                            <MenuItem value="completed">completed</MenuItem>
                          </TextField>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                ))}
                {(plan?.days || []).length === 0 && <Typography color="text.secondary">No task plan yet</Typography>}
              </Box>
            )}

            {tab === 1 && selected && (
              <Box sx={{ mt: 2 }}>
                <Card sx={{ mb: 2, border: "1px solid #e0c3fc", background: "rgba(106,27,154,0.03)" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "#4b0082", fontWeight: 700, mb: 1 }}>
                      Inventory On Site
                    </Typography>
                    {MATERIAL_KEYS.map((m) => {
                      const delivered = selected.delivered?.[m] || 0;
                      const consumed = selected.consumed?.[m] || 0;
                      return (
                        <ProgressBar
                          key={m}
                          label={m}
                          used={consumed}
                          total={delivered}
                        />
                      );
                    })}
                  </CardContent>
                </Card>

                {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
                {taskError && !localError && <Alert severity="error" sx={{ mb: 2 }}>{taskError}</Alert>}

                <TextField
                  fullWidth margin="normal" label="Description" multiline rows={3}
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                />
                <TextField
                  fullWidth margin="normal" label="Progress (%)" type="number"
                  value={reportForm.progress}
                  onChange={(e) => setReportForm({ ...reportForm, progress: Number(e.target.value) })}
                  inputProps={{ min: 0, max: 100 }}
                />
                <TextField
                  fullWidth margin="normal" label="Issues" value={reportForm.issues}
                  onChange={(e) => setReportForm({ ...reportForm, issues: e.target.value })}
                />
                <TextField
                  fullWidth margin="normal" label="Resolutions" value={reportForm.resolutions}
                  onChange={(e) => setReportForm({ ...reportForm, resolutions: e.target.value })}
                />
                <Typography sx={{ mt: 2, color: "#4b0082", fontWeight: 700 }}>Materials Used Today</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mt: 1 }}>
                  {MATERIAL_KEYS.map((m) => {
                    const onHand = Math.max(0, (selected.delivered?.[m] || 0) - (selected.consumed?.[m] || 0));
                    return (
                      <TextField
                        key={m} size="small" label={m} type="number"
                        value={reportForm.materialsUsed[m]}
                        onChange={(e) => setReportForm({
                          ...reportForm,
                          materialsUsed: { ...reportForm.materialsUsed, [m]: Number(e.target.value) },
                        })}
                        helperText={`On hand: ${onHand}`}
                        error={reportForm.materialsUsed[m] > onHand}
                        inputProps={{ max: onHand, min: 0 }}
                      />
                    );
                  })}
                </Box>
                <Button
                  variant="contained" sx={{ mt: 2, background: "#8a2be2", "&:hover": { background: "#6a1b9a" } }}
                  onClick={handleSubmitReport}
                >
                  Submit Report
                </Button>
              </Box>
            )}

            {tab === 2 && (
              <Box sx={{ mt: 2 }}>
                {reports.length === 0 && <Typography color="text.secondary">No reports yet</Typography>}
                {reports.map((r) => (
                  <Card key={r._id} sx={{ mb: 1, border: "1px solid #e0c3fc" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="subtitle2" sx={{ color: "#4b0082", fontWeight: 700 }}>
                          {new Date(r.date).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={`${r.progress}%`} size="small"
                          sx={{ background: "#8a2be2", color: "#fff" }}
                        />
                      </Box>
                      <Typography sx={{ mt: 1 }}>{r.description}</Typography>
                      {r.issues && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          Issues: {r.issues}
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

export default EngineerDashboard;
