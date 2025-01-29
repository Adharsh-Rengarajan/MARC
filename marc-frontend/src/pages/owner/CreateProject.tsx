import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Modal,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";

import "./CreateProject.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchLogin } from "../../redux/actions/loginActions";
import { fetchProjects } from "../../redux/actions/projectActions";


interface Role {
  name: string;
  email: string;
  role: string;
}

interface Project {
  _id: string;
  projectName: string;
  manager: string;
  engineer: string;
  account: string;
  projectValue: number;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
  location: string;
}

interface FormData {
  projectName: string;
  manager: string;
  engineer: string;
  account: string;
  projectValue: number;
  bricks: number;
  steel: number;
  cement: number;
  coarseAggregate: number;
  fineAggregate: number;
  location: string;
}

export default function CreateProject() {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const { users } = useSelector((state: RootState) => state.login);
  // const { project } = useSelector((state: RootState) => state.project);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    manager: "",
    engineer: "",
    account: "",
    projectValue: 0,
    bricks: 0,
    steel: 0,
    cement: 0,
    coarseAggregate: 0,
    fineAggregate: 0,
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<{
    managers: Role[];
    engineers: Role[];
    accounts: Role[];
  }>({
    managers: [],
    engineers: [],
    accounts: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchProjectsAndRoles = async () => {
      try {
        const projectResponse = await axios.get(
          "http://localhost:9000/projects"
        );
        setProjects(projectResponse.data.data);
        setFilteredProjects(projectResponse.data.data);

        const rolesResponse = await axios.get("http://localhost:9000/login");
        const users = rolesResponse.data.data;

        setRoles({
          managers: users.filter((user: Role) => user.role === "manager"),
          engineers: users.filter((user: Role) => user.role === "engineer"),
          accounts: users.filter((user: Role) => user.role === "accountant"),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProjectsAndRoles();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const isNumberField = [
      "projectValue",
      "bricks",
      "steel",
      "cement",
      "coarseAggregate",
      "fineAggregate",
    ].includes(name);

    setFormData({
      ...formData,
      [name]: isNumberField
        ? value === "" 
          ? ""
          : Number(value) 
        : value,
    });
  };
  const handleCancel = () => {
    setFormData({
      projectName: "",
      manager: "",
      engineer: "",
      account: "",
      projectValue: 0,
      bricks: 0,
      steel: 0,
      cement: 0,
      coarseAggregate: 0,
      fineAggregate: 0,
      location: "",
    });
    setEditingProjectId(null);
    setIsModalOpen(false);
  };
  const handleSaveProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProjectId) {
        await axios.put(
          `http://localhost:9000/projects/${editingProjectId}`,
          formData
        );
        alert("Project updated successfully!");
      } else {
        await axios.post("http://localhost:9000/projects", formData);
        alert("Project created successfully!");
      }

      setFormData({
        projectName: "",
        manager: "",
        engineer: "",
        account: "",
        projectValue: 0,
        bricks: 0,
        steel: 0,
        cement: 0,
        coarseAggregate: 0,
        fineAggregate: 0,
        location: "",
      });
      setIsModalOpen(false);
      setEditingProjectId(null);

      const projectResponse = await axios.get("http://localhost:9000/projects");
      setProjects(projectResponse.data.data);
      setFilteredProjects(projectResponse.data.data);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (projectName: string) => {
    const projectToEdit = projects.find(
      (project) => project.projectName === projectName
    );
    if (projectToEdit) {
      setEditingProjectId(projectToEdit.projectName);
      setFormData({
        projectName: projectToEdit.projectName,
        manager: projectToEdit.manager,
        engineer: projectToEdit.engineer,
        account: projectToEdit.account,
        projectValue: projectToEdit.projectValue,
        bricks: projectToEdit.bricks,
        steel: projectToEdit.steel,
        cement: projectToEdit.cement,
        coarseAggregate: projectToEdit.coarseAggregate,
        fineAggregate: projectToEdit.fineAggregate,
        location: projectToEdit.location,
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteProject = async (projectName: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:9000/projects/${projectName}`);
        alert("Project deleted successfully!");

        const projectResponse = await axios.get(
          "http://localhost:9000/projects"
        );
        setProjects(projectResponse.data.data);
        setFilteredProjects(projectResponse.data.data);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
      }
    }
  };
  // useEffect(() => {
  //   dispatch(fetchLogin());
  //   dispatch(fetchProjects());
  // }, [dispatch]);
  // useEffect(()=>{
  //   setRoles({
  //     managers: users ? users.filter((user: Role) => user.role === "manager") : [],
  //     engineers: users ? users.filter((user: Role) => user.role === "engineer") : [],
  //     accounts: users ? users.filter((user: Role) => user.role === "accountant") : [],
  //   })
  //   if(project)
  //   setProjects(project);
  // },[users])

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <Typography variant="h4">{t("createProject.title")}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingProjectId(null);
            setIsModalOpen(true);
          }}
        >
          {t("createProject.createNewProject")}
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder={t("createProject.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.projectName}</Typography>
                <Typography>
                  {t("createProject.managers")}: {project.manager}
                </Typography>
                <Typography>
                  {t("createProject.engineers")}: {project.engineer}
                </Typography>
                <Typography>
                  {t("createProject.accounts")}: {project.account}
                </Typography>
                <Typography>
                  <strong>{t("createProject.projectValue")}: ${project.projectValue}</strong>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 2,
                  }}
                >
                  <Button
                    onClick={() => handleEditProject(project.projectName)}
                    sx={{ marginRight: 1 }}
                  >
                    {t("createProject.edit")}
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteProject(project.projectName)}
                  >
                    {t("createProject.delete")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSaveProject}
          sx={{
            backgroundColor: "white",
            padding: 3,
            borderRadius: 1,
            width: "80%",
            maxWidth: 800,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 3 }}>
            {editingProjectId
              ? t("createProject.edit")
              : t("createProject.")}
          </Typography>

          <TextField
            label={t("createProject.createNewProject")}
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
            autoComplete="off" 
          />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.managers")}
                name="manager"
                select
                value={formData.manager}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              >
                {roles.managers.map((manager) => (
                  <MenuItem key={manager.name} value={manager.name}>
                    {manager.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.engineers")}
                name="engineer"
                select
                value={formData.engineer}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              >
                {roles.engineers.map((engineer) => (
                  <MenuItem key={engineer.name} value={engineer.name}>
                    {engineer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.accounts")}
                name="account"
                select
                value={formData.account}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              >
                {roles.accounts.map((account) => (
                  <MenuItem key={account.name} value={account.name}>
                    {account.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>
            {t("createProject.title")}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.projectValue")}
                name="projectValue"
                value={formData.projectValue || ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                autoComplete="off" 
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.bricks")}
                name="bricks"
                value={formData.bricks || ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                autoComplete="off" 
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.steel")}
                name="steel"
                value={formData.steel || ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                autoComplete="off" 
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.cement")}
                name="cement"
                value={formData.cement || ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                autoComplete="off" 
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.coarseAggregate")}
                name="coarseAggregate"
                value={formData.coarseAggregate || ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                autoComplete="off" 
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("createProject.fineAggregate")}
                name="fineAggregate"
                value={formData.fineAggregate || ""}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                autoComplete="off" 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("createProject.Location")}
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                autoComplete="off" 
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              {t("createProject.cancel")}
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editingProjectId ? (
                t("createProject.save")
              ) : (
                t("createProject.createNewProject")
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
