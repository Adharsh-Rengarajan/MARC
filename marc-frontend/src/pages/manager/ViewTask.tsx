import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
} from "@mui/material";
import { fetchTasks } from "../../redux/actions/managerTasksActions";
import "../../pages/manager/viewtask.scss";
import { AppDispatch } from "../../redux/store/store";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher"; // Import the LanguageSwitcher

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  flag: boolean;
  day?: string;
  taskNumber?: number;
}

interface Day {
  day: string;
  tasks: Task[];
}

interface TaskGroup {
  days: Day[];
}

interface RootState {
  managerTasks: {
    loading: boolean;
    tasks: TaskGroup[];
    error: string | null;
  };
}

const ViewTask: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { projectName,email } = location.state || {};
  const { loading, tasks, error } = useSelector(
    (state: RootState) => state.managerTasks
  );

  const [searchTitle, setSearchTitle] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<TaskGroup[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleNavigation = (path: string) => {
    navigate(path, { state: { projectName,email } });
  };

  useEffect(() => {
    if (tasks.length > 0) {
      const filtered = tasks
        .map((taskGroup) => ({
          ...taskGroup,
          days: taskGroup.days.map((day) => ({
            ...day,
            tasks: day.tasks.filter((task) => {
              const matchesTitle = task.title
                .toLowerCase()
                .includes(searchTitle.toLowerCase());
              const matchesStatus = filterStatus
                ? task.status === filterStatus
                : true;
              return matchesTitle && matchesStatus;
            }),
          })),
        }))
        .filter((taskGroup) =>
          taskGroup.days.some((day) => day.tasks.length > 0)
        );
      setFilteredTasks(filtered);
    }
  }, [tasks, searchTitle, filterStatus]);

  const paginatedTasks = filteredTasks
    .flatMap((taskGroup) =>
      taskGroup.days.flatMap((day) =>
        day.tasks.map((task) => ({
          ...task,
          day: day.day,
        }))
      )
    )
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <Box className="view-task-container">
      <Box className="filters-section" sx={{ m: 2 }}>
        <Paper className="filters-paper"  sx={{padding: 2 }}>
          <Typography variant="h6" className="filters-title">
            {t("ViewTasks.filters.title")}
          </Typography>
          <TextField
            fullWidth
            label={t("ViewTasks.filters.searchByTitle")}
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="filter-field"
            sx={{ mb: 2  }}
          />
          <FormControl fullWidth className="filter-field">
            <InputLabel>{t("ViewTasks.filters.status")}</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label={t("ViewTasks.filters.status")}
            >
              <MenuItem value="">{t("ViewTasks.filters.statusAll")}</MenuItem>
              <MenuItem value="pending">
                {t("ViewTasks.filters.statusPending")}
              </MenuItem>
              <MenuItem value="completed">
                {t("ViewTasks.filters.statusCompleted")}
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            className="clear-filters-btn"
            variant="contained"
            fullWidth
            onClick={() => {
              setSearchTitle("");
              setFilterStatus("");
              setCurrentPage(1);
            }}
            sx={{ mt: 2 }}
          >
            {t("ViewTasks.filters.clearFilters")}
          </Button>
        </Paper>
      </Box>

      {/* Language Switcher */}
      <Box
        className="language-switcher"
        style={{ position: "absolute", top: "10px", right: "20px" }}
      >
        <LanguageSwitcher />
      </Box>

      <Box className="content">
        <Typography className="header">{t("ViewTasks.title")}</Typography>
        <Button
          className="back-btn"
          variant="outlined"
          onClick={() => handleNavigation("/manager")}
          sx={{ mb: 3 }}
        >
          {t("ViewTasks.backToManager")}
        </Button>

        {error && (
          <Typography variant="h6" className="error-message">
            {t("ViewTasks.error", { message: error })}
          </Typography>
        )}

        {loading && (
          <Box className="loading-indicator">
            <CircularProgress />
          </Box>
        )}

        {!loading && paginatedTasks.length > 0 && (
          <>
            <TableContainer
              component={Paper}
              className="table-container"
              sx={{
                maxHeight: "600px",
                overflow: "auto",
                border: "1px solid #ddd",
                minWidth: "700px",
                mb: 3,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("ViewTasks.table.day")}</TableCell>
                    <TableCell>{t("ViewTasks.table.title")}</TableCell>
                    <TableCell>{t("ViewTasks.table.description")}</TableCell>
                    <TableCell>{t("ViewTasks.table.status")}</TableCell>
                    <TableCell>{t("ViewTasks.table.finalStatus")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task.day}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={!task.flag}
                          disabled
                          title={
                            task.flag
                              ? t("ViewTasks.filters.statusPending")
                              : t("ViewTasks.filters.statusCompleted")
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Pagination
              sx={{ mt: 3, display: "flex", justifyContent: "center" }}
              count={Math.ceil(
                filteredTasks.flatMap((group) =>
                  group.days.flatMap((day) => day.tasks)
                ).length / rowsPerPage
              )}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
            />
          </>
        )}

        {!loading && paginatedTasks.length === 0 && (
          <Typography className="no-tasks-message">
            {t("ViewTasks.noTasks")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ViewTask;
