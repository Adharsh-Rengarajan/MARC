import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTasks } from "../../../redux/actions/managerTasksActions";
import NavBar from "../../../components/Navbar";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Divider,
  Box,
  Grid,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import "./EngineerComponent.scss";
import { useTranslation } from "react-i18next";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: "pending" | "in-progress" | "completed";
  flag: boolean;
}

interface Day {
  day: string;
  tasks: Task[];
  _id: string;
}

interface Project {
  _id: string;
  project: string;
  days: Day[];
  createdAt: string;
  updatedAt: string;
}

interface ManagerState {
  tasks: Project[];
  loading: boolean;
  error: string | null;
}

interface EngineerProp {
  email: string;
}

const EngineerComponent: React.FC<EngineerProp> = ({ email }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const { tasks, loading, error }: ManagerState = useSelector(
    (state: any) => state.managerTasks
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) {
    return <div>{t("loading")}</div>;
  }

  if (error) {
    return <div>{t("error")}: {error}</div>;
  }

  const getTaskCountsByStatus = (days: Day[]) => {
    return days.reduce(
      (counts, day) => {
        day.tasks.forEach((task) => {
          if (task.status in counts) {
            counts[task.status]++;
          }
        });
        return counts;
      },
      {
        pending: 0,
        "in-progress": 0,
        completed: 0,
      }
    );
  };

  const handleCardClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <>
      <NavBar title="MARC" />
      <Grid container spacing={3}>
        {tasks.map((project) => {
          const taskCounts = getTaskCountsByStatus(project.days);
          const totalTasks = taskCounts.pending + taskCounts["in-progress"] + taskCounts.completed;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card
                onClick={() => handleCardClick(project._id)}
                className="projectCard"
              >
                <CardContent className="cardContent">
                  <Box className="cardHeader">
                    <AssignmentIcon className="icon" />
                    <Typography
                      variant="h5"
                      component="div"
                      className="projectTitle"
                    >
                      {project.project}
                    </Typography>
                  </Box>

                  <Divider className="divider" />

                  <Box className="taskCounts">
                    <Typography variant="subtitle2" className="statusTitle">
                      {t("engineerComponent.taskCount", { count: totalTasks })}
                    </Typography>
                    <Box className="statusContainer">
                      <Typography className={`status pending`}>
                        {t("engineerComponent.pending", { pendingCount: taskCounts["pending"] })}
                      </Typography>
                      <Typography className={`status inProgress`}>
                        {t("engineerComponent.in-progress", { progressCount: taskCounts["in-progress"] })}
                      </Typography>
                      <Typography className={`status completed`}>
                        {t("engineerComponent.completed", { completedCount: taskCounts["completed"] })}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="lastUpdated">
                    <CalendarIcon className="icon smallIcon" />
                    <Typography variant="body2" color="text.secondary">
                      {t("engineerComponent.lastUpdated", {
                        date: new Date(project.updatedAt).toLocaleDateString(),
                      })}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions className="cardFooter">
                  <Button
                    size="small"
                    endIcon={<ArrowIcon />}
                    className="goToProjectButton"
                  >
                    {t("engineerComponent.goToProject")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default EngineerComponent;