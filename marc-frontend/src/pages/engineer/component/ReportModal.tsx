import React, { useState } from "react";
import "../sass/main.scss";
import { useDispatch } from "react-redux";
import { createReport } from "../../../redux/actions/engineerTasksActions";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
} from "@mui/material";



interface ReportModalProps {
  projectName: String;
  engineerName: String;
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, projectName, engineerName }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    engineerName: engineerName,
    engineerId: "",
    projectName: projectName,
    projectId: "",
    bricks: 0,
    steel: 0,
    cement: 0,
    sand: 0,
    coarseAggregate: 0,
    fineAggregate: 0,
    description: "",
    progress: 0,
    issues: "",
    resolutions: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "progress" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch createReport with formData
    dispatch(createReport(formData));

    // Close the modal after submitting the report
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md">
      <DialogTitle>Generate Report</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="form">
          <Grid container spacing={3}>
            {/* Engineer details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Engineer Name"
                name="engineerName"
                value={engineerName}
                InputProps={{ readOnly: true }}
                variant="filled"
                className="readonly-field"
              />
            </Grid>

            {/* Project details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={projectName}
                InputProps={{ readOnly: true }}
                variant="filled"
                className="readonly-field"
              />
            </Grid>

            {/* Material inputs */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bricks"
                type="number"
                name="bricks"
                value={formData.bricks}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Steel"
                type="number"
                name="steel"
                value={formData.steel}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cement"
                type="number"
                name="cement"
                value={formData.cement}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sand"
                type="number"
                name="sand"
                value={formData.sand}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Coarse Aggregate"
                type="number"
                name="coarseAggregate"
                value={formData.coarseAggregate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fine Aggregate"
                type="number"
                name="fineAggregate"
                value={formData.fineAggregate}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Progress and additional details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Progress (%)"
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Issues"
                name="issues"
                multiline
                minRows={3}
                value={formData.issues}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resolutions"
                name="resolutions"
                multiline
                minRows={3}
                value={formData.resolutions}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
          Submit Report
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
