import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTasks } from "../../../redux/actions/managerTasksActions";
import { updateTaskStatus } from "../../../redux/actions/engineerTasksActions";
import TaskModal from "./TaskModal";
import ReportModal from "./ReportModal";
import EngineerHeader from "./EngineerHeader";
import "./projectdetails.scss";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  RunCircle as InProgressIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import NavBar from "../../../components/Navbar";
import { useTranslation } from "react-i18next";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: "pending" | "in-progress" | "completed";
  flag: boolean;
}

interface Project {
  _id: string;
  project: string;
  days: { day: string; tasks: Task[] }[];
}

const ProjectDetails: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tasks, loading, error } = useSelector(
    (state: any) => state.managerTasks
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks());
    }
  }, [dispatch, projectId]);

  const project = tasks.find((task: any) => task._id === projectId);

  if (loading) return <div>{t("loading")}</div>;
  if (error)
    return (
      <div>
        {t("error")}: {error}
      </div>
    );
  if (!project) return <div>{t("projectNotFound")}</div>;

  const handleTileClick = (task: Task) => {
    setSelectedTask(task);
    setCheckboxChecked(task.flag);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalSubmit = (status: string, flag: boolean) => {
    if (selectedTask) {
      dispatch(updateTaskStatus(selectedTask._id, status, flag)).then(() => {
        const updatedTasks = tasks.map((day: any) => {
          return {
            ...day,
            tasks: day.tasks.map((task: Task) => {
              if (task._id === selectedTask._id) {
                return { ...task, status, flag };
              }
              return task;
            }),
          };
        });
        project.days = updatedTasks;
        setIsTaskModalOpen(false);
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxChecked(e.target.checked);
  };

  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setIsReportModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <CompletedIcon sx={{ fontSize: "small", color: "success.main" }} />
        );
      case "in-progress":
        return (
          <InProgressIcon sx={{ fontSize: "small", color: "info.main" }} />
        );
      default:
        return (
          <PendingIcon sx={{ fontSize: "small", color: "warning.main" }} />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in-progress":
        return "info";
      default:
        return "warning";
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const filteredTasks = (dayTasks: Task[]) => {
    switch (selectedTab) {
      case 0:
        return dayTasks;
      case 1:
        return dayTasks.filter((task) => task.status === "pending");
      case 2:
        return dayTasks.filter((task) => task.status === "in-progress");
      case 3:
        return dayTasks.filter((task) => task.status === "completed");
      default:
        return dayTasks;
    }
  };

  return (
    <>
      <NavBar title="MARC" />
      <Box sx={{ p: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="primary"
          variant="fullWidth"
          className="tabContainer"
        >
          <Tab
            label={t("engineerComponent.ALLTASKS")}
            className="tab allTasks"
          />
          <Tab label={t("engineerComponent.PENDING")} className="tab pending" />
          <Tab
            label={t("engineerComponent.INPROGRESS")}
            className="tab inProgress"
          />
          <Tab
            label={t("engineerComponent.COMPLETED")}
            className="tab completed"
          />
        </Tabs>

        {project.days.map((day) => (
          <Box key={day.day} sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" component="h2" color="primary.main">
                {t("engineerComponent.DAY", { date: day.day })}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {filteredTasks(day.tasks).map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task._id}>
                  <Card
                    onClick={() => handleTileClick(task)}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{ fontWeight: "medium", flex: 1, mr: 2 }}
                        >
                          {task.title}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(task.status)}
                          label={t(
                            `engineerComponent.${
                              task.status === "in-progress"
                                ? "INPROGRESS"
                                : task.status.toUpperCase()
                            }`
                          )}
                          color={getStatusColor(task.status)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <DescriptionIcon
                          sx={{
                            mr: 1,
                            mt: 0.5,
                            color: "text.secondary",
                            fontSize: "small",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {task.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        task={selectedTask}
        status={selectedTask ? selectedTask.status : "pending"}
        flag={checkboxChecked}
        onSubmit={handleModalSubmit}
        onCheckboxChange={handleCheckboxChange}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleReportModalClose}
        engineerName={"Adharsh"}
        projectName={project.project}
        onSubmit={(reportData) => {
          console.log("Report generated:", reportData);
          handleReportModalClose();
        }}
      />

      <button onClick={handleGenerateReport} className="generateButton">
        {t("Generate Report")}
      </button>
    </>
  );
};

export default ProjectDetails;
