import todoService from '../services/todoService';
import { StatusBarSingleton } from "../types/Singleton/StatusBarSingleton";

async function refreshTodosCommand(): Promise<void> {
  console.log("refreshTodosCommand: Command execution started.");
  await todoService.updateTodoCount();
  console.log("refreshTodosCommand: Command execution finished.");
};

export default refreshTodosCommand;
