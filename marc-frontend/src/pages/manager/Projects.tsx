import React, { useEffect, useState } from "react";
import { fetchProjectsByManager } from "../../redux/actions/managerTasksActions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import "./Projects.scss";
import NavBar from "../../components/Navbar";

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
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { email } = location.state || {}; // Default empty object if `location.state` is not provided

  const transformEmailToName = (email: string): string => {
    // Extract the part before '@'
    const username = email.split("@")[0];
  
    // Add space before numbers to ensure it's formatted as "Manager 2"
    const name = username
      .replace(/([a-z])(\d)/g, '$1 $2')  // Add space between a lowercase letter and a digit
      .replace(/^\w/, (c) => c.toUpperCase());  // Capitalize the first character of the name
  
    return name;
  };
  
  
  
  useEffect(() => {
    if (email) {
      const managerName = transformEmailToName(email);
      console.log(managerName)
      const fetchProjects = async () => {
        try {
          const data = await fetchProjectsByManager(managerName);
          const filteredProjects = data?.projects?.filter(
            (project: Project) => project.manager === managerName
          );

        setProjects(filteredProjects || []);
        setLoading(false);
      } catch (err: any) {
        setError(t("project.common.error", { message: err.message }));
        setLoading(false);
      }
    };

      fetchProjects();
    } else {
      setError("Email is not defined.");
      setLoading(false);
    }
  }, [email, t]); // Effect runs whenever `email` or `t` changes

  const handleCardClick = (projectName: string) => {
    navigate(`/manager`, { state: { projectName,email } });
  };

  const chartData = projects.map((project) => ({
    name: project.projectName,
    projectValue: project.projectValue,
    bricks: project.bricks,
    steel: project.steel,
    cement: project.cement,
  }));

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <>
    <NavBar title="manager"/>
    <div className="projects-container">

      <Typography variant="h4" className="projects-title">
        {t("project.projects.title")}
      </Typography>
      <Typography variant="body1" className="projects-summary">
        {t("project.projects.summary")}
      </Typography>

      <div className="bar-chart-section">
        <Typography variant="h6" className="bar-chart-title">
          {t("project.projects.chartTitle")}
        </Typography>
        <ResponsiveContainer width="90%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="projectValue" fill="#8884d8" barSize={20} />
            <Bar dataKey="bricks" fill="#82ca9d" barSize={20} />
            <Bar dataKey="steel" fill="#ffc658" barSize={20} />
            <Bar dataKey="cement" fill="#ff73ff" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="projects-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card
              key={project._id}
              className="project-card"
              onClick={() => handleCardClick(project.projectName)}
            >
              <CardContent className="card-content">
                <Typography variant="h6" className="card-title">
                  {project.projectName}
                </Typography>
                <Typography variant="body2" className="card-details">
                  <span>
                    {t("project.projects.projectDetails.engineer")}:{" "}
                    {project.engineer}
                  </span>
                  <span>
                    {t("project.projects.projectDetails.account")}:{" "}
                    {project.account}
                  </span>
                  <span>
                    {t("project.projects.projectDetails.projectValue")}: $
                    {project.projectValue}
                  </span>
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            variant="h6"
            color="textSecondary"
            className="error-message"
          >
            {t("project.projects.noProjects")}
          </Typography>
        )}
      </div>
    </div>
    </>
   
  );
};

export default Projects;
