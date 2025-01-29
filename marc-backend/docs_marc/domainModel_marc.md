---
 
title: Construction management
 
---
classDiagram
class Contractor {
        +String contractorID
        +String name
        +String role
        +List<Project> projects
}
class Manager {
        +String managerID
        +String name
        +List<Project> assignedProjects
        +List<Task> tasks
        +List<Report> reports
    }
class MaterialOrder {
        +String orderID
        +String materialName
        +int quantity
        +Boolean approvalStatus
    }
class Task {
        +String taskID
        +String description
        +Engineer assignedTo
        +String status
        +Project project
    }

class Engineer {
        +String engineerID
        +String name
        +List<Task> tasks
        +List<Report> reports
}

class Accounts {

        +String accountID

        +String name

        +Double remainingFunds

        +List<MaterialOrder> orders

    }

MaterialOrder --> Accounts : requests approval

class Project {
        +String projectID
        +String name
        +Double value
        +List<Engineer> engineers
        +List<Manager> managers
        +List<Accounts> accounts
        +int sand
        +int cement
        +int steel
        +int coarseGravel
}

class Report {
        +String reportID
        +String taskID
        +int sandUsed
        +int cementUsed
        +int coarseGravelUsed
        +int steelUsed
}




MaterialOrder --> Accounts : requests approval

MaterialOrder --> Accounts : requests approval

Contractor --> Project : creates subgraph ManagementFlow
Project --> Manager : managed by
Manager --> Task : creates for
Task --> Engineer : assigned to
Report --> Manager : reviews
Engineer --> Report : generates
Report --> Manager : reviews
Project --> Task : contains
Manager --> MaterialOrder : places

Contractor --> Project : monitors

Contractor "1" --> "N" Project : creates
Project "1" --> "N" Manager : managed by
Project "1" --> "N" Engineer : employs
Project "1" --> "1" Accounts : tracks funds
Manager "1" --> "N" Task : creates for
Task "1" --> "1" Engineer : assigned to
Engineer "1" --> "N" Report : generates
Report "1" --> "1" Manager : reviewed by
Manager "1" --> "N" MaterialOrder : places
Accounts --> MaterialOrder : approves/rejects
MaterialOrder "1" --> "1" Accounts : requests approval
Accounts "1" --> "N" MaterialOrder : approves/rejects
