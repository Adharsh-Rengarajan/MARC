import { getUserRoles, getLoginData, createProjectService, viewProjectsService, deleteProjectService, updateProject } from "../services/contractor-service.js";

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log("Request body:", req.body);

  console.log("Login attempt:", { email, role, password });
  
  try {
    if (!email || !password || !role) {
      return res.status(422).json({
        code: "MISSING_FIELDS",
        message: "Missing required fields for email, password, or role"
      });
    }

    const validRoles = ["owner", "manager", "engineer", "accountant"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        code: "INVALID_ROLE",
        message: "Invalid role provided"
      });
    }

    const { roles } = await getUserRoles(email, password, role);
    
    return res.status(200).json({
      success: true,
      role: roles
    });

  } catch (error) {
    console.error("Login error:", error);  

    if (error.message === "Invalid email" || error.message === "Invalid password" || error.message === "Invalid role for this user") {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: error.message
      });
    }

    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Server error, please try again later"
    });
  }
};

export const loginDetails = async (req, res) => {
  try {
    const loginData = await getLoginData();
    return res.status(200).json({
      success: true,
      data: loginData
    });
  } catch (error) {
    console.error("Get loginData error:", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Server error while fetching loginData"
    });
  }
}


export const createProject = async (req, res) => {
  const { projectName, manager, engineer, account, projectValue, bricks, steel, cement, coarseAggregate, fineAggregate, location } = req.body;

  try {
    if (!projectName || !manager || !engineer || !account || !projectValue) {
      return res.status(422).json({
        code: "MISSING_FIELDS",
        message: "Missing required fields"
      });
    }

    const newProject = await createProjectService({
      projectName, manager, engineer, account, projectValue, bricks, steel, cement, coarseAggregate, fineAggregate, location
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject
    });
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Server error while creating project"
    });
  }
};

export const viewProjects = async (req, res) => {
  try {
    const projects = await viewProjectsService();
    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error("View projects error:", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Server error while fetching projects"
    });
  }
};

export const updateProjectByName = async (req, res) => {
  const { projectName } = req.params; 
  const projectData = req.body; 

  try {
    const updatedProject = await updateProject(projectName, projectData);
    if (updatedProject) {
      return res.status(200).json({ message: 'Project updated successfully', data: updatedProject });
    } else {
      return res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ message: 'Failed to update project' });
  }
};


export const deleteProject = async (req, res) => {
  const { projectName } = req.params; 

  try {
    const deletedProject = await deleteProjectService(projectName);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Server error while deleting project"
    });
  }
};
