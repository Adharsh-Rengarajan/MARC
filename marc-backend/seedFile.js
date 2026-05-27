import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { UserModel } from './service/models/contractor-model.js';

dotenv.config();

export const seedUsers = async () => {
  try {
    const users = [
      { email: 'engineer@example.com', 
        password: 'engineer123$', 
        name:"Engineer 1", 
        role: 'engineer' 
      },
      {
        email: "engineer2@example.com",
        name: "Engineer 2",
        role: "engineer",
        password: "engineer2123$"
      },
      {
        email: "engineer3@example.com",
        name: "Engineer 3",
        role: "engineer",
        password: "engineer3123$"
      },
      {
        email: "engineer4@example.com",
        name: "Engineer 4",
        role: "engineer",
        password: "engineer4123$"
      },
      { email: 'accountant@example.com', 
        password: 'accountant123$', 
        name:'Accountant', 
        role: 'accountant' 
      },
      { 
        email: 'owner@example.com', 
        password: 'owner123$', 
        name:'Marc owner', 
        role: 'owner' 
      },
      { 
        email: 'manager@example.com', 
        password: 'manager123$', 
        name:'Manager', 
        role: 'manager' },
      {
        email: "manager2@example.com",
        name: "Manager 2",
        role: "manager",
        password: "manager2123$"
      },
      {
        email: "manager3@example.com",
        name: "Manager 3",
        role: "manager",
        password: "manager3123$"
      },
      {
        email: "manager4@example.com",
        name: "Manager 4",
        role: "manager",
        password: "manager4123$"
      },
      {
        email: "accountant2@example.com",
        name: "Accountant 2",
        role: "accountant",
        password: "accountant2123$"
      },
      {
        email: "accountant3@example.com",
        name: "Accountant 3",
        role: "accountant",
        password: "accountant3123$"
      },
      {
        email: "accountant4@example.com",
        name: "Accountant 4",
        role: "accountant",
        password: "accountant4123$"
      }
    ];

    for (const user of users) {
      const userExists = await UserModel.findOne({ email: user.email });
      if (userExists) {
        console.log(`User with email ${user.email} already exists`);
        continue; 
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      const result = await UserModel.create(user);
      console.log("Inserted user:", result);  
    }

    console.log("Users seeded successfully");

  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
