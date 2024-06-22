import todoService from '../services/todoService';

async function refreshTodosCommand(): Promise<void> {
  console.log("refreshTodosCommand: Command execution started.");
  await todoService.updateTodoCount();
  console.log("refreshTodosCommand: Command execution finished.");
};

export default refreshTodosCommand;
