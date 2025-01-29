import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Grid, Card, CardContent, Typography, Modal, Box, TextField, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { fetchTasks, createTask, updateTasksForDay } from "../../redux/actions/managerTasksActions"; 
import { fetchProjects } from "../../redux/actions/projectActions";
import './createtasks.scss';
import { RootState } from "../../redux/store/store";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher"; 

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  flag: boolean;
}

interface TaskDay {
  day: string;
  tasks: Task[];
  isNew?: boolean;
}

const CreateTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { projectName,email } = location.state || {};
  const { tasks, loading, error } = useSelector((state: any) => state.managerTasks);
  const { project } = useSelector((state: RootState) => state.project);
  const [tasksByDay, setTasksByDay] = useState<TaskDay[]>([]);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const [engineerName, setEngineerName] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (project && project.length > 0 && projectName) {
      const matchingProject = project.find((project: any) => project.projectName === projectName);
      if (matchingProject) {
        setEngineerName(matchingProject.engineer);
      }
    }
  }, [project, projectName]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const formattedTasks = tasks.flatMap((taskData: any) =>
        taskData.days.map((day: any) => ({
          day: day.day,
          tasks: day.tasks.map((task: any) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
            flag: task.flag,
          })),
        }))
      );
      setTasksByDay(formattedTasks);
    }
  }, [tasks]);

  const getNextDayNumber = () => {
    const dayNumbers = tasksByDay.map((day) => parseInt(day.day.split(" ")[1], 10));
    const maxDayNumber = Math.max(...dayNumbers, 0);
    return maxDayNumber + 1;
  };

  const handleAddDay = () => {
    const nextDayNumber = getNextDayNumber();
    const newDay = {
      day: `Day ${nextDayNumber}`,
      tasks: Array(5).fill({
        id: "",
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
        flag: false,
      }),
      isNew: true,
    };
    setTasksByDay([...tasksByDay, newDay]);
    setActiveDay(tasksByDay.length);
    setOpenModal(true);
  };

  const handleCardClick = (index: number) => {
    setActiveDay(index);
    setActiveTaskIndex(null);
    setOpenModal(true);
  };

  const validateTasks = () => {
    const tasks = tasksByDay[activeDay!]?.tasks || [];
    return tasks.every((task) => task.title.trim() && task.description.trim());
  };

  const handleSaveAndClose = () => {
    if (validateTasks()) {
      const dayData = {
        day: tasksByDay[activeDay!].day,
        tasks: tasksByDay[activeDay!].tasks.map((task) => ({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          flag: task.flag,
        })),
      };

      const currentDay = tasksByDay[activeDay!];

      if (currentDay.isNew) {
        const payload = {
          project: projectName,
          engineer: engineerName,
          days: [dayData],
        };
        dispatch(createTask(payload));
        
        const updatedDays = [...tasksByDay];
        updatedDays[activeDay!] = { ...updatedDays[activeDay!], isNew: false };
        setTasksByDay(updatedDays);
      } else {
        dispatch(updateTasksForDay(projectName, dayData.day, dayData.tasks));
      }

      closeModal();
    } else {
      alert("All tasks must have a title and description.");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setActiveDay(null);
    setActiveTaskIndex(null);
  };

  const handleSubmit = async () => {
    const payload = tasksByDay.map((day) => ({
      day: day.day,
      tasks: day.tasks.map((task) => ({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        flag: task.flag,
      })),
    }));

    try {
      const response = await axios.post(
        "http://localhost:9000/submitAllTasks",
        { project: projectName, days: payload }
      );
      console.log("All tasks submitted successfully:", response.data);
      alert("All tasks have been submitted.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting all tasks:", error.message);
      } else {
        console.error("An unknown error occurred.");
      }
      alert("Failed to submit tasks. Please try again.");
    }
  };

  const handleDeleteDay = (dayIndex: number) => {
    const updatedDays = tasksByDay.filter((_, index) => index !== dayIndex);
    setTasksByDay(updatedDays);
  };

  const handleNavigation = (path: string) => {
    navigate(path, { state: { projectName,email } });
  };

  const handleTaskChange = (
    dayIndex: number,
    taskIndex: number,
    field: string,
    value: string
  ) => {
    const updatedTasks = [...tasksByDay];
    updatedTasks[dayIndex].tasks[taskIndex] = {
      ...updatedTasks[dayIndex].tasks[taskIndex],
      [field]: value,
    };
    setTasksByDay(updatedTasks);
  };

  return (
    <div className="create-tasks">
      <h2 className="create-tasks__heading">{t('manager.dayWiseTaskManager')}</h2>

      {/* Language Switcher in top right */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <LanguageSwitcher />
      </Box>

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => handleNavigation("/manager")}
        sx={{ mb: 3 }}
      >
       {t('manager.backToManager')}
      </Button>

      <Grid container spacing={2}>
        {tasksByDay?.map((day, index) => (
          <Grid item xs={12} sm={6} md={3} key={day?.day}>
            <Card className="task-card" onClick={() => handleCardClick(index)}>
              <CardContent>
                <Typography variant="h6">{day?.day}</Typography>
                <Typography variant="body2">{day?.tasks.length} Tasks</Typography>
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDay(index);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="task-card add-new-day-card" onClick={handleAddDay}>
            <CardContent>
              <Typography variant="h6">{t('manager.addNewDay')}</Typography>
              <AddIcon />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal
        open={openModal}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 320, sm: 600 },
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {tasksByDay[activeDay!]?.day}
          </Typography>

          {engineerName && (
      <TextField
        label="Allocated to Engineer"
        value={engineerName}
        disabled
        fullWidth
        margin="normal"
        InputLabelProps={{
          style: { fontWeight: "bold" },  
        }}
      />
    )}

          {/* Render Tasks */}
          {tasksByDay[activeDay!]?.tasks?.map((task, taskIndex) => (
            <div key={taskIndex}>
              <TextField
                label="Task Title"
                value={task.title}
                onChange={(e) =>
                  handleTaskChange(activeDay!, taskIndex, "title", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={task.description}
                onChange={(e) =>
                  handleTaskChange(activeDay!, taskIndex, "description", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Due Date"
                type="date"
                value={task.dueDate}
                onChange={(e) =>
                  handleTaskChange(activeDay!, taskIndex, "dueDate", e.target.value)
                }
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          ))}

          <Button onClick={handleSaveAndClose} variant="contained" sx={{ mt: 2 }}>
            Save Day Tasks
          </Button>
        </Box>
      </Modal>

      {/* <Button variant="contained" color="secondary" onClick={handleSubmit} sx={{ mt: 3 }}>
        Submit All Tasks
      </Button> */}
    </div>
  );
};

export default CreateTasks;
