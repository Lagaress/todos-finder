import { TodoProvider } from '../../providers/TodoProvider';

export class TodoProviderSingleton {
  private static instance: TodoProvider;

  private constructor() {}

  public static getInstance(): TodoProvider {
    if (!TodoProviderSingleton.instance) {
      console.log("TodoProviderSingleton: Creating TodoProvider.");
      TodoProviderSingleton.instance = new TodoProvider();
    }
    return TodoProviderSingleton.instance;
  }
}
