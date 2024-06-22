import todoService from '../services/todoService';

function refreshTodosCommand() {
  todoService.updateTodoCount();
};

export default refreshTodosCommand;
