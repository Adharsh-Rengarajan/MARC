import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Chip, IconButton, Switch, Paper, Alert,
} from "@mui/material";
import { Delete, PersonAdd } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../redux/actions/userActions";

const emptyForm = { email: "", password: "", name: "", role: "manager" };

const roleColor = (role: string) => {
  if (role === "owner") return "#4b0082";
  if (role === "manager") return "#8a2be2";
  if (role === "engineer") return "#1976d2";
  return "#ed6c02";
};

const OwnerUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: users, error } = useSelector((state: RootState) => state.users);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setLocalError("");
    try {
      await dispatch(createUser(form));
      setOpen(false);
      setForm(emptyForm);
    } catch (e) {
      setLocalError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await dispatch(updateUser(id, { isActive: !isActive }));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await dispatch(deleteUser(id));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography className="section-title" variant="h5" sx={{ m: 0 }}>Team Members</Typography>
        <Button
          variant="contained" startIcon={<PersonAdd />} onClick={() => setOpen(true)}
          sx={{
            background: "#8a2be2", fontWeight: 700, textTransform: "uppercase",
            "&:hover": { background: "#6a1b9a" },
          }}
        >
          Add User
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4b0082, #6a1b9a)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Active</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">No users</TableCell></TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id} hover sx={{ opacity: u.isActive ? 1 : 0.55 }}>
                <TableCell sx={{ fontWeight: 500 }}>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip
                    label={u.role} size="small"
                    sx={{ background: roleColor(u.role), color: "#fff", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={u.isActive}
                    onChange={() => handleToggleActive(u.id, u.isActive)}
                    disabled={u.role === "owner"}
                    sx={{
                      "& .Mui-checked": { color: "#8a2be2" },
                      "& .Mui-checked + .MuiSwitch-track": { background: "#8a2be2 !important" },
                    }}
                  />
                </TableCell>
                <TableCell>
                  {u.role !== "owner" && (
                    <IconButton onClick={() => handleDelete(u.id)} size="small" sx={{ color: "#dc3545" }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: "#4b0082", color: "#fff" }}>Add User</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
          <TextField fullWidth margin="normal" label="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth margin="normal" label="Email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth margin="normal" label="Password" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField select fullWidth margin="normal" label="Role" value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="engineer">Engineer</MenuItem>
            <MenuItem value="accountant">Accountant</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained" onClick={handleSubmit} disabled={submitting}
            sx={{ background: "#8a2be2", "&:hover": { background: "#6a1b9a" } }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerUsers;
