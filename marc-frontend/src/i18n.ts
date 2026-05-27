import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        back: "Back",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        loading: "Loading...",
        logout: "Logout",
      },
      login: {
        title: "Sign in to MARC",
        email: "Email",
        password: "Password",
        loginButton: "Sign In",
        invalid: "Invalid email or password",
      },
      owner: {
        title: "Owner Dashboard",
        kpis: {
          projects: "Projects",
          users: "Team Members",
          activeOrders: "Active Orders",
          totalValue: "Total Project Value",
        },
        projects: "Projects",
        users: "Team",
        orders: "Material Orders",
        newProject: "New Project",
        newUser: "Add User",
      },
      manager: {
        title: "Manager Dashboard",
        myProjects: "My Projects",
        taskPlan: "Task Plan",
        requestMaterials: "Request Materials",
      },
      engineer: {
        title: "Engineer Dashboard",
        myProjects: "My Projects",
        tasks: "Tasks",
        submitReport: "Submit Report",
      },
      accountant: {
        title: "Accountant Dashboard",
        pendingOrders: "Pending Orders",
        approvedOrders: "Approved Orders",
        purchaseOrders: "Purchase Orders",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
