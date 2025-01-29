import { combineReducers } from 'redux';
import managerTasksReducer from './managerTasksSlice'; 
import loginReducer from './loginSlice';
import ordersReducer from './accountsSlice'
import projectReducer from './projectSlice'

const rootReducer = combineReducers({
  managerTasks: managerTasksReducer, 
  login: loginReducer,
  order: ordersReducer,
  project: projectReducer
});

export default rootReducer;