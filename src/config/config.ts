type TodosFinderConfig = {
  IGNORE_TODO_COMMENT: string;
  BASIC_TAG_TO_SEARCH: string;
  STATUS_BAR_ELEMENT_PRIORITY: number;
  DEFAULT_VALUES: {
    TAG: string;
    FILES_TO_INCLUDE: string;
    FILES_TO_EXCLUDE: string;  
  }
}

const config: TodosFinderConfig = {
  IGNORE_TODO_COMMENT: "//ignore-todo",
  BASIC_TAG_TO_SEARCH: "TODO",
  STATUS_BAR_ELEMENT_PRIORITY: 1,
  DEFAULT_VALUES: {
    TAG: '',
    FILES_TO_INCLUDE:  "**/*",
    FILES_TO_EXCLUDE: "**/node_modules/**",  
  }
}

export default config;