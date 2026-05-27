import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./taskmodal.scss";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  status: string;
  flag: boolean;
  onSubmit: (status: string, flag: boolean) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  status,
  flag,
  onSubmit,
  onCheckboxChange,
}) => {
  const [taskStatus, setTaskStatus] = useState(status);

  const { t } = useTranslation();

  useEffect(() => {
    if (task) {
      setTaskStatus(task.status);
    }
  }, [task]);

  const handleSubmit = () => {
    if (task) {
      onSubmit(taskStatus, flag);
      window.location.reload();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} className="task-modal">
      <Box className="modal-box">
        <Typography variant="h4" className="modal-title">
          {t("Task Details")}
        </Typography>
        {task ? (
          <>
            <Typography variant="h6" className="task-title">
              {task.title}
            </Typography>
            <Typography variant="body1" className="task-description">
              {task.description}
            </Typography>

            <FormControl fullWidth className="status-select">
              <InputLabel id="status-label">{t("Status")}</InputLabel>
              <Select
                labelId="status-label"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <MenuItem value="pending">{t("Pending")}</MenuItem>
                <MenuItem value="in-progress">{t("In Progress")}</MenuItem>
                <MenuItem value="completed">{t("Completed")}</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={flag}
                  onChange={onCheckboxChange}
                  color="primary"
                />
              }
              label={t("Mark as Important")}
              className="checkbox-container"
            />

            <Box className="button-group">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {t("Update Task")}
              </Button>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                {t("Close")}
              </Button>
            </Box>
          </>
        ) : (
          <Alert severity="error">{t("No task details available.")}</Alert>
        )}
      </Box>
    </Modal>
  );
};

export default TaskModal;
