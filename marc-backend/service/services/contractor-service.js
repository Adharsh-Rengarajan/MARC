import bcrypt from 'bcrypt';
import { UserModel } from '../models/contractor-model.js';
import { ProjectModel } from '../models/contractor-model.js';
import { v4 as uuidv4 } from 'uuid';

export const getUserRoles = async (email, password, requestedRole) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    if (user.role !== requestedRole) {
      throw new Error("Invalid role for this user");
    }

    return { roles: user.role };
  } catch (error) {
    throw error;
  }
};


export const createProjectService = async (projectData) => {
  const { projectName, manager, engineer, account, projectValue, bricks, steel, cement, coarseAggregate, fineAggregate, location } = projectData;
  const projectId = uuidv4(); 
  console.log("Generated projectId:", projectId);
  const newProject = new ProjectModel({
    projectId,
    projectName, 
    manager, 
    engineer, 
    account, 
    projectValue, 
    bricks, 
    steel, 
    cement, 
    coarseAggregate, 
    fineAggregate,
    location
  });
  if (!projectId) {
    throw new Error("Failed to generate project ID");
  }
  if (projectId === null || projectId === "") {
    throw new Error("Invalid projectId generated");
  }
  await newProject.save();
  return newProject;
};

export const viewProjectsService = async () => {
  return await ProjectModel.find(); 
};



export const getLoginData = async () => {
  try {
    return await UserModel.find();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateProject = async (projectName, projectData) => {
  try {
    console.log(projectName,"projectName");
    
    const project = await ProjectModel.findOne({ projectName });

    if (!project) {
      throw new Error('Project not found');
    }

    project.projectName = projectData.projectName || project.projectName;
    project.manager = projectData.manager || project.manager;
    project.engineer = projectData.engineer || project.engineer;
    project.account = projectData.account || project.account;
    project.projectValue = projectData.projectValue || project.projectValue;
    project.bricks = projectData.bricks || project.bricks;
    project.steel = projectData.steel || project.steel;
    project.cement = projectData.cement || project.cement;
    project.coarseAggregate = projectData.coarseAggregate || project.coarseAggregate;
    project.fineAggregate = projectData.fineAggregate || project.fineAggregate;
    project.location = projectData.location || project.location;

    await project.save();

    return project;
  } catch (error) {
    throw new Error('Error updating project: ' + error.message);
  }
};

export const deleteProjectService = async (projectName) => {
  try {
    const deletedProject = await ProjectModel.findOneAndDelete({ projectName });
    
    if (!deletedProject) {
      throw new Error("Project not found");
    }

    return deletedProject;
  } catch (error) {
    throw error;
  }
};
